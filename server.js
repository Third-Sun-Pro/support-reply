require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const { draftReplyStream, answerStream, logIncident, addKnowledge, formatKnowledge } = require("./generate");

// ---------------------------------------------------------------------------
// Structured logger
// ---------------------------------------------------------------------------
function log(level, msg, extra = {}) {
  const entry = { time: new Date().toISOString(), level, msg, ...extra };
  const out = level === "error" ? process.stderr : process.stdout;
  out.write(JSON.stringify(entry) + "\n");
}

// ---------------------------------------------------------------------------
// Startup validation
// ---------------------------------------------------------------------------
const REQUIRED_ENV = ["APP_PASSWORD", "ANTHROPIC_API_KEY"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    log("error", `Fatal: ${key} environment variable is not set.`);
    process.exit(1);
  }
}

const app = express();

const APP_PASSWORD = process.env.APP_PASSWORD;
const AUTH_SECRET = APP_PASSWORD;

// ---------------------------------------------------------------------------
// Auth token helpers — HMAC-SHA256 signed cookies
// ---------------------------------------------------------------------------
function createAuthToken() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", AUTH_SECRET).update(timestamp).digest("hex");
  return `${timestamp}.${hmac}`;
}

function verifyAuthToken(token) {
  if (!token || !AUTH_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;
  const expected = crypto.createHmac("sha256", AUTH_SECRET).update(timestamp).digest("hex");
  if (expected.length !== signature.length) return false;
  const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return false;
  const age = Date.now() - parseInt(timestamp, 10);
  return age < 24 * 60 * 60 * 1000;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.auth_token;
  if (!verifyAuthToken(token)) {
    return res.status(401).json({ error: "Authentication required." });
  }
  next();
}

const isTest = process.env.NODE_ENV === "test";

const apiLimiter = isTest
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests. Please try again later." },
    });

const loginLimiter = isTest
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many login attempts. Please try again later." },
    });

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  req.id = crypto.randomUUID().slice(0, 8);
  if (req.method === "GET" && !req.path.startsWith("/auth")) return next();
  const start = Date.now();
  res.on("finish", () => {
    log("info", "request", { reqId: req.id, method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - start });
  });
  next();
});

app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------
app.post("/login", loginLimiter, (req, res) => {
  const { password } = req.body;
  if (password !== APP_PASSWORD) {
    return res.status(401).json({ error: "Invalid password." });
  }
  const token = createAuthToken();
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ success: true });
});

app.get("/auth-check", (req, res) => {
  const token = req.cookies && req.cookies.auth_token;
  res.json({ authenticated: verifyAuthToken(token) });
});

app.post("/logout", (_req, res) => {
  res.clearCookie("auth_token");
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// Client directory — parsed from knowledge/clients.md at startup
// ---------------------------------------------------------------------------
const clientList = (() => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, "knowledge", "clients.md"), "utf-8");
    const clients = [];
    const blocks = raw.split(/^## /m).slice(1);
    for (const block of blocks) {
      const lines = block.trim().split("\n");
      const name = lines[0].trim();
      let website = "", type = "", joomla = "";
      for (const line of lines.slice(1)) {
        const match = line.match(/^\s*-\s*\*\*(\w[\w\s]*?):\*\*\s*(.+)/);
        if (!match) continue;
        const key = match[1].trim().toLowerCase();
        const val = match[2].trim();
        if (key === "website") website = val;
        else if (key === "type") type = val;
        else if (key === "joomla") joomla = val;
      }
      if (website) clients.push({ name, website, type, joomla });
    }
    log("info", "Client directory loaded", { count: clients.length });
    return clients;
  } catch (err) {
    log("error", "Failed to load client directory", { error: err.message });
    return [];
  }
})();

app.get("/clients", requireAuth, (_req, res) => {
  res.json(clientList);
});

// ---------------------------------------------------------------------------
// Draft reply — streaming endpoint
// ---------------------------------------------------------------------------
app.post("/draft-reply", requireAuth, apiLimiter, async (req, res) => {
  const { email, clientName, siteUrl } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Client email text is required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const TIMEOUT_MS = 90_000;
  let finished = false;

  const timeout = setTimeout(() => {
    if (finished) return;
    finished = true;
    log("error", "Draft reply timed out", { reqId: req.id });
    res.write(`data: ${JSON.stringify({ error: "Request timed out. Please try again." })}\n\n`);
    res.end();
  }, TIMEOUT_MS);

  req.on("close", () => {
    finished = true;
    clearTimeout(timeout);
  });

  try {
    log("info", "Drafting reply", { reqId: req.id, clientName: clientName || null });

    const { triage, usage } = await draftReplyStream(
      email.trim(),
      { clientName: clientName?.trim() || null, siteUrl: siteUrl?.trim() || null },
      (delta) => {
        if (!finished) res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    );

    if (!finished) {
      log("info", "Reply drafted", { reqId: req.id, triage, usage });
      res.write(`data: ${JSON.stringify({ done: true, triage })}\n\n`);
    }
  } catch (err) {
    if (!finished) {
      log("error", "Draft reply failed", { reqId: req.id, error: err.message || String(err) });
      res.write(`data: ${JSON.stringify({ error: cleanErrorMessage(err) })}\n\n`);
    }
  } finally {
    finished = true;
    clearTimeout(timeout);
    if (!res.writableEnded) res.end();
  }
});

// ---------------------------------------------------------------------------
// Ask a question — streaming Q&A endpoint
// ---------------------------------------------------------------------------
app.post("/ask", requireAuth, apiLimiter, async (req, res) => {
  const { question, category } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question is required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const TIMEOUT_MS = 90_000;
  let finished = false;

  const timeout = setTimeout(() => {
    if (finished) return;
    finished = true;
    log("error", "Q&A timed out", { reqId: req.id });
    res.write(`data: ${JSON.stringify({ error: "Request timed out. Please try again." })}\n\n`);
    res.end();
  }, TIMEOUT_MS);

  req.on("close", () => {
    finished = true;
    clearTimeout(timeout);
  });

  try {
    log("info", "Answering question", { reqId: req.id, category: category || null });

    const { usage } = await answerStream(
      question.trim(),
      category?.trim() || null,
      (delta) => {
        if (!finished) res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    );

    if (!finished) {
      log("info", "Question answered", { reqId: req.id, usage });
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }
  } catch (err) {
    if (!finished) {
      log("error", "Q&A failed", { reqId: req.id, error: err.message || String(err) });
      res.write(`data: ${JSON.stringify({ error: cleanErrorMessage(err) })}\n\n`);
    }
  } finally {
    finished = true;
    clearTimeout(timeout);
    if (!res.writableEnded) res.end();
  }
});

// ---------------------------------------------------------------------------
// Log incident
// ---------------------------------------------------------------------------
app.post("/incidents", requireAuth, (req, res) => {
  const { title, severity, affected, description, resolution, handler } = req.body;

  if (!title || !title.trim() || !description || !description.trim()) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  try {
    const result = logIncident({
      title: title.trim(),
      severity: severity?.trim() || undefined,
      affected: affected?.trim() || undefined,
      description: description.trim(),
      resolution: resolution?.trim() || undefined,
      handler: handler?.trim() || undefined,
    });

    log("info", "Incident logged", { reqId: req.id, ...result });
    res.json({ success: true, ...result });
  } catch (err) {
    log("error", "Incident logging failed", { reqId: req.id, error: err.message });
    res.status(500).json({ error: "Failed to log incident." });
  }
});

// ---------------------------------------------------------------------------
// Format knowledge — AI-powered formatting before saving
// ---------------------------------------------------------------------------
app.post("/knowledge/format", requireAuth, apiLimiter, async (req, res) => {
  const { category, content } = req.body;

  if (!category || !category.trim()) {
    return res.status(400).json({ error: "Category is required." });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content is required." });
  }

  try {
    const result = await formatKnowledge({
      category: category.trim(),
      content: content.trim(),
    });

    log("info", "Knowledge formatted", { reqId: req.id, title: result.title, category: result.category });
    res.json({ success: true, ...result });
  } catch (err) {
    log("error", "Knowledge format failed", { reqId: req.id, error: err.message });
    if (err.message.startsWith("Invalid category") || err.message.startsWith("Could not extract")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: cleanErrorMessage(err) });
  }
});

// ---------------------------------------------------------------------------
// Add knowledge
// ---------------------------------------------------------------------------
app.post("/knowledge", requireAuth, (req, res) => {
  const { category, content } = req.body;

  if (!category || !category.trim()) {
    return res.status(400).json({ error: "Category is required." });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content is required." });
  }

  try {
    const result = addKnowledge({
      category: category.trim(),
      content: content.trim(),
    });

    log("info", "Knowledge added", { reqId: req.id, ...result });
    res.json({ success: true, ...result });
  } catch (err) {
    log("error", "Add knowledge failed", { reqId: req.id, error: err.message });
    if (err.message.startsWith("Invalid category")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to add knowledge." });
  }
});

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------
function cleanErrorMessage(err) {
  const errorType = err.error && err.error.type;
  if (errorType) {
    if (errorType === "overloaded_error") return "The AI service is currently overloaded. Please wait a moment and try again.";
    if (errorType === "rate_limit_error") return "Rate limit reached. Please wait a moment and try again.";
    if (errorType === "authentication_error") return "API key is missing or invalid. Contact your administrator.";
    if (errorType === "invalid_request_error") return "Request could not be processed. Try again.";
  }

  const code = err.code || (err.cause && err.cause.code);
  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT") {
    return "Could not reach the AI service. Check your internet connection and try again.";
  }

  if (err.status === 429) return "Rate limit reached. Please wait a moment and try again.";
  if (err.status === 401) return "API key is missing or invalid. Contact your administrator.";
  if (err.status >= 500) return "The AI service is temporarily unavailable. Please try again.";

  return err.message || "Something went wrong. Please try again.";
}

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    log("info", "Server running", { port: Number(PORT) });
  });
}

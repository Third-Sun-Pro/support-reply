require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

// ---------------------------------------------------------------------------
// Load knowledge base and system prompts at startup
// ---------------------------------------------------------------------------
const draftSystemPrompt = fs.readFileSync(path.join(__dirname, "system-prompt.md"), "utf-8");
const qaSystemPrompt = fs.readFileSync(path.join(__dirname, "qa-system-prompt.md"), "utf-8");

const knowledgeDir = path.join(__dirname, "knowledge");

let knowledgeText = loadKnowledgeText();

function loadKnowledgeText() {
  const files = fs.readdirSync(knowledgeDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files
    .map((f) => fs.readFileSync(path.join(knowledgeDir, f), "utf-8"))
    .join("\n\n---\n\n");
}

// ---------------------------------------------------------------------------
// Reload knowledge (called after incident logging)
// ---------------------------------------------------------------------------
function reloadKnowledge() {
  knowledgeText = loadKnowledgeText();
}

// ---------------------------------------------------------------------------
// Build request params — Draft Reply mode
// ---------------------------------------------------------------------------
function buildDraftParams(emailText, context = {}) {
  const contentBlocks = [];

  // Knowledge base (cached — reused across requests)
  contentBlocks.push({
    type: "text",
    text: `## Reference Knowledge Base\n\n${knowledgeText}`,
    cache_control: { type: "ephemeral" },
  });

  // Client context if provided
  let contextLine = "";
  if (context.clientName) contextLine += `Client name: ${context.clientName}. `;
  if (context.siteUrl) contextLine += `Client website: ${context.siteUrl}. `;

  // The client email
  let userMessage = "";
  if (contextLine) userMessage += `${contextLine}\n\n`;
  userMessage += `## Client Email\n\n${emailText}\n\n## Instructions\n\nDraft a reply to this client email. Follow the system prompt guidelines exactly. End with either [NEEDS TROY] or [ROUTINE] on its own line.`;

  contentBlocks.push({ type: "text", text: userMessage });

  return {
    model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: draftSystemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: contentBlocks,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Build request params — Q&A mode
// ---------------------------------------------------------------------------
function buildQAParams(question, category = null) {
  const contentBlocks = [];

  contentBlocks.push({
    type: "text",
    text: `## Reference Knowledge Base\n\n${knowledgeText}`,
    cache_control: { type: "ephemeral" },
  });

  let userMessage = "";
  if (category) userMessage += `Category: ${category}\n\n`;
  userMessage += `## Question\n\n${question}\n\n## Instructions\n\nAnswer this question using the knowledge base above. Follow the system prompt guidelines. Be concise and practical.`;

  contentBlocks.push({ type: "text", text: userMessage });

  return {
    model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: qaSystemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: contentBlocks,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Extract triage tag from response
// ---------------------------------------------------------------------------
function extractTriage(text) {
  if (text.includes("[NEEDS TROY]")) return "needs-troy";
  return "routine";
}

// ---------------------------------------------------------------------------
// Strip triage tag from visible reply text
// ---------------------------------------------------------------------------
function stripTriageTag(text) {
  return text
    .replace(/\n*\[NEEDS TROY\]\s*$/m, "")
    .replace(/\n*\[ROUTINE\]\s*$/m, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Streaming generation — Draft Reply
// ---------------------------------------------------------------------------
async function draftReplyStream(emailText, context, onChunk) {
  const client = new Anthropic({ maxRetries: 5 });
  const params = buildDraftParams(emailText, context);
  const start = Date.now();
  const stream = client.messages.stream(params);

  let fullText = "";
  let flushedTo = 0;
  const MAX_TAG_LEN = 12; // length of "[NEEDS TROY]"

  function flushSafeText() {
    // Hold back the last MAX_TAG_LEN chars — they might be a partial triage tag
    const safeEnd = Math.max(flushedTo, fullText.length - MAX_TAG_LEN);
    if (safeEnd > flushedTo) {
      onChunk(fullText.slice(flushedTo, safeEnd));
      flushedTo = safeEnd;
    }
  }

  stream.on("text", (delta) => {
    fullText += delta;
    flushSafeText();
  });

  const finalMessage = await stream.finalMessage();

  // Final flush: strip the triage tag and emit any remaining safe text
  const cleanedFinal = stripTriageTag(fullText);
  if (flushedTo < cleanedFinal.length) {
    onChunk(cleanedFinal.slice(flushedTo));
  }

  const durationMs = Date.now() - start;
  const markdownText = finalMessage.content[0].text;
  const triage = extractTriage(markdownText);

  const usage = finalMessage.usage
    ? {
        input: finalMessage.usage.input_tokens,
        output: finalMessage.usage.output_tokens,
        cacheRead: finalMessage.usage.cache_read_input_tokens || 0,
        durationMs,
      }
    : null;

  return { triage, usage };
}

// ---------------------------------------------------------------------------
// Streaming generation — Q&A
// ---------------------------------------------------------------------------
async function answerStream(question, category, onChunk) {
  const client = new Anthropic({ maxRetries: 5 });
  const params = buildQAParams(question, category);
  const start = Date.now();
  const stream = client.messages.stream(params);

  let fullText = "";

  stream.on("text", (delta) => {
    fullText += delta;
    onChunk(delta);
  });

  const finalMessage = await stream.finalMessage();

  const durationMs = Date.now() - start;
  const usage = finalMessage.usage
    ? {
        input: finalMessage.usage.input_tokens,
        output: finalMessage.usage.output_tokens,
        cacheRead: finalMessage.usage.cache_read_input_tokens || 0,
        durationMs,
      }
    : null;

  return { usage };
}

// ---------------------------------------------------------------------------
// Editable knowledge files — allowlist (excludes clients.md and incidents.md)
// ---------------------------------------------------------------------------
const KNOWLEDGE_FILES = {
  hosting: "hosting.md",
  domains: "domains.md",
  "common-tasks": "common-tasks.md",
  "joomla-components": "joomla-components.md",
  "general-issues": "general-issues.md",
  "tools-accounts": "tools-accounts.md",
  admin: "admin.md",
  "help-docs": "help-docs.md",
  "example-replies": "example-replies.md",
};

// ---------------------------------------------------------------------------
// Format knowledge — use Claude to extract and format raw input
// ---------------------------------------------------------------------------
async function formatKnowledge({ category, content }) {
  const filename = KNOWLEDGE_FILES[category];
  if (!filename) {
    throw new Error(`Invalid category: ${category}`);
  }

  // Read a sample of the target file so Claude can match its style
  const filePath = path.join(knowledgeDir, filename);
  const existingContent = fs.readFileSync(filePath, "utf-8");
  // Take first ~2000 chars as a style sample
  const styleSample = existingContent.slice(0, 2000);

  const client = new Anthropic({ maxRetries: 3 });

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: `You are a knowledge base formatter for Third Sun Productions, a web design agency. Your job is to take raw input (emails, notes, meeting notes, pasted content) and extract the relevant information, then format it as a clean markdown section that matches the style of the existing knowledge file.

Rules:
- Output ONLY the formatted markdown section, nothing else
- First line must be the section heading (plain text, no ## prefix — that gets added automatically)
- Use **Bold:** Value format for key-value pairs (matching the existing file style)
- Strip out email signatures, greetings, email headers, forwarded message markers, and other noise
- Extract only the operationally useful information
- Keep it concise — this is a reference document, not a transcript
- If the input contains client-specific info (names, websites, contact info), include it
- If the input is unclear or contains no useful knowledge, respond with exactly: NO_USEFUL_CONTENT`,
      },
    ],
    messages: [
      {
        role: "user",
        content: `Here is a sample of the existing "${category}" knowledge file for style reference:\n\n${styleSample}\n\n---\n\nPlease format the following raw input as a new section for this file:\n\n${content}`,
      },
    ],
  });

  const formatted = response.content[0].text.trim();

  if (formatted === "NO_USEFUL_CONTENT") {
    throw new Error("Could not extract useful knowledge from the provided content. Try adding more specific information.");
  }

  // Extract title from first line
  const lines = formatted.split("\n");
  const title = lines[0].replace(/^#+\s*/, "").trim();

  return { formatted, title, category };
}

// ---------------------------------------------------------------------------
// Add knowledge — append a section to a knowledge file
// ---------------------------------------------------------------------------
function addKnowledge({ category, content }) {
  const filename = KNOWLEDGE_FILES[category];
  if (!filename) {
    throw new Error(`Invalid category: ${category}`);
  }

  // First line becomes the ## heading, rest is the body
  const lines = content.split("\n");
  const title = lines[0].replace(/^#+\s*/, "").trim();
  const body = lines.slice(1).join("\n").trim();

  const filePath = path.join(knowledgeDir, filename);
  const entry = body ? `\n\n## ${title}\n${body}\n` : `\n\n## ${title}\n`;
  fs.appendFileSync(filePath, entry, "utf-8");

  reloadKnowledge();

  return { category, title };
}

// ---------------------------------------------------------------------------
// Log incident — append to incidents.md
// ---------------------------------------------------------------------------
function logIncident(incident) {
  const incidentsPath = path.join(__dirname, "knowledge", "incidents.md");
  const date = new Date().toISOString().split("T")[0];
  const entry = `
---

## ${date} — ${incident.title}
- **Severity:** ${incident.severity || "Unknown"}
- **Affected:** ${incident.affected || "Unknown"}
- **Issue:** ${incident.description}
- **Resolution:** ${incident.resolution || "Pending"}
- **Handled by:** ${incident.handler || "Unknown"}
`;
  fs.appendFileSync(incidentsPath, entry, "utf-8");

  // Reload knowledge text so new incidents are included in future requests
  reloadKnowledge();

  return { date, title: incident.title };
}

module.exports = {
  draftReplyStream,
  answerStream,
  logIncident,
  addKnowledge,
  formatKnowledge,
  reloadKnowledge,
  buildDraftParams,
  buildQAParams,
  extractTriage,
  stripTriageTag,
  KNOWLEDGE_FILES,
};

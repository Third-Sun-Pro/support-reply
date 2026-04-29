require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Anthropic = require("@anthropic-ai/sdk");

// ---------------------------------------------------------------------------
// Load knowledge base and system prompts at startup
// ---------------------------------------------------------------------------
const draftSystemPrompt = fs.readFileSync(path.join(__dirname, "system-prompt.md"), "utf-8");
const qaSystemPrompt = fs.readFileSync(path.join(__dirname, "qa-system-prompt.md"), "utf-8");

const knowledgeDir = path.join(__dirname, "knowledge");

// Files excluded from draft-reply context (internal-only, not useful for client emails)
const DRAFT_EXCLUDE = new Set(["admin.md", "tools-accounts.md"]);

let knowledgeText = loadKnowledgeText();
let draftKnowledgeText = loadKnowledgeText(DRAFT_EXCLUDE);

function loadKnowledgeText(exclude = new Set()) {
  const files = fs.readdirSync(knowledgeDir)
    .filter((f) => f.endsWith(".md") && !exclude.has(f))
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
  draftKnowledgeText = loadKnowledgeText(DRAFT_EXCLUDE);
}

// ---------------------------------------------------------------------------
// Build request params — Draft Reply mode
// ---------------------------------------------------------------------------
function buildDraftParams(emailText, context = {}) {
  const contentBlocks = [];

  // Knowledge base (cached — reused across requests)
  contentBlocks.push({
    type: "text",
    text: `## Reference Knowledge Base\n\n${draftKnowledgeText}`,
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
function buildQAParams(question, category = null, history = []) {
  const systemBlocks = [
    {
      type: "text",
      text: qaSystemPrompt,
      cache_control: { type: "ephemeral" },
    },
  ];

  const messages = [];

  // First user message always includes the knowledge base (cached)
  const firstUserContent = [
    {
      type: "text",
      text: `## Reference Knowledge Base\n\n${knowledgeText}`,
      cache_control: { type: "ephemeral" },
    },
  ];

  if (history.length === 0) {
    // Single-turn: same behavior as before
    let userMessage = "";
    if (category) userMessage += `Category: ${category}\n\n`;
    userMessage += `## Question\n\n${question}\n\n## Instructions\n\nAnswer this question using the knowledge base above. Follow the system prompt guidelines. Be concise and practical.`;
    firstUserContent.push({ type: "text", text: userMessage });
    messages.push({ role: "user", content: firstUserContent });
  } else {
    // Multi-turn: knowledge base in first user message, then replay history, then follow-up
    let firstUserMsg = "";
    if (category) firstUserMsg += `Category: ${category}\n\n`;
    firstUserMsg += `## Question\n\n${history[0].content}\n\n## Instructions\n\nAnswer this question using the knowledge base above. Follow the system prompt guidelines. Be concise and practical.`;
    firstUserContent.push({ type: "text", text: firstUserMsg });
    messages.push({ role: "user", content: firstUserContent });

    // Remaining history turns (starting from assistant's first reply)
    for (let i = 1; i < history.length; i++) {
      messages.push({ role: history[i].role, content: history[i].content });
    }

    // New follow-up question
    messages.push({ role: "user", content: `## Follow-up Question\n\n${question}` });
  }

  return {
    model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemBlocks,
    messages,
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
async function answerStream(question, category, onChunk, history = []) {
  const client = new Anthropic({ maxRetries: 5 });
  const params = buildQAParams(question, category, history);
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

// ---------------------------------------------------------------------------
// Browse knowledge base — parse all files into structured index
// ---------------------------------------------------------------------------
function getKnowledgeIndex() {
  const files = fs.readdirSync(knowledgeDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  return files.map((filename) => {
    const filePath = path.join(knowledgeDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const stat = fs.statSync(filePath);

    const category = filename.replace(".md", "");
    const titleMatch = raw.match(/^# (.+)$/m);
    const label = titleMatch ? titleMatch[1].trim() : category;

    const sections = [];
    const blocks = raw.split(/^## /m).slice(1);
    for (const block of blocks) {
      const lines = block.split("\n");
      const title = lines[0].trim();
      const content = lines.slice(1).join("\n").trim();
      sections.push({ title, content });
    }

    return {
      category,
      label,
      filename,
      sectionCount: sections.length,
      lastModified: stat.mtime.toISOString(),
      sections,
    };
  });
}

// ---------------------------------------------------------------------------
// Get incidents — parse incidents.md into structured array
// ---------------------------------------------------------------------------
function getIncidents() {
  const incidentsPath = path.join(knowledgeDir, "incidents.md");
  const raw = fs.readFileSync(incidentsPath, "utf-8");

  const blocks = raw.split(/^---$/m).slice(1);
  const incidents = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const titleMatch = trimmed.match(/^## (\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)$/m);
    if (!titleMatch) continue;

    const date = titleMatch[1];
    const title = titleMatch[2].trim();

    const getField = (key) => {
      const match = trimmed.match(new RegExp(`^\\s*-\\s*\\*\\*${key}:\\*\\*\\s*(.+)`, "mi"));
      return match ? match[1].trim() : null;
    };

    incidents.push({
      date,
      title,
      severity: getField("Severity") || "Unknown",
      affected: getField("Affected") || "Unknown",
      description: getField("Issue") || getField("Description") || "",
      resolution: getField("Resolution") || "Pending",
      handler: getField("Handled by") || "Unknown",
    });
  }

  return incidents.reverse();
}

// ---------------------------------------------------------------------------
// Parse help-docs.md into structured data (pages + Scribe guides)
// ---------------------------------------------------------------------------
function getHelpDocs() {
  const filePath = path.join(knowledgeDir, "help-docs.md");
  const raw = fs.readFileSync(filePath, "utf-8");

  const pages = [];
  const guides = [];

  // Split into pages section and guides section
  const guidesStart = raw.indexOf("## Scribe Guides");
  const pagesSection = guidesStart > -1 ? raw.slice(0, guidesStart) : raw;
  const guidesSection = guidesStart > -1 ? raw.slice(guidesStart) : "";

  // Parse pages — supports both formats:
  // - **Title:** /path  (compact, URL is a path suffix)
  // - **Title:** https://full-url\n  Covers: description  (legacy)
  const pageRegex = /^- \*\*(.+?):\*\*\s+(\S+)/gm;
  for (const match of pagesSection.matchAll(pageRegex)) {
    let url = match[2].trim();
    if (url.startsWith("/")) url = "https://thirdsun.com/help-docs" + url;
    pages.push({ title: match[1].trim(), url, description: match[1].trim() });
  }

  // Parse guides — supports both formats:
  // - Title: https://url  (compact)
  // - **Title:** https://url\n  Covers: description  (legacy)
  const categories = [];
  const catRegex = /^### (.+)$/gm;
  let catMatch;
  while ((catMatch = catRegex.exec(guidesSection)) !== null) {
    categories.push({ name: catMatch[1].trim(), index: catMatch.index });
  }

  const guideRegex = /^- (?:\*\*)?(.+?)(?:\*\*)?:\s+(https?:\/\/\S+)/gm;
  for (const match of guidesSection.matchAll(guideRegex)) {
    let category = "General";
    for (const cat of categories) {
      if (match.index > cat.index) category = cat.name;
    }
    guides.push({ title: match[1].trim(), url: match[2].trim(), description: match[1].trim(), category });
  }

  return { pages, guides };
}

// ---------------------------------------------------------------------------
// Common Issues — pinned Q&As and free-form how-tos, stored as JSON
// ---------------------------------------------------------------------------
const commonIssuesPath = path.join(knowledgeDir, "common-issues.json");

function readCommonIssuesFile() {
  if (!fs.existsSync(commonIssuesPath)) return [];
  try {
    const raw = fs.readFileSync(commonIssuesPath, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCommonIssuesFile(items) {
  fs.writeFileSync(commonIssuesPath, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

function getCommonIssues() {
  return readCommonIssuesFile().sort((a, b) => (b.addedAt || "").localeCompare(a.addedAt || ""));
}

function addCommonIssue({ title, answer, question = null, source = "manual", addedBy = null }) {
  const cleanTitle = (title || "").trim();
  const cleanAnswer = (answer || "").trim();
  if (!cleanTitle) throw new Error("Title is required.");
  if (!cleanAnswer) throw new Error("Answer is required.");

  const items = readCommonIssuesFile();
  const item = {
    id: crypto.randomUUID(),
    title: cleanTitle,
    answer: cleanAnswer,
    question: question ? question.trim() : null,
    source: source === "qa" ? "qa" : "manual",
    addedBy: addedBy ? addedBy.trim() : null,
    addedAt: new Date().toISOString(),
  };
  items.push(item);
  writeCommonIssuesFile(items);
  return item;
}

function updateCommonIssue(id, { title, answer }) {
  const items = readCommonIssuesFile();
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) throw new Error("Not found.");

  if (title !== undefined) {
    const cleanTitle = String(title).trim();
    if (!cleanTitle) throw new Error("Title cannot be empty.");
    items[idx].title = cleanTitle;
  }
  if (answer !== undefined) {
    const cleanAnswer = String(answer).trim();
    if (!cleanAnswer) throw new Error("Answer cannot be empty.");
    items[idx].answer = cleanAnswer;
  }
  items[idx].updatedAt = new Date().toISOString();
  writeCommonIssuesFile(items);
  return items[idx];
}

function deleteCommonIssue(id) {
  const items = readCommonIssuesFile();
  const next = items.filter((it) => it.id !== id);
  if (next.length === items.length) throw new Error("Not found.");
  writeCommonIssuesFile(next);
  return { id };
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
  getKnowledgeIndex,
  getIncidents,
  getHelpDocs,
  getCommonIssues,
  addCommonIssue,
  updateCommonIssue,
  deleteCommonIssue,
};

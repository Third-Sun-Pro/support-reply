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
  reloadKnowledge,
  buildDraftParams,
  buildQAParams,
  extractTriage,
  stripTriageTag,
};

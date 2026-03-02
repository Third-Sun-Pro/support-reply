require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

// ---------------------------------------------------------------------------
// Load knowledge base at startup
// ---------------------------------------------------------------------------
const systemPrompt = fs.readFileSync(path.join(__dirname, "system-prompt.md"), "utf-8");

const knowledgeDir = path.join(__dirname, "knowledge");
const knowledgeFiles = fs.readdirSync(knowledgeDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

const knowledgeText = knowledgeFiles
  .map((f) => fs.readFileSync(path.join(knowledgeDir, f), "utf-8"))
  .join("\n\n---\n\n");

// ---------------------------------------------------------------------------
// Build request params
// ---------------------------------------------------------------------------
function buildRequestParams(emailText, context = {}) {
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
        text: systemPrompt,
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
// Streaming generation
// ---------------------------------------------------------------------------
async function draftReplyStream(emailText, context, onChunk) {
  const client = new Anthropic({ maxRetries: 5 });
  const params = buildRequestParams(emailText, context);
  const start = Date.now();
  const stream = client.messages.stream(params);

  let fullText = "";

  stream.on("text", (delta) => {
    fullText += delta;
    // Don't stream the triage tag to the frontend
    if (!delta.includes("[NEEDS") && !delta.includes("[ROUTINE")) {
      onChunk(delta);
    }
  });

  const finalMessage = await stream.finalMessage();
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

module.exports = { draftReplyStream, buildRequestParams, extractTriage, stripTriageTag };

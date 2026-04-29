# Support Hub — Third Sun Internal Operations Tool

## What This Is
Combined support tool for Third Sun Productions with six tabs:
1. **Draft Reply** — AI-powered client support email drafting with auto-detection, client directory lookup, and triage routing
2. **Ask a Question** — Multi-turn Q&A against the knowledge base with conversation history (hosting, domains, Joomla, troubleshooting, tools, business admin)
3. **Common Issues** — Team-shared list of pinned how-tos. Pin a Q&A answer with one click, or add free-form entries via the "+ Add" button
4. **Log Incident** — Record security incidents, outages, and issues (appended to knowledge base), with recent incident viewer
5. **Knowledge Base** — Browse/search the full knowledge base, and add new sections via AI-powered formatting
6. **Quick Reference** — Searchable client directory (153 clients) and help docs/Scribe guide link library with copy-to-clipboard

## Stack
Node.js, Express 5, Anthropic SDK (`claude-sonnet-4-6`), vanilla HTML/CSS/JS frontend. HMAC-SHA256 cookie auth. SSE streaming. Markdown knowledge files with Anthropic prompt caching.

## Project Structure
```
support-reply/
├── server.js              # Express server — auth, /draft-reply, /ask (SSE), /incidents, /knowledge, /knowledge/browse, /clients, /help-docs
├── generate.js            # Knowledge loading, Anthropic streaming (draft + multi-turn Q&A), incident/knowledge CRUD, browse index, help docs parser
├── system-prompt.md       # Draft reply persona and response guidelines
├── qa-system-prompt.md    # Q&A assistant persona and response guidelines
├── package.json
├── .env
├── public/
│   └── index.html         # Frontend — tabbed UI (Draft Reply | Ask a Question | Log Incident | Knowledge Base | Quick Reference)
├── knowledge/             # Markdown knowledge files (loaded at startup, prompt-cached)
│   ├── admin.md           # Business admin, QuickBooks, insurance, licenses, expenses
│   ├── clients.md         # Client directory (names, websites, types, Joomla versions)
│   ├── common-tasks.md    # Step-by-step common Joomla admin procedures
│   ├── domains.md         # Domain registrars (eNom, Namecheap, GoDaddy), DNS
│   ├── example-replies.md # Real support reply examples (tone/style reference)
│   ├── general-issues.md  # Escalation rules, diagnostics, security incidents, troubleshooting
│   ├── help-docs.md       # Help doc pages + 40+ Scribe guide index with URLs
│   ├── hosting.md         # Hosting providers (CloudAccess, Cloudways, Stablehost, Veerotech, XMission)
│   ├── incidents.md       # Incident log — grows over time via /incidents endpoint
│   ├── joomla-components.md  # All Joomla extensions with detailed docs, Stripe/payment forms
│   ├── tools-accounts.md  # Dashlane, ReCaptcha, SendGrid, Adobe, team tools
│   └── common-issues.json # Pinned how-tos (CRUD via /common-issues — JSON, not loaded into prompt)
└── tests/
    └── server.test.js     # 58 tests — auth, routes, Q&A, incidents, knowledge, browse, format, history, common issues, generate helpers, help docs
```

## Running Locally
```bash
cp .env.example .env     # Then fill in APP_PASSWORD and ANTHROPIC_API_KEY
npm install
npm start                # Runs on port 3000
npm test                 # Run tests
```

## Key Endpoints
- `POST /login` — Password auth, sets HMAC-SHA256 cookie
- `GET /auth-check` — Check authentication status
- `GET /clients` — Client directory (parsed from clients.md)
- `POST /draft-reply` — SSE streaming email draft (requires auth). Body: `{ email, clientName?, siteUrl? }`
- `POST /ask` — SSE streaming Q&A with multi-turn support (requires auth). Body: `{ question, category?, history? }`
- `GET /knowledge/browse` — Browse all knowledge files with sections (requires auth)
- `GET /help-docs` — Help doc pages + Scribe guides as structured JSON (requires auth)
- `GET /incidents` — List all incidents (requires auth)
- `POST /incidents` — Log an incident (requires auth). Body: `{ title, severity?, affected?, description, resolution?, handler? }`
- `GET /common-issues` — List pinned common issues (requires auth)
- `POST /common-issues` — Pin/add a common issue (requires auth). Body: `{ title, answer, question?, source?, addedBy? }` (`source: "qa" | "manual"`)
- `PUT /common-issues/:id` — Update title/answer (requires auth). Body: `{ title?, answer? }`
- `DELETE /common-issues/:id` — Unpin (requires auth)
- `POST /knowledge/format` — AI-format raw content for a knowledge file (requires auth, rate limited). Body: `{ category, content }`
- `POST /knowledge` — Save a formatted knowledge section (requires auth). Body: `{ category, content }`
- `POST /logout` — Clear auth cookie

## Architecture
- All `.md` files in `knowledge/` are concatenated and sent as a cached system prompt block
- Draft Reply uses `system-prompt.md` as its persona; Q&A uses `qa-system-prompt.md`
- Both modes share the same knowledge base (prompt caching saves tokens across requests)
- Q&A supports multi-turn conversations — history sent with each request, knowledge base cached in first message
- `GET /knowledge/browse` returns all knowledge files parsed into sections for browsing/searching
- `GET /incidents` parses incidents.md into structured JSON for viewing
- `incidents.md` is append-only — new incidents are added via the `/incidents` endpoint
- Knowledge files are append-only via `/knowledge` — new sections added to any editable file (9 of 12, excluding clients.md and incidents.md)
- Add Knowledge uses a two-step flow: `/knowledge/format` (Claude AI extracts & formats raw input) → preview → `/knowledge` (save)
- After logging an incident or adding knowledge, the knowledge cache is hot-reloaded
- Triage tags (`[NEEDS TROY]` / `[ROUTINE]`) are buffered during streaming to prevent partial display

## Environment Variables
- `APP_PASSWORD` — Team login password (required)
- `ANTHROPIC_API_KEY` — Claude API key (required)
- `CLAUDE_MODEL` — Model to use (default: `claude-sonnet-4-6`)
- `PORT` — Server port (default: 3000)
- `NODE_ENV` — Set to `production` on Hostinger

## Deployment (Hostinger)
Push to GitHub → Hostinger auto-deploys. Create `.env` manually on server.

## Testing
```bash
npm test          # Run all tests
npm run test:watch # Watch mode
```
Tests use vitest + supertest. Rate limiting is disabled in test mode (`NODE_ENV=test`).

## Conventions
- Same patterns as Brief Generator (auth, streaming, error handling)
- Knowledge files are plain markdown — easy for anyone to edit
- Incident log entries follow a consistent format (date, severity, affected, issue, resolution, handler)
- Frontend uses dark glassmorphism theme with tab-based navigation

## Git

- Remote: github.com/Third-Sun-Pro/support-reply (public — required for scheduled remote agents)
- `.env` is gitignored — never commit (contains `APP_PASSWORD` and `ANTHROPIC_API_KEY`)
- `knowledge/incidents.md` is committed — incident log grows over time via the `/incidents` endpoint and gets pulled in via auto-deploy

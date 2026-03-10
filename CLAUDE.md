# Support Hub — Third Sun Internal Operations Tool

## What This Is
Combined support tool for Third Sun Productions with three modes:
1. **Draft Reply** — AI-powered client support email drafting with auto-detection, client directory lookup, and triage routing
2. **Ask a Question** — Internal Q&A against the knowledge base (hosting, domains, Joomla, troubleshooting, tools, business admin)
3. **Log Incident** — Record security incidents, outages, and issues (appended to knowledge base for future reference)

## Stack
Node.js, Express 5, Anthropic SDK (`claude-sonnet-4-6`), vanilla HTML/CSS/JS frontend. HMAC-SHA256 cookie auth. SSE streaming. Markdown knowledge files with Anthropic prompt caching.

## Project Structure
```
support-reply/
├── server.js              # Express server — auth, /draft-reply, /ask (SSE), /incidents (POST), /clients
├── generate.js            # Knowledge loading, Anthropic streaming (draft + Q&A), incident appending
├── system-prompt.md       # Draft reply persona and response guidelines
├── qa-system-prompt.md    # Q&A assistant persona and response guidelines
├── package.json
├── .env
├── public/
│   └── index.html         # Frontend — tabbed UI (Draft Reply | Ask a Question | Log Incident)
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
│   └── tools-accounts.md  # Dashlane, ReCaptcha, SendGrid, Adobe, team tools
└── tests/
    └── server.test.js     # 22 tests — auth, routes, Q&A, incidents, generate helpers
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
- `POST /ask` — SSE streaming Q&A (requires auth). Body: `{ question, category? }`
- `POST /incidents` — Log an incident (requires auth). Body: `{ title, severity?, affected?, description, resolution?, handler? }`
- `POST /logout` — Clear auth cookie

## Architecture
- All `.md` files in `knowledge/` are concatenated and sent as a cached system prompt block
- Draft Reply uses `system-prompt.md` as its persona; Q&A uses `qa-system-prompt.md`
- Both modes share the same knowledge base (prompt caching saves tokens across requests)
- `incidents.md` is append-only — new incidents are added via the `/incidents` endpoint
- After logging an incident, knowledge is hot-reloaded so the next question includes the new data
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

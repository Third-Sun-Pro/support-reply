# General Troubleshooting

## Escalation Rules
- **Troy handles:** Hosting issues, DNS/domains, SSL certificates, server configuration, email deliverability (server-side), security incidents, database issues, site migrations
- **Team can handle:** Joomla admin tasks, content updates, form configuration, component settings, client training, password resets, cache clearing

## Site Down / Timeout
1. Verify the site is actually down (different browser, different device, downforeveryoneorjustme.com)
2. Identify the hosting provider (check hosting.md or clients.md)
3. Check the hosting provider's status page
4. Try clearing your own browser cache
5. **Escalate to Troy** with: site URL, error message (if any), when it started, hosting provider

## "The Site Looks Weird on My Phone/Browser"
1. Ask the client: which device and browser?
2. Ask them to try clearing their browser cache (see Browser Cache section)
3. Ask for a screenshot
4. Try reproducing on your own device
5. If reproducible: check if it's a responsive design issue or a bug
6. Escalate to Troy if it's server-related or you can't identify the cause

## Browser Cache
Clearing instructions:
- **Chrome:** Settings > Privacy > Clear Browsing Data (or Ctrl+Shift+Delete / Cmd+Shift+Delete)
- **Safari:** History > Clear History, or Develop > Empty Caches
- **Firefox:** Settings > Privacy > Clear Data (or Ctrl+Shift+Delete / Cmd+Shift+Delete)
- **Hard refresh shortcut:** Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
- **Note:** Troy's email signature includes a browser cache reminder link

## Gmail Not Receiving Emails / Going to Spam
1. Check the spam/junk folder
2. If found in spam: mark "Not Spam" and move to inbox
3. Create a Gmail filter: search for the sender > "Create filter" > "Never send to Spam"
4. Add the sender to Google Contacts
5. If emails aren't arriving at all: check with Troy for server-side email configuration

## "I Forgot My Password" (Joomla Admin)
- Third Sun can reset any Joomla admin password — this is routine
- Go to the Joomla admin panel > Users > find the user > reset password
- No need to escalate to Troy

## Email Deliverability (Contact Forms)
Three possible causes:
1. **Server-side email configuration** — needs Troy
2. **SPF/DKIM/DMARC DNS records** — needs Troy
3. **Wrong notification email address** — check the form settings in Convert Forms (team can fix)

Always check #3 first before escalating.

## DNS Propagation
- Changes take 24-48 hours to fully propagate worldwide
- During propagation: some users see old content, others see new. This is normal.
- No way to speed this up — just wait
- Clear your local DNS cache if testing: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

## New Staff / Team Changes at Client Organization
Protocol when a client introduces a new team member:
1. Acknowledge the new person warmly
2. Offer to set up Joomla admin access for them
3. Mention available training resources (help docs, Scribe guides)
4. Offer to schedule a walkthrough if needed

## Content Update Requests
Protocol:
1. Offer the client the option to make the change themselves with a link to the relevant help doc
2. Or confirm Third Sun will handle it
3. **Never provide ETAs** for when changes will be completed

## "Can the Site Do X?" — Feature Discovery Requests
Clients often ask for functionality that **already exists** but they don't know about. Before scoping new work or quoting billable time:

1. **Check if the feature already exists** — log in to their site admin and verify
2. **Check Joomla user account capabilities** — frontend user accounts often have more features than the client realizes (profile editing, membership renewal, directory access, etc.)
3. If it already works: walk the client through it, send a Scribe guide or help doc link
4. If it partially works: identify what's missing vs. what's already there
5. Only quote new development if the feature genuinely doesn't exist

**Real example:** Client asked if members could log in to view membership expiration, edit their info, pay dues, and access a directory. Response after investigation: all of those features were already available through their existing member accounts. No development needed — just a training/walkthrough.

**Key principle:** Always verify existing functionality before assuming new work is needed. This saves billable hours and builds client trust. Many Joomla components (membership directories, event booking, etc.) have robust frontend user features that clients may never have been shown.

## Out-of-Scope Requests — Custom App / Software Development
Clients sometimes request custom applications, native apps, or specialized software that falls outside Third Sun's core competency (Joomla web design and support).

**How to handle:**
1. **Listen and understand the full scope** — ask for details, feature lists, reference apps they've looked at
2. **Recommend purpose-built platforms first** — specialized SaaS tools almost always beat custom builds for cost, maintenance, and features
3. **Be transparent about costs** — if the client pushes for a custom build, explain that Third Sun would need to hire an outside developer, making it significantly more expensive than a subscription platform
4. **Don't burn billable hours on exploration** — be upfront early rather than spending time scoping something you'll ultimately recommend against
5. **Stay helpful** — offer to assist in other ways (connecting to the right platform, helping evaluate options)

**Real example:** Client wanted a custom digital garden tour app with interactive maps, videos, accessibility features, multi-language support, and QR code access. Recommended purpose-built tour platforms (Bloomberg Connects, STQRY, Tourient) instead of custom development. Client pushed for a cost estimate; explained honestly that hiring a developer for a custom build would cost far more than subscription software, and recommended going with the specialized tool.

**Key principle:** Third Sun's strength is Joomla web design and ongoing support. When a request needs a native app, custom software, or specialized platform, recommend the right tool for the job rather than trying to build it in-house. This protects both the client's budget and Third Sun's bandwidth.

**Common out-of-scope requests:**
- Native mobile apps (recommend responsive web or platform like Tourient/STQRY)
- E-commerce beyond simple payment forms (recommend Shopify, WooCommerce)
- Custom CRM or membership platforms (recommend existing SaaS)
- Complex web applications with user accounts, real-time features, etc.

## Security Incidents

### Compromised Extensions
Real example — Astroid Template vulnerability (March 2026):
- **Issue:** Astroid Template for Joomla had a critical vulnerability allowing unauthorized admin access
- **Symptoms:** Suspicious admin users, modified files, potential data exposure
- **Immediate action:** Disable the compromised extension, check for unauthorized admin accounts
- **Workaround used:** Append `?tsadminsite` to admin URL as a temporary access restriction
- **Resolution:** Update to patched version, scan for malware, change all passwords, audit admin users
- **Key lesson:** Extension vulnerabilities can affect many sites simultaneously — check all sites using the affected extension

### SSL Certificate — www vs non-www Mismatch
- **Symptom:** Some users get a security warning, others don't. Site works fine for the team.
- **Cause:** SSL certificate configured for the bare domain (e.g., `example.org`) but NOT for `www.example.org`. Users who type or are redirected to the www version get a certificate error.
- **Diagnosis:** Ask if the affected users went to the www version. Check both versions in a browser.
- **Fix:** Troy reconfigures SSL on the server to cover both www and non-www. **Always escalate to Troy.**
- **Hosting note:** This has happened on XMission-hosted sites specifically.
- **Key question to ask the client:** "Was it more than one person?" — helps determine if it's a server issue vs. a single user's browser/cache problem.

### Bot Payment Form Testing
- Bots sometimes test stolen credit cards on payment forms
- Signs: multiple small transactions from different cards in quick succession
- Fix: Enable CAPTCHA on payment forms, notify client, may need to temporarily disable the form
- Troy handles payment gateway configuration

### Spamhaus / Anti-Spam Blocking
- Server IP can end up on Spamhaus blocklist
- Symptoms: form submissions blocked, emails not sending
- Fix: Troy can check and request delisting, or adjust server configuration
- Can temporarily disable the anti-spam check if urgent (Troy handles this)

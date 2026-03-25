# General Troubleshooting

## Escalation Rules
- **Troy handles:** Hosting, DNS/domains, SSL, server config, email deliverability (server-side), security incidents, database issues, site migrations
- **Team can handle:** Joomla admin tasks, content updates, form config, component settings, client training, password resets, cache clearing

## Site Down / Timeout
1. Verify it's actually down (try a different browser/device)
2. Identify the hosting provider (check hosting.md or clients.md)
3. **Escalate to Troy** with: site URL, error message, when it started, hosting provider

## "The Site Looks Weird on My Phone/Browser"
1. Ask: which device and browser?
2. Ask them to clear their browser cache
3. Ask for a screenshot
4. Escalate to Troy if you can't identify the cause

## Browser Cache
- **Chrome:** Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac) → Clear Browsing Data
- **Safari:** History → Clear History
- **Hard refresh:** Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

## Gmail Not Receiving Emails / Going to Spam
1. Check spam/junk folder — if found, mark "Not Spam"
2. Create a Gmail filter: search for the sender → "Create filter" → "Never send to Spam"
3. Add the sender to Google Contacts
4. If emails aren't arriving at all: escalate to Troy

## "I Forgot My Password" (Joomla Admin)
- Routine — no need to escalate. Go to Users → find the user → reset password.

## Email Deliverability (Contact Forms)
1. **Check the form settings first** — wrong notification email in Convert Forms is the most common cause (team can fix)
2. Server-side email config or SPF/DKIM/DMARC → needs Troy

## New Staff at Client Organization
1. Acknowledge the new person warmly
2. Offer to set up Joomla admin access
3. Share help docs and training resources
4. Offer a walkthrough if needed

## Content Update Requests
- Offer the client the option to make the change themselves (link to help doc)
- Or confirm we'll handle it
- **Never provide ETAs**

## "Can the Site Do X?" — Feature Discovery
Clients often ask for features that **already exist**. Always check their site admin first before scoping new work. Many Joomla components have frontend features clients don't know about.

## Out-of-Scope Requests
Custom apps, native apps, or specialized software beyond Joomla. Recommend purpose-built SaaS platforms. Be transparent that custom development would require outside developers and significantly higher costs.

## SSL Certificate — www vs non-www Mismatch
- **Symptom:** Some users get a security warning, others don't
- **Cause:** SSL only covers one version (www or non-www)
- **Fix:** Escalate to Troy
- **Key question:** "Was it more than one person?" — helps distinguish server issue from browser/cache problem

## Bot Payment Form Testing
- Signs: multiple small transactions from different cards in quick succession
- Fix: Enable CAPTCHA, notify client, may need to temporarily disable the form → Troy handles

## Spamhaus / Anti-Spam Blocking
- Symptoms: form submissions blocked, emails not sending
- Fix: Troy checks and requests delisting

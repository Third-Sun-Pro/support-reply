# General Issues (Non-Joomla)

Common client issues that aren't specific to Joomla but come up regularly in support.

## Gmail Not Receiving Emails / Going to Spam

If a client says they're not receiving form submissions or notifications:
1. First ask: "Did you check your spam/junk folders?"
2. If found in spam: Have them click "Not Spam" on the emails so Gmail learns
3. For persistent issues: Create a filter in Gmail Settings > Filters and Blocked Addresses > "Never send to Spam" for the sender address
4. Adding the sender to Google Contacts also helps

## Browser Cache

Clients often don't see recent changes on their site. The fix is clearing their browser cache.
- Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- Safari: Develop > Empty Caches
- Firefox: Ctrl+Shift+Delete
- Quick fix: Ctrl+Shift+R (hard refresh) on the specific page
- Troy's email signature includes "Remember to clear your browser cache to see changes!" for this reason

## "I Forgot My Password" (Joomla Admin)

Third Sun can reset their Joomla admin password. This is a routine task — no need to escalate to Troy unless there's a deeper access issue.

## DNS Propagation

When DNS changes are made (domain transfers, nameserver updates, new SSL certs), changes can take 24-48 hours to fully propagate. If a client reports their site looks different or isn't loading after a DNS change, this is likely the cause.

## Email Deliverability (Contact Forms)

If a client's contact form submissions aren't arriving at all (not even in spam):
- Could be a server-side email config issue (needs Troy)
- Could be SPF/DKIM/DMARC records missing (needs Troy)
- Could be the form notification email address is wrong (check Convert Forms settings)

## "The Site Looks Weird on My Phone/Browser"

- First ask what device and browser they're using
- Ask them to try clearing cache and hard refreshing
- If it persists, ask for a screenshot
- Could be a browser-specific CSS issue (needs Troy if cache clear doesn't fix it)

## SSL Certificate Issues

If a client sees "Not Secure" warnings or certificate errors:
- This is a hosting/server issue — always route to Troy
- Usually means the SSL cert expired or needs renewal
- Can also happen during domain/hosting migrations

## Domain and Hosting Questions

Any questions about domain registration, renewals, hosting plans, server migrations, or DNS settings should always be routed to Troy.

## New Staff / Team Changes

When a client introduces a new team member:
- Acknowledge the new person warmly
- Offer to set them up with admin access if needed
- Mention training resources (monthly Joomla sessions, help docs)
- Update any relevant contact info on the website if requested

## Content Update Requests

When a client asks Third Sun to update content (hours, staff, text, photos):
- If it's simple and they could do it themselves, offer the option: "We can take care of that, or if you'd like to do it yourself, here's how: [link]"
- If they just want it done, confirm and let them know it'll be taken care of
- Don't provide ETAs

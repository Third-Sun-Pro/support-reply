# Joomla Component Reference

All Third Sun client sites run on Joomla CMS. Below are the components commonly used across client sites.

## Event Booking (com_eventbooking)
- **What it does:** Event registration and calendar management. Handles individual and group registrations, payments, waiting lists, reminders, and registrant check-in.
- **Where to find it:** Admin → Components → Events Booking (also called "Event Booking" or "Events Booking" — same component)

### Creating & Editing Events
- Admin → Components → Events Booking → Events → Add New Event
- Fill in: title, dates, location, description, capacity, pricing
- Set registration options (individual registration, group registration, or both)
- Events can be organized into categories and subcategories
- Recurring events are supported for repeating activities
- Events can have multiple ticket types (via Ticket Types plugin)

### Registration Forms & Custom Fields
This is the most common client question area.

- **Core fields** come built-in: First Name, Last Name, Email, Phone, Address
- **Custom fields** can be added for any extra info: Admin → Components → Events Booking → Custom Fields
- **9 field types available:** Textbox, Textarea, Dropdown, Multi-Select, Checkbox List, Radio List, Datetime, Heading, Message
- To show/hide a field: publish or unpublish it in Custom Fields
- To make a field required: toggle the "Required" setting on that field
- To rename a field label: click the field in Custom Fields and edit the title (e.g., rename "Organization" to "Company")
- To reorder fields: drag and drop in the Custom Fields list
- **Fee fields:** Custom fields can affect pricing — the registration cost adjusts based on what the user selects (e.g., "T-shirt size" with different prices)

#### IMPORTANT: Global vs. Event-Level Field Settings
- **Global settings** (in Events Booking → Configuration → Billing Fields / Group Member Fields) only affect **newly created events**
- **Existing events are NOT affected** by global configuration changes
- To change fields on an **existing event**: edit the event itself → look for "Billing Fields Setting" and "Group Member Fields" tabs
- This is the #1 source of confusion — clients change global settings and wonder why their existing events didn't update

### Registration Types
- **Individual registration:** One person registers at a time
- **Group registration:** Register multiple people in one transaction (3-step process: enter number of members → fill in each member's details → billing & payment)
- Both types can be enabled/disabled per event
- Note: Enabling shopping cart mode disables group registration

### Email Notifications
- Admin → Components → Events Booking → Emails & Messages
- **Emails that get sent automatically:**
  - Confirmation to registrant after signup
  - Admin notification when someone registers
  - Separate message for offline (check/invoice) payments
  - Reminder emails before the event
  - Cancellation notifications
  - Waiting list notifications when spots open up
  - Registration approval confirmations
- **Email priority order:** Event-specific messages override category messages, which override global messages
- **Notification recipients:** Set admin notification email addresses in Configuration (comma-separated for multiple recipients)

### Managing Registrants
- Admin → Components → Events Booking → Registrants
- View all registrations, filter by event or status
- Export registrant data (PDF, CSV)
- Check-in/check-out tracking for day-of management
- Process refunds, send bulk emails
- Custom fields can be shown on the registrants list by enabling "Show On Registrants Management" on the field

### Common Client Questions
- "How do I add/remove fields on the registration form?" → Custom Fields section (see above)
- "I changed the settings but my existing event didn't update" → Global settings only affect new events; edit the event directly
- "How do I see who registered?" → Components → Events Booking → Registrants
- "How do I change the registration confirmation email?" → Components → Events Booking → Emails & Messages
- "Can I set a registration deadline?" → Yes, in the event settings
- "Can I add a waiting list?" → Yes, enable in event settings — registrants auto-notified when spots open

### Troubleshooting
- **Registration form missing fields:** Check Custom Fields — fields may be unpublished or not assigned to that event
- **Changed settings but nothing happened:** Global config only affects NEW events — edit the existing event directly
- **Empty event list:** Events may be unpublished or dates may have passed
- **No confirmation emails:** Check Emails & Messages settings and verify notification email addresses in Configuration
- **Registration button not showing:** Event may be full, past registration deadline, or registration is disabled in event settings

### Documentation Reference
- Official docs: https://docs.joomdonation.com/eventsbooking/

---

## DP Calendar (com_dpcalendar)
- **What it does:** Calendar display with FullCalendar.js — shows events in month/week/day views
- **Common client questions:** Adding events, changing calendar views, syncing with Google Calendar
- **Key settings:** Calendar views, event colors, timezone settings
- **Troubleshooting:**
  - Empty calendar: Add events in DP Calendar admin or check date ranges
  - Calendar not rendering: JavaScript may not be loading — check template overrides and plugin settings

## Forms by Tassos / Convert Forms (com_convertforms)
- **What it does:** Contact forms, intake forms, newsletter signups, payment forms, quiz forms. Full drag-and-drop form builder.
- **Where to find it:** Admin → Components → Convert Forms

### Creating & Editing Forms
- Admin → Components → Convert Forms → click a form to edit, or "New" to create
- Drag-and-drop form builder — add, remove, reorder fields visually
- Forms can be placed on pages via: article shortcode, module, or menu item
- Multiple forms can exist on the same page

### Field Types Available
- **Text fields:** Text, Textarea, Password, Phone Number
- **Choice fields:** Dropdown, Radio Buttons, Checkboxes (can use images for radio/checkbox)
- **Special fields:** Date & Time, File Upload, Signature, Confirmation
- **Layout:** Heading, Paragraph, Hidden Field, HTML
- Fields can be set as required or optional
- Placeholder text can be added to guide users
- Multi-column layouts supported for side-by-side fields
- Conditional fields: show/hide fields based on what the user selects in other fields

### Email Notifications
- Edit a form → Tasks tab → Email Notifications
- Turn on "Send email notifications when users submit a form"
- **Recipients:** Set in the "Send To Email Address" field — comma-separated for multiple addresses. Defaults to the site admin email.
- **Email content:** Uses Smart Tags like `{all_fields}` to include form data. Can customize to show only specific fields.
- **Multiple notifications:** Click "Add Email Notification" to add more (e.g., one to admin, one auto-responder to the submitter)
- **Conditional emails:** Can send different email content based on form responses
- **Resending:** Emails can be resent from the submissions view
- **Troubleshooting delivery:** Check Joomla mail settings, spam folders, and server mail configuration

### Viewing Submissions
- Admin → Components → Convert Forms → Submissions (or click the form → Submissions tab)
- View all form entries with timestamps
- Export submissions to CSV
- Can display submissions on the frontend via a menu item (Menu Manager → New → Convert Forms → Submissions)
- Submissions can be auto-deleted after a set period
- Each submission gets a unique ID

### Advanced Features
- **Conditional logic:** Show/hide fields based on other field values
- **Calculations:** Perform math on field values (useful for order forms, quotes)
- **Smart Tags:** Dynamic content — insert user data, site info, or field values into emails and messages
- **Payment forms:** Accept payments via Stripe or PayPal
- **File uploads:** Accept file attachments through forms
- **Redirect after submit:** Send users to a thank-you page or any URL
- **Confirmation popup:** Show a success message after submission
- **PDF generation:** Convert submissions to PDF
- **Webhooks:** Send form data to external APIs

### Spam Protection
- Google reCAPTCHA, hCaptcha, Cloudflare Turnstile, or Math CAPTCHA
- Honeypot (invisible anti-bot field)
- Minimum time to submit (prevents instant bot submissions)
- IP restrictions, email domain blocking, profanity filter

### Common Client Questions
- "How do I add a new field to my form?" → Edit the form in Convert Forms, drag a new field into the form builder
- "How do I change who gets the notification emails?" → Edit form → Tasks → Email Notifications → change the "Send To" address
- "Where do I see form submissions?" → Components → Convert Forms → Submissions
- "Can I add a file upload?" → Yes, add a File Upload field in the form builder
- "The form isn't showing on the page" → Check that the Convert Forms system plugin is enabled, and the form shortcode or module is correctly placed

### Troubleshooting
- **Form not displaying:** Check that Convert Forms system plugin is enabled in Extensions → Plugins
- **Not receiving notification emails:** Check Email Notifications are turned on in the form's Tasks tab, verify recipient address, check spam folders
- **Form fields not saving:** Verify the form exists and is published in Convert Forms admin
- **CAPTCHA issues:** Check CAPTCHA plugin settings and API keys

### Documentation Reference
- Official docs: https://www.tassos.gr/docs/convert-forms

## RSSEO! (com_rsseo)
- **What it does:** SEO management — meta tags, redirects, sitemap
- **Common client questions:** Setting up URL redirects (301), editing page meta descriptions, fixing broken links
- **Key settings:** Meta description, page title, URL redirects, sitemap generation
- **Troubleshooting:**
  - Missing meta description or title: Configure in RSSEO! or in the article's SEO settings
  - Redirect not working: Check redirect rules in RSSEO! admin panel

## EngageBox (Pop-ups)
- **What it does:** Popup/modal overlays — newsletter signups, announcements, cookie consent, promotional banners, age verification, yes/no confirmations, and more.
- **Where to find it:** Admin → Components → EngageBox (also called "Engage Box" — same component)

### Creating & Editing Popups
- Admin → Components → EngageBox → click a popup to edit, or "New" to create
- Set the popup content (text, images, forms, HTML, or embed an iframe)
- Choose the popup type, trigger, and display conditions
- Publish the popup to make it live

### Popup Types
- **Standard popup/modal** — centered overlay with backdrop
- **Page Slide (Welcome Mat)** — slides in from the edge of the page
- **Smart Sticky Bar** — fixed bar at the top or bottom of the page (stays visible while scrolling)
- **Fullscreen Message** — takes over the entire screen
- **Image Box** — image-based popup for visual messaging
- **Yes/No Box** — binary choice popup (e.g., "Are you over 21?")
- **IFrame Box** — embed external content inside a popup
- **Scroll-Triggered Box** — activates when visitor scrolls to a specific point

### Trigger Types (When the Popup Appears)
- **Page Load** — shows when the page loads (with optional delay)
- **Click** — shows when user clicks a specific element (button, link, image)
- **Hover** — shows when user hovers over an element
- **Scroll Depth** — shows after scrolling a certain percentage down the page
- **Exit Intent** — detects when user is about to leave the page (moves mouse toward browser close/back)
- **Element Visibility** — shows when a specific page element scrolls into view
- **Floating Button** — persistent button on the page that opens the popup when clicked
- **Idle** — shows after user has been inactive for a set time
- **AdBlock Detect** — shows specifically to visitors using ad blockers
- **External Link Click** — shows when user clicks a link to an external site

### Display Conditions (Who Sees It)
40+ targeting conditions available:
- **URL-based:** Specific pages, homepage only, referrer URL
- **Device:** Desktop, mobile, tablet, specific browsers or OS
- **Geolocation:** Country, city, region, continent, IP address
- **User:** New vs. returning visitors, logged-in users, user groups
- **Time:** Date range, day of week, month, time of day
- **Behavior:** Time on site, number of pageviews, viewed another popup
- **Content:** Specific articles, categories, menu items, component views
- **Other:** Cookie values, language, PHP conditions

### Cookie Settings — CRITICAL
- **This is the most important setting** — controls how often returning visitors see the popup
- **Limit impressions per unique visitor** — set how many times total a visitor sees the popup
- **Cookie duration** — how long before the popup shows again (e.g., session, 1 day, 7 days, 30 days, forever)
- **Auto-close after time** — popup can close itself after a set number of seconds
- **Show floating button after close** — display a small button so users can reopen the popup if needed
- To test: clear browser cookies or use incognito/private browsing mode

### Additional Features
- Countdown timers inside popups
- Sound effects on popup display
- Popup rotation (randomly show different popups)
- Multilingual popup support
- Responsive design (test across devices)
- Accessibility features for screen readers
- Open popup from a menu item click

### Common Client Questions
- "How do I edit the popup content?" → Components → EngageBox → click the popup to edit
- "The popup keeps showing every time I visit" → Adjust the cookie/impression settings in the popup's configuration
- "How do I make the popup show on only one page?" → Set Display Conditions → URL or Menu Item
- "How do I stop the popup from showing?" → Unpublish it in EngageBox (click the green checkmark)
- "Can I make it show only to new visitors?" → Yes, add a Display Condition for "New/Returning Visitor"
- "How do I trigger a popup from a button click?" → Set the trigger to "Click" and specify the button's CSS class or ID

### Troubleshooting
- **Popup not showing:** Check that EngageBox system plugin is enabled (Extensions → Plugins), verify the popup is published, and check display conditions aren't too restrictive
- **Popup showing too often:** Adjust cookie duration and impression limits in the popup settings
- **Popup shows on wrong pages:** Review Display Conditions — make sure URL or menu item targeting is correct
- **Third-party content not working inside popup:** Some extensions may conflict — check EngageBox troubleshooting docs
- **Popup looks wrong on mobile:** Check responsive preview and adjust styling or use device-specific display conditions

### Documentation Reference
- Official docs: https://www.tassos.gr/docs/engagebox

## Droppics (com_droppics)
- **What it does:** Image gallery management with drag-and-drop
- **Common client questions:** Adding images to galleries, reordering images, creating new galleries
- **Key settings:** Gallery layout (grid, masonry, slider), image sizing, lightbox settings
- **Troubleshooting:**
  - Empty gallery: Add images in Droppics admin or check that gallery is published
  - Gallery not displaying: Ensure CSS/JS assets are loading properly

## SP Page Builder
- **What it does:** Visual page builder with drag-and-drop sections and addons
- **Common client questions:** Editing page sections, adding new content blocks, changing layouts
- **Key settings:** Section layouts, addon configurations, responsive settings
- **Troubleshooting:**
  - Broken layout: CSS/JS assets may not be loading — check component and plugin are enabled
  - Empty sections: Add content addons or remove empty sections in SP Page Builder editor

## JCE Editor
- **What it does:** Rich text editor for article content (replaces default Joomla editor)
- **Common client questions:** Formatting text, inserting images, creating links, pasting from Word
- **Key settings:** Editor profiles, allowed HTML tags, image upload settings
- **Note:** Internal editor links should never appear on the public site — if they do, there's a configuration issue

### Key Editor Tools
- **Bold, Italic, Underline:** Standard formatting — but advise clients not to overuse
- **Heading dropdown:** Select text → choose heading level (H2-H6). H1 is the article title, don't use elsewhere
- **Link button:** Select text → click link icon → paste URL. External links must include full `https://`
- **Image button:** Insert/edit images → browse server to upload or select existing
- **Source Code view:** Toggle to see/edit raw HTML — useful for precise layout control
- **Paste as Plain Text:** Strips formatting when pasting from Word/Google Docs — prevents broken layouts
- **Read More button:** Inserts a break that controls what shows on category/blog listing pages
- **Media embed:** Paste YouTube/Vimeo URLs to embed videos

---

## Payment Forms & Stripe Integration
- **Stripe** is the primary payment processor for client sites with donation/payment forms
- Two approaches for payment forms:

### Embedded Credit Card Form (current default on most sites)
- Credit card fields appear directly on the page
- Lower friction — user stays on the site
- Does NOT support Apple Pay or Google Pay
- Configured through the Joomla form/payment extension

### Stripe Hosted Checkout (redirect)
- User clicks a button and is taken to a Stripe-hosted payment page
- **Supports Apple Pay, Google Pay**, and other payment methods
- Works better on mobile
- Adds a redirect step (some friction)
- People are used to secondary payment steps — generally recommended for mobile-heavy audiences

### Can You Have Both?
- Technically yes — you can offer both embedded and Stripe redirect
- But the user has to choose between them, which isn't ideal UX
- **Recommendation:** Go with Stripe hosted checkout. Better mobile experience, more payment options, and users are accustomed to the redirect pattern.

### Apple Pay Specifics
- Only works on mobile (Safari on iOS)
- Requires Stripe hosted checkout — cannot be embedded
- Troy handles the Stripe configuration

---

## Occasionally Used Extensions

### Regular Labs
- Various Joomla utilities and extensions
- Advanced module/plugin management tools

### Joomla51
- Template framework and templates
- Responsive design components

### Joomlatools
- Content management extensions
- File management tools

### Techjoomla
- Specialized Joomla extensions
- Social/community features

### JoomDonate
- Donation management for nonprofits
- Payment processing integration
- Used on several nonprofit client sites

---

## Akeeba Backup
- **What it does:** Full-site backup and restoration — creates a single archive containing all files and database. Used for disaster recovery, server migrations, and staging copies
- **Where to find it:** Admin → Components → Akeeba Backup
- **Editions:** Core (free, manual backups, local storage only) and Professional (paid, adds cloud uploads, automated scheduling, integrated restoration, Site Transfer Wizard)

### Creating a Backup
- First time: run **Components → Akeeba Backup → Configuration Wizard** to auto-optimize settings for the server
- **Backup Now:** Components → Akeeba Backup → Backup Now → add a description → click Backup Now
- **Critical:** Do not navigate away, close the tab, or switch tabs during backup — browsers suspend background tabs which kills the backup process
- Default storage location: `administrator/components/com_akeeba/backup`

### Restoring a Backup
- **Integrated Restoration (Pro):** Manage Backups → select backup → Restore → choose extraction method → follow ANGIE wizard
- **Kickstart (Core & Pro):** Upload `kickstart.php` + backup archive to server root via FTP → access `yoursite.com/kickstart.php` → extract → follow ANGIE wizard
- **ANGIE** is the restoration script embedded in every backup — it walks through database setup, site URL, and admin credentials
- **Always click Clean Up/Finalize** after restoration to remove the installation directory and temp files

### Post-Restoration Troubleshooting
- **Can't log into admin:** Edit `configuration.php` → set `$cookie_domain = ''` and `$cookie_path = ''` → clear browser cookies → rename `.htaccess` temporarily
- **Blank page / Error 500:** In `configuration.php` set `$cache_handler = 'file'`, `$caching = '0'`, `$session_handler = 'database'` → check PHP memory limit (128MB minimum)
- **CSS/images broken:** Set `$live_site` in `configuration.php` to the correct URL
- **.htaccess problems:** Remove `AddHandler` directives, `php_value`/`php_flag` statements, fix `RewriteBase` paths

### Common Client/Team Questions
- "Where are my backups?" → `administrator/components/com_akeeba/backup` on the server, or cloud storage if configured (Pro)
- "How often should I back up?" → Before any major update. Weekly automated for active sites, monthly for rarely-updated sites
- "My backup keeps failing" → Make sure the browser tab stays active. Run Configuration Wizard to re-optimize. Check View Log for specific errors
- "Can I restore to a different server?" → Yes — download archive, upload to new server with Kickstart, run ANGIE, update database/URL details

### Archive Formats
- **JPA:** Akeeba's native format — use for standard backups
- **JPS:** Encrypted (AES-256) — use when storing in cloud or shared storage. Password is case-sensitive and irrecoverable
- **ZIP:** Universal format but less reliable for very large sites

---

## Admin Tools
- **What it does:** Security hardening, Web Application Firewall (WAF), and server configuration management. Most widely-used Joomla security extension
- **Where to find it:** Admin → Components → Admin Tools
- **Editions:** Core (free, limited features) and Professional (paid, full WAF + .htaccess Maker)

### Web Application Firewall (WAF)
- Runs as a system plugin — intercepts every request before Joomla processes it
- Blocks: SQL injection, brute-force logins, bad bots, suspicious query strings, known malicious IPs
- **Security Exceptions Log:** Components → Admin Tools → WAF → Security Exceptions Log — shows exactly what was blocked and why
- **Auto IP Blocking:** Bans IPs after a threshold of security violations
- **Safe IP List:** "Never block these IPs" — add your office IP here

### Common Issues Admin Tools Causes

#### Locked Out of Admin (Most Common)
- **Symptoms:** 403 Forbidden at `/administrator`
- **Causes:** IP changed (mobile/VPN), auto IP blocking triggered, .htaccess rules incompatible with server

**Recovery methods (in order):**
1. **Rescue Mode:** Visit `yoursite.com/administrator/index.php?admintools_rescue=your@email.com` — token emailed, valid 15 minutes
2. **FTP disable WAF:** Rename `plugins/system/admintools/services/provider.php` to `provider-disable.php` → fix settings → rename back
3. **FTP remove .htaccess:** Delete or rename root `.htaccess`, replace with default from `htaccess.txt`

#### Legitimate Users Getting Blocked
- Check **Security Exceptions Log** for the user's IP to see which rule triggered
- Delete their IP from **Auto IP Blocking Administration**
- Add their IP to **Safe IP List** if they have a static IP

#### .htaccess Breaks the Site
- **Symptoms:** 500 error or blank page after saving .htaccess settings
- **Fix:** Via FTP, delete `.htaccess` → rename `.htaccess.admintools` back to `.htaccess`
- **Prevention:** Enable .htaccess options one at a time and test after each change

#### Super User Creation Blocked
- "Super User Account Monitoring" or "Disable User Property Editing" may block new admin accounts
- **Fix:** Temporarily disable these in WAF Configuration → Joomla Hardening before creating/modifying admin accounts

### Best Practices
- **Avoid the Administrator Secret URL parameter** — causes frequent lockouts. Use MFA instead
- **Know the FTP recovery process** — renaming `provider.php` is your escape hatch
- **Check Security Exceptions Log** before assuming a problem is unrelated to Admin Tools
- **After Joomla updates:** Expect alerts from Critical Files Monitoring — these are normal
- **When troubleshooting:** Temporarily disable Admin Tools via FTP method to rule it out

---

## Astroid Framework
- **What it does:** Template framework built on Bootstrap 5 — provides visual drag-and-drop interface for template layouts, headers, mega menus, typography, and colors. Not a page builder — controls the template layer (header, footer, layout grid, module positions)
- **Where to find it:** System → Site Templates → Styles → [Your Template Style]
- **Compatibility:** Joomla 4.x, 5.x, 6.x. Requires PHP 8.2+
- **Maintained by:** Templaza (previously JoomDev)

### Key Settings Sections
- **Header:** 10 header modes (horizontal, stacked, sidebar, etc.), sticky header, off-canvas menu, logo
- **Layout:** Drag-and-drop layout builder (sections → rows → columns → module positions/widgets)
- **Colors:** Light mode and dark mode color schemes
- **Typography:** Google Fonts, local fonts, system fonts with per-element control
- **Custom Code:** Custom CSS/JS injection without editing core files
- **Preset Profiles:** Save/load/export full configuration as JSON — **always export before updates**

### Mega Menu
- Per menu item: Menus → [Your Menu] → [Menu Item] → Astroid Options tab
- Enable mega menu, then use drag-and-drop builder for multi-column layouts
- Can drop Joomla modules directly into mega menu columns
- Supports icons and badges on menu items
- **Known limitation:** Mega menus do not work in Sidebar Menu Mode

### CRITICAL: Security Vulnerability (CVE-2026-21628)
- **Disclosed March 4, 2026** — authentication bypass (CVSS 10.0) affecting all versions before 3.3.11
- Attackers can upload files and install malicious plugins without admin credentials
- **Update to 3.3.12 or later** (3.3.11 had regressions)
- **Check for backdoors:** Look for plugins named "System - BLPayload" in Plugin Manager, and files matching `plg_jcp_*.html` in `/administrator/cache/`
- Updating alone does NOT remove existing backdoors — full security audit needed if previously vulnerable

### Troubleshooting
- **Site down after Astroid update (500 error):** Via FTP, rename `/libraries/astroid` to `/libraries/astroid_old` and `/plugins/system/astroid` to `/plugins/system/astroid_old` → access admin → reinstall Astroid from [astroidframe.work/download](https://astroidframe.work/download) → delete `_old` folders
- **"Class not found" errors:** Ensure "Behaviour - Backward Compatibility" plugin is enabled → reinstall Astroid
- **Cache clearing hangs:** Clear cache via FTP (delete contents of `/administrator/cache/` and `/cache/`) instead of through admin

### Best Practices
- **Always back up before updating Astroid** — updates have a history of breaking sites
- **Export Preset Profile (JSON)** before any update to preserve all template settings
- **Export Layout configurations** as JSON backups before updates
- **Know the FTP recovery process** — renaming the astroid folders is your escape hatch

---

## Google Structured Data (by Tassos.gr)
- **What it does:** Adds schema markup (JSON-LD) to site pages without writing code. Helps search engines understand content, which can trigger rich results (star ratings, FAQ dropdowns, event details, business info cards) in Google
- **Where to find it:** Admin → Components → Google Structured Data
- **Documentation:** https://www.tassos.gr/docs/google-structured-data
- **Editions:** Free (limited schema types) and Pro (89 EUR/year, all 21 schema types + component integrations)

### Supported Schema Types (21)
Article, Book, Breadcrumbs, Course, Event, Fact Check, FAQ, HowTo, Job Posting, Local Business, Movie, Organization, Person, Product, Recipe, Review, Service, Site Logo, Site Name, Social Profiles, Video. Use **Custom Code** type for anything not in this list.

### Setting Up Structured Data
1. Components → Google Structured Data → Items → New
2. Set **Content Type** (e.g., Local Business, FAQ, Article)
3. Set **Integration** (Joomla Articles, Event Booking, DPCalendar, Menu Manager)
4. Map properties to data sources (article fields, custom fields, page info, or hardcoded values)
5. Set **Publishing Rules** — target specific pages or categories (category rules auto-apply to new content)
6. Test with Google's Rich Results Test: https://search.google.com/test/rich-results

### Common Use Cases for Client Sites
- **Local Business** on homepage — name, address, phone, hours, map coordinates (most impactful for local businesses)
- **FAQ schema** on service pages — creates expandable Q&A in search results, increasing SERP visibility
- **Article schema** on blog posts — use category-based rules to auto-apply to all blog articles
- **Event schema** — integrates directly with Event Booking and DPCalendar
- **Organization + Site Name + Site Logo + Social Profiles** — set up once in Site Representation for Knowledge Graph

### Integrations Relevant to Third Sun
- **Joomla Articles** — native content (most common)
- **Event Booking** — event schema for event pages. Enable via Configuration → Integrations. Has "Remove Microdata" option to strip Event Booking's own incomplete microdata
- **DPCalendar** — event schema for calendar pages (Pro required)
- **Menu Manager** — universal fallback for any page not covered by other integrations

### Important Limitations
- **Only single/detail views supported** — category pages, blog layouts, and list views do NOT get structured data
- Rich results are never guaranteed — Google decides whether to show them
- If using sh404SEF, disable its own structured data option to avoid conflicts

### Troubleshooting
- **Schema not appearing:** Check system plugin is enabled (Extensions → Plugins → "System - Google Structured Data"), item is published, publishing rules target the right pages, clear cache
- **Rich Results Test doesn't detect schema:** May be a schema type Google's tool doesn't support (use Schema.org Validator instead), or required properties may be missing
- **Validated but not showing in Google:** Google may not have crawled yet (4-12 weeks), request re-indexing via Search Console. Images must be 160x90 to 1920x1080, .jpg/.png/.gif format
- **Schema Cleaner:** Enable in Configuration → Advanced to remove Joomla's default incomplete microdata that causes validation errors

---

## Extension Management Best Practices
1. Always back up before updating extensions
2. Check compatibility with current Joomla version before updating
3. If an extension breaks after update: restore from backup, report to vendor
4. Monitor security advisories for installed extensions (Joomla Vulnerable Extensions List)
5. Disable (don't delete) unused extensions until confirmed safe to remove
6. Troy handles complex extension issues and server-side configuration


## TreeUtah – Private Events for Waiver Collection
**Client:** TreeUtah (Katerina Mihailidis, Community Outreach Coordinator)
**Contact:** Katerina@TreeUtah.org
**Use Case:** Collecting waivers from private groups (e.g., tree planting partners) without publishing a public event

### Solution: Use a Hidden or Password-Protected Event

Event Booking supports private events — no need for Google Forms.

- **Hidden event:** Set the event to "Hidden" so it won't appear on the public events list. Share the direct registration link manually. (Tip: temporarily unhide the event to grab the link, then hide it again.)
- **Password-protected event:** Set a password on the event — registrants must know the password to access the registration form.
- Registrations/submissions are stored in the admin area as normal

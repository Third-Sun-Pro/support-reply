# Joomla Component Reference

All Third Sun client sites run on Joomla CMS. Below are the components commonly used across client sites.

## Event Booking (com_eventbooking)
- **What it does:** Event registration and calendar management
- **Where to find it:** Admin → Components → Events Booking

### Key Gotcha
Global settings (Configuration → Billing Fields) only affect **newly created events**. To change fields on an existing event, edit the event directly → "Billing Fields Setting" tab. This is the #1 source of client confusion.

### Common Client Questions
- "How do I add/remove fields?" → Components → Events Booking → Custom Fields. Publish/unpublish to show/hide.
- "I changed settings but nothing updated" → Global settings only affect new events. Edit the existing event directly.
- "How do I see who registered?" → Components → Events Booking → Registrants
- "How do I change the confirmation email?" → Components → Events Booking → Emails & Messages
- "Can I set a registration deadline?" → Yes, in the event settings
- "Can I add a waiting list?" → Yes, enable in event settings

### Troubleshooting
- **Missing fields on form:** Fields may be unpublished or not assigned to that event
- **No confirmation emails:** Check Emails & Messages settings and notification email addresses in Configuration
- **Registration button not showing:** Event may be full, past deadline, or registration disabled

### Docs: https://docs.joomdonation.com/eventsbooking/

---

## DP Calendar (com_dpcalendar)
- **What it does:** Calendar display with month/week/day/list views, recurring events, optional booking
- **Where to find it:** Admin → Components → DPCalendar

### Common Client Questions
- "How do I add an event?" → Click on a day in the calendar, or Admin → Components → DPCalendar → Events → New
- "Can I sync with Google Calendar?" → Yes (paid version). Requires Google API credentials. Set up via DPCalendar → Calendars → External Calendar
- "How do recurring events work?" → Create event → Recurring section → choose pattern (daily/weekly/monthly) → set interval and end date
- "Events aren't showing" → Check: event is published, assigned to correct calendar, calendar is published, menu item points to right calendar(s)
- "How do I change the calendar view?" → Menu item settings control which view displays

### Troubleshooting
- **Events not displaying:** Check that the event and calendar are both published. If still not showing, email us and we'll take a look.
- **Google Calendar not syncing:** This needs Troy — email us and we'll sort it out.
- **Booking not working:** Email us and we'll check the configuration.

### Docs: https://joomla.digital-peak.com/documentation/dpcalendar

## Forms by Tassos / Convert Forms (com_convertforms)
- **What it does:** Contact forms, intake forms, newsletter signups, payment forms. Drag-and-drop builder.
- **Where to find it:** Admin → Components → Convert Forms

### Common Client Questions
- "How do I add a new field?" → Edit the form in Convert Forms, drag a new field into the builder
- "How do I change who gets notification emails?" → Edit form → Tasks tab → Email Notifications → change "Send To" address (comma-separated for multiple)
- "Where do I see form submissions?" → Components → Convert Forms → Submissions
- "Can I add a file upload?" → Yes, add a File Upload field in the builder
- "The form isn't showing on the page" → Check that the Convert Forms system plugin is enabled (Extensions → Plugins)

### Troubleshooting
- **Not receiving emails:** Check Email Notifications are turned on in form's Tasks tab, verify recipient address, check spam folders
- **Form not displaying:** Check system plugin is enabled in Extensions → Plugins
- **CAPTCHA issues:** Check CAPTCHA plugin settings and API keys

### Docs: https://www.tassos.gr/docs/convert-forms

## RSSEO! (com_rsseo)
- **What it does:** SEO management — meta tags, redirects, sitemap
- **Common client questions:** Setting up URL redirects (301), editing page meta descriptions, fixing broken links
- **Key settings:** Meta description, page title, URL redirects, sitemap generation
- **Troubleshooting:**
  - Missing meta description or title: Configure in RSSEO! or in the article's SEO settings
  - Redirect not working: Check redirect rules in RSSEO! admin panel

## EngageBox (Pop-ups)
- **What it does:** Popup/modal overlays — announcements, newsletter signups, cookie consent, promotions
- **Where to find it:** Admin → Components → EngageBox

### Key Gotcha — Cookie Settings
This is the most important setting. Controls how often returning visitors see the popup. Set "Limit impressions per unique visitor" and cookie duration carefully. To test: use incognito/private browsing.

### Common Client Questions
- "How do I edit the popup?" → Components → EngageBox → click the popup to edit
- "It keeps showing every time I visit" → Adjust cookie/impression settings in the popup's configuration
- "How do I show it on only one page?" → Set Display Conditions → URL or Menu Item
- "How do I stop it from showing?" → Unpublish it in EngageBox (click the green checkmark)
- "How do I trigger it from a button?" → Set the trigger to "Click" and specify the button's CSS class or ID

### Troubleshooting
- **Not showing:** Check EngageBox system plugin is enabled (Extensions → Plugins), popup is published, display conditions aren't too restrictive
- **Showing too often:** Adjust cookie duration and impression limits
- **Wrong pages:** Review Display Conditions targeting

### Docs: https://www.tassos.gr/docs/engagebox

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
- **Key tip:** Always use "Paste as Plain Text" when pasting from Word/Google Docs — prevents broken layouts
- **Common issues:** External links must include full `https://`. H1 is the article title — don't use H1 elsewhere in content.

---

## Payment Forms & Stripe
- **Stripe** is the primary payment processor for client sites
- **Troy handles** all Stripe setup and configuration
- If a client asks about payment forms, offer to set it up for them or loop Troy in

---

## Google Structured Data (by Tassos.gr)
- **What it does:** Adds schema markup to pages for Google rich results (FAQ dropdowns, business info cards, event details)
- **Where to find it:** Admin → Components → Google Structured Data
- **Troy/Sabriel handle** setup — clients don't typically configure this themselves

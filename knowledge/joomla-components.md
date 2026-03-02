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
- Edit a form → Behavior tab → Email Notifications
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
- "How do I change who gets the notification emails?" → Edit form → Behavior → Email Notifications → change the "Send To" address
- "Where do I see form submissions?" → Components → Convert Forms → Submissions
- "Can I add a file upload?" → Yes, add a File Upload field in the form builder
- "The form isn't showing on the page" → Check that the Convert Forms system plugin is enabled, and the form shortcode or module is correctly placed

### Troubleshooting
- **Form not displaying:** Check that Convert Forms system plugin is enabled in Extensions → Plugins
- **Not receiving notification emails:** Check Email Notifications are turned on in the form's Behavior tab, verify recipient address, check spam folders
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

# Common Client Tasks

These are the most frequent support requests from clients. All clients use Joomla CMS.

## Joomla Admin Dashboard Overview
- **Left sidebar:** Quick access to Content, Menus, Components, Extensions, System
- **Control Panel:** Shows site stats, quick links, and recent activity
- **Joomla symbol (top left):** Click to toggle the admin sidebar
- **Getting to the front end:** Click the site name in the top-left corner of the admin panel, or use the "Preview" link — opens the public site in a new tab
- **Getting to the front end from an article:** While editing an article, the "Preview" button in the toolbar opens that specific article on the frontend

## Editing Article Content
- Log into Joomla admin → Content → Articles
- Find the article (use search or filters)
- Click the article title to open the editor
- Make changes in the JCE editor
- Click "Save" or "Save & Close"
- **Tip:** Use headings (Heading 2, Heading 3) for structure, not just bold text
- **Warning:** Don't paste directly from Word — use "Paste as Plain Text" or paste into a plain text editor first, then copy into Joomla

## Understanding Articles & Categories
- Joomla organizes content into **categories** (buckets) and **articles** (items inside those buckets)
- Example: "Staff" is a category, and each staff member is an article inside it
- Creating a new article: Content → Articles → New → fill in title, content, assign to a category
- **Unpublishing:** Toggle the green checkmark to unpublish — the article stays in the system but doesn't show on the public site
- **Publishing tab & Metadata:** Set publish dates, meta description, and SEO settings in the article's Publishing tab
- **Getting to the front end from an article:** Use the "Preview" button in the article editor toolbar to see the page live

## Adding/Editing Menu Items
- **Joomla is mainly menu-based** — for content to show up on the site, it usually needs to be connected to a menu item somehow
- Log into admin → Menus → select the menu (usually "Main Menu")
- To add: click "New", choose menu item type (usually "Single Article" or "Category Blog")
- To edit: find the item and click its title
- **Proceed with caution:** Changing a menu item's alias will change the page URL — this can break existing links
- **Hidden menus:** Some sites use hidden/unpublished menus to create URL routes for pages that don't appear in navigation
- To unpublish a page from the menu: unpublish the menu item (not the article)
- To rename a page in the menu: edit the menu item title in Menu Manager
- **Warning:** If unsure about menu changes, email support@thirdsun.com — menu structure can get complicated and breaking links is hard to undo

## Uploading and Resizing Photos
- Recommended: resize images BEFORE uploading
- In JCE editor: click the image icon → browse server → upload
- Always add alt text for accessibility
- Supported formats: JPG (photos), PNG (graphics/logos), WebP (modern format)
- **Warning:** Very large images slow down the site — always optimize first

### Image Specifications
- **Staff photos:** Usually square aspect ratio. Use Heading 4 for staff member name/title
- **Blog post photos:** Add both inside the article content AND in the article's "Images" tab (used for blog listing thumbnails)
- **Header images:** Each site is structured differently for headers — if a client has questions about header images, email support@thirdsun.com
- **Minimum width:** 1600px (monitors are large now). Height varies by use case
- **Resolution:** 72 DPI (screen resolution, not print)
- **File size:** 200-300 KB is ideal. Anything under 1 MB is acceptable
- **Reference:** https://thirdsun.com/help-docs/photos-and-images/size

## Managing Event Calendars
- **Event Booking:** Admin → Components → Events Booking → Events
- **DP Calendar:** Admin → Components → DP Calendar → Events
- Fill in event title, dates, location, description
- Set registration options if applicable
- Publish the event

## Editing Event Booking Registration Forms
- Admin → Components → Events Booking → Custom Fields
- This controls what fields appear on the registration form for events
- To add a field: click "New", choose field type, give it a title, set required/optional
- To hide a field: unpublish it (click the green checkmark to toggle it off)
- To rename a field: click the field title, edit it, save
- To reorder fields: drag and drop in the list
- **Important:** If you're editing fields for a specific existing event, you need to edit the event itself (Events → click the event → look for "Billing Fields Setting" tab). Global Custom Fields settings only apply to newly created events.

## Viewing Event Registrations
- Admin → Components → Events Booking → Registrants
- Filter by event name to see registrations for a specific event
- Click a registrant to see their full details
- Export registrant lists using the Export button
- Use check-in feature for day-of event management

## Changing Event Booking Email Notifications
- Admin → Components → Events Booking → Emails & Messages
- Search for the email you want to edit (e.g., "registration confirmation")
- Edit the message content — you can use template tags for dynamic info
- To change who receives admin notifications: go to Configuration and update notification email addresses

## Updating Forms (Convert Forms)
- Admin → Components → Convert Forms
- Find and click the form to edit
- Use the drag-and-drop builder to add, remove, or reorder fields
- To make a field required: click the field → toggle "Required" on
- To add conditional logic (show/hide fields based on other answers): click a field → set "Show When" conditions
- **Note:** Form submissions are stored in the admin panel — Components → Convert Forms → Submissions

## Changing Form Notification Emails
- Edit the form → Tasks tab → Email Notifications
- Make sure "Send email notifications" is turned on
- Change recipients in the "Send To Email Address" field (comma-separated for multiple)
- To add a second notification (e.g., auto-responder to the submitter): click "Add Email Notification"
- Email content uses Smart Tags like `{all_fields}` — can be customized to show specific fields only

## Viewing Form Submissions
- Admin → Components → Convert Forms → Submissions
- Filter by form name to see entries for a specific form
- Click a submission to see full details
- Export submissions to CSV using the Export button
- Submissions can also be displayed on the frontend via a menu item

## Configuring Popups (EngageBox)
- Admin → Components → EngageBox
- Edit existing popup or create new
- Set the trigger (when it shows): page load, click, scroll, exit intent, idle, etc.
- Set display conditions (who sees it): specific pages, devices, new vs. returning visitors, etc.
- **Critical:** Set cookie/impression settings carefully — controls how often returning visitors see the popup
- To limit how often it shows: set "Limit impressions per unique visitor" and cookie duration
- To test: clear browser cookies or use incognito/private browsing mode
- To disable a popup: unpublish it (don't delete it — you may want it back later)

## Managing Image Galleries (Droppics)
- Admin → Components → Droppics
- Select or create a gallery
- Drag and drop images to upload
- Reorder by dragging within the gallery
- Gallery appears on the page via a Joomla article or module

## Setting Up URL Redirects (RSSEO!)
- Admin → Components → RSSEO! → Redirects
- Click "New" to create a redirect
- Enter the old URL and the new destination URL
- Set as 301 (permanent) redirect
- Use this when pages are moved or renamed to avoid broken links

## Managing Users
- Admin → Users → Manage
- Edit existing users or create new ones
- **Setting up a new user:** Click "New" → fill in name, username, email, password → assign to a user group
- **Resetting a password:** Find the user → click their name → enter a new password → Save
- **User levels:** "Administrator" gives full backend access. "Registered" is for frontend-only users. "Super User" has unrestricted access (reserved for Third Sun)
- Set user group carefully — controls what the user can see and do

## Adding Buttons / Links Above or Below Content
Common client request: "Can you add a button that links to [page]?" or "Can we move this link/button to a different spot?"

**Approach — Custom HTML in the article:**
1. Edit the article in JCE
2. Switch to Source Code view if needed (for precise HTML control)
3. Add a styled link/button using HTML, e.g.: `<a href="/target-page" class="btn">Button Text</a>`
4. Position it above or below the main content as requested
5. Save and preview on frontend

**Approach — Using modules:**
1. If the button/link needs to appear on multiple pages or in a specific template position, create a Custom HTML module
2. Extensions > Modules > New > Custom HTML
3. Add the button HTML
4. Assign it to the correct menu item(s) and position
5. This is better for reusable elements that appear across pages

**Approach — Featured Articles on homepage:**
- To surface a specific article on the homepage, set it as "Featured" (toggle in the article list or in the article editor)
- The homepage layout determines how featured articles display

**Key principle:** Content placement requests are almost always solvable through article editing, custom modules, or menu item configuration. No server-level work needed.

## Understanding the Homepage
- The homepage is made up of **modules** — it doesn't "live" as a single article
- Modules are assigned to template positions and displayed on the homepage menu item
- To edit homepage content: find the relevant module in Extensions → Modules, or edit the featured articles
- Example: https://cdcutah.org/ — homepage is assembled from multiple modules
- Blog/news sections on the homepage (like Bears Ears) typically pull from a category using a module or menu item setting
- Success stories / testimonials (like Project Read) can be shown in various module layouts

## Duplicating an Article ("Save as Copy")
1. Open the article you want to duplicate
2. Click "Save as Copy" (in the toolbar, next to Save)
3. The copy opens in the editor with "(2)" appended to the title
4. Edit the title and content as needed
5. Save

## Content Formatting Best Practices
To keep a site looking clean and consistent, follow these rules:

### General Rules
- **Use consistent formatting** across all articles — having many different fonts, colors, and sizes ages a site quickly
- **When in doubt, copy the formatting from another item** on the same site
- **Left-align text** for best usability (avoid centered body text)
- **Don't over-format** — avoid bolding, underlining, or italicizing everything
- **Your site is not a flier** — images with text baked in (infographics, flier-style graphics) are virtually illegible on mobile and bad for accessibility and SEO
- **Check images** — make sure they're not pixelated, stretched, or poor quality

### Heading Hierarchy
- **Heading 1** is the article title — don't use it elsewhere in the content
- Work through headings sequentially: H2, then H3, then H4
- **Heading 4** for staff member names/titles
- **Accessibility requirement:** Headings must fall in sequential order — this helps screen readers interpret the relative importance of content on the page
- Never skip heading levels (e.g., don't go from H2 to H4)

### Line Breaks & Spacing
- **Shift+Enter** = line break (stays in the same paragraph block, less space)
- **Enter** = paragraph break (starts a new paragraph block, more space)
- Use line breaks for things like addresses or tightly grouped lines; paragraph breaks for distinct paragraphs

### Common JCE Editor Features
- **Read More:** Insert a "Read More" break to control what shows on blog/category listing pages vs. the full article
- **Sliders/Tabs:** Some sites use content sliders or tab layouts — these are created via shortcodes or specific editor buttons
- **Columns:** Split content into side-by-side columns using the editor's column tools
- **Vimeo/YouTube:** Paste the video URL and the editor embeds it, or use the media embed button
- **PDF Link:** Upload a PDF via the file manager, then link to it (opens in browser or downloads)
- **Hyperlinks:** Select text → click the link button → paste the URL
  - **Outside links:** Must include the full URL with `https://` — copy and paste from the browser to ensure it's correct
  - **Internal links:** Can use relative paths (e.g., `/about-us`)
- **Button links:** Some templates have button styles — apply a CSS class to a link to make it look like a button

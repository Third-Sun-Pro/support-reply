# Common Client Tasks

These are the most frequent support requests from clients. All clients use Joomla CMS.

## Editing Article Content
- Log into Joomla admin → Content → Articles
- Find the article (use search or filters)
- Click the article title to open the editor
- Make changes in the JCE editor
- Click "Save" or "Save & Close"
- **Tip:** Use headings (Heading 2, Heading 3) for structure, not just bold text
- **Warning:** Don't paste directly from Word — use "Paste as Plain Text" or paste into a plain text editor first, then copy into Joomla

## Adding/Editing Menu Items
- Joomla is menu-driven — every page needs a menu item to be accessible
- Log into admin → Menus → select the menu (usually "Main Menu")
- To add: click "New", choose menu item type (usually "Single Article" or "Category Blog")
- To edit: find the item and click its title
- **Warning:** Changing a menu item's alias will change the page URL — this can break existing links
- If you need to unpublish a page, unpublish the menu item (not the article)

## Uploading and Resizing Photos
- Recommended: resize images BEFORE uploading (max 2000px wide, under 500KB)
- In JCE editor: click the image icon → browse server → upload
- Always add alt text for accessibility
- Supported formats: JPG (photos), PNG (graphics/logos), WebP (modern format)
- **Warning:** Very large images slow down the site — always optimize first

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
- Edit the form → Behavior tab → Email Notifications
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
- Set user group (controls permissions)
- Reset passwords if a client is locked out

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

## Duplicating an Article ("Save as Copy")
1. Open the article you want to duplicate
2. Click "Save as Copy" (in the toolbar, next to Save)
3. The copy opens in the editor with "(2)" appended to the title
4. Edit the title and content as needed
5. Save

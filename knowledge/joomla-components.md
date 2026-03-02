# Joomla Component Reference

All Third Sun client sites run on Joomla CMS. Below are the components commonly used across client sites.

## Event Booking (com_eventbooking)
- **What it does:** Event registration and calendar management
- **Common client questions:** How to add/edit events, event registration settings, displaying events on pages
- **Key settings:** Registration form layout, event capacity, notification emails
- **Troubleshooting:**
  - Empty event list: Events may need to be published or dates may have passed
  - Broken registration form: Check Event Booking configuration and registration form layout in admin
  - Missing assets: Ensure Event Booking CSS/JS assets are loading properly

## DP Calendar (com_dpcalendar)
- **What it does:** Calendar display with FullCalendar.js — shows events in month/week/day views
- **Common client questions:** Adding events, changing calendar views, syncing with Google Calendar
- **Key settings:** Calendar views, event colors, timezone settings
- **Troubleshooting:**
  - Empty calendar: Add events in DP Calendar admin or check date ranges
  - Calendar not rendering: JavaScript may not be loading — check template overrides and plugin settings

## Forms by Tassos / Convert Forms (com_convertforms)
- **What it does:** Contact forms, intake forms, newsletter signups
- **Common client questions:** Editing form fields, adding admin notification emails, changing form layout, viewing submissions
- **Key settings:** Notification emails, submission storage, CAPTCHA, redirect after submit
- **Troubleshooting:**
  - Form not displaying: Check that Convert Forms system plugin is enabled
  - Form fields not rendering: Verify the form exists in Convert Forms admin
  - Missing CSS/JS: Ensure system plugin is enabled

## RSSEO! (com_rsseo)
- **What it does:** SEO management — meta tags, redirects, sitemap
- **Common client questions:** Setting up URL redirects (301), editing page meta descriptions, fixing broken links
- **Key settings:** Meta description, page title, URL redirects, sitemap generation
- **Troubleshooting:**
  - Missing meta description or title: Configure in RSSEO! or in the article's SEO settings
  - Redirect not working: Check redirect rules in RSSEO! admin panel

## Engage Box (Pop-ups)
- **What it does:** Popup/modal overlays — newsletter signups, announcements, cookie consent
- **Common client questions:** Editing popup content, changing when popups appear, disabling popups
- **Key settings:**
  - **Cookie settings are critical** — controls how often popup shows to returning visitors
  - Trigger type (on page load, on exit intent, on scroll, on click)
  - Display frequency (once per session, once per day, once ever)
- **Troubleshooting:**
  - Popup not showing: Check that Engage Box system plugin is enabled and JavaScript is loading
  - Popup showing too often: Adjust cookie duration in Engage Box settings

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

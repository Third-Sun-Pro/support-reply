# Incident Log

This file grows over time as the team logs incidents. Each entry captures what happened, how it was resolved, and lessons learned.

---

## 2026-03-06 — Astroid Template Vulnerability
- **Severity:** Critical
- **Affected:** All Joomla sites using the Astroid Framework template
- **Issue:** Critical vulnerability in Astroid Template allowing unauthorized admin access
- **Discovery:** Security advisory email from Joomla community
- **Symptoms:** Potential unauthorized admin users, modified files, data exposure
- **Immediate Response:**
  1. Append `?tsadminsite` to admin URL as temporary access restriction
  2. Check all sites using Astroid for unauthorized admin accounts
  3. Disable the Astroid extension on affected sites
- **Resolution:**
  1. Updated Astroid to patched version on all affected sites
  2. Scanned for malware and unauthorized changes
  3. Changed admin passwords on affected sites
  4. Audited admin user accounts
- **Lesson:** Extension vulnerabilities can affect many sites at once. When a critical advisory comes in, check ALL sites using that extension immediately. Maintain a list of which extensions are installed on which sites.
- **Handled by:** Troy

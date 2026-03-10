# Hosting Infrastructure

## Overview
Third Sun manages client websites across five hosting providers. Troy is the primary contact for all hosting-related issues.

## CloudAccess.net
- **Type:** Managed Joomla hosting (cloud-based)
- **Sites:** ~100 (largest provider)
- **Includes:** thirdsun.com, development/demo sites
- **Dashboard:** CloudAccess control panel
- **Features:** One-click Joomla installs, automated backups, staging environments
- **Notes:** Preferred for new Joomla sites. Easy management.

## Cloudways
- **Type:** Managed cloud hosting (multi-server)
- **Infrastructure:** Multiple servers across DigitalOcean, Linode, Vultr
- **Client-specific servers:**
  - **Borchard** — own Cloudways server
  - **UP Colorado** — own Cloudways server
  - **Wasatch Camera Club** — own Cloudways server
- **Dashboard:** Cloudways control panel
- **Features:** Server scaling, automated backups, SSL management, staging
- **Notes:** Used for clients needing more server control or dedicated resources

## Stablehost
- **Type:** cPanel VPS hosting
- **Servers:** 2 VPS instances
  - **rpcluster04** at reliabledns.org
  - **rpcluster05** at reliabledns.org
- **Sites:** ~50
- **Access:** cPanel / WHM
- **Notes:** Reliable shared hosting for medium-traffic sites

## Veerotech
- **Type:** cPanel hosting
- **Server:** host2.thirdsun.com
- **Sites:** ~30 (older sites)
- **History:** Migrated from HostGator
- **Notes:** Legacy hosting. Sites here are older and may eventually be migrated.

## XMission
- **Type:** Shared hosting
- **Server:** hosting.xmission.com
- **Sites:** Most local nonprofits
- **Notes:** Utah-based ISP. Good for local nonprofit clients.

## Troubleshooting — Site Down / Timeout
1. Check if the site is actually down (try different browser/device, check downforeveryoneorjustme.com)
2. Check the hosting provider's status page
3. If on CloudAccess: check CloudAccess dashboard for server status
4. If on Cloudways: check server resource usage in Cloudways dashboard
5. If on Stablehost/Veerotech: check cPanel for resource limits
6. **Always escalate to Troy** for hosting-level issues — he has all the credentials

## Backups
- **CloudAccess:** Automated daily backups via dashboard. Can restore with one click.
- **Cloudways:** Automated backups configurable in dashboard. Manual backups also available.
- **Stablehost/Veerotech:** cPanel backups (JetBackup or manual). Troy manages backup schedules.
- **XMission:** Varies. Check with Troy.
- **General rule:** Always take a backup before making significant changes. If unsure how, ask Troy.

## Security — Hacked Sites
1. **Immediately notify Troy** — he handles all security incidents
2. Common signs: defaced pages, spam redirects, suspicious admin users, modified files
3. Troy's typical process: restore from backup, scan for malware, update all extensions, change all passwords
4. **MySites by Joomla** — security scanner tool Troy uses to monitor sites
5. Prevention: keep Joomla and extensions updated, strong passwords, limit admin access

## SSL Certificates
- **Always route to Troy** for SSL issues
- Symptoms: browser security warnings, "Not Secure" in address bar, mixed content errors
- Usually caused by: expired certificate, migration-related issues, misconfigured redirects
- CloudAccess and Cloudways handle SSL automatically (Let's Encrypt)
- Stablehost/Veerotech: Troy manages certificate installation via cPanel

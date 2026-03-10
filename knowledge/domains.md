# Domain Registrars & DNS

## Overview
Third Sun manages domains across three registrars. Troy handles all domain and DNS changes.

## Registrars

### eNom
- **Status:** Legacy registrar
- **Usage:** Older domains still registered here
- **Notes:** Not used for new registrations. Domains may be migrated to Namecheap over time.

### Namecheap
- **Status:** Current preferred registrar
- **Usage:** All recent domain registrations
- **Features:** Clean interface, good pricing, easy DNS management
- **Notes:** First choice for new domain purchases and transfers

### GoDaddy
- **Status:** Client delegation
- **Account:** Delegated to troy@thirdsun.com
- **Usage:** Some client domains registered here (client-owned, delegated to Third Sun for management)
- **Notes:** Clients sometimes purchase domains on GoDaddy themselves before engaging Third Sun

## DNS Management
- DNS changes should **always go through Troy**
- Common DNS records managed: A records, CNAME, MX (email), TXT (SPF/DKIM/DMARC)
- **DNS propagation takes 24-48 hours** — changes are not instant
- During propagation: some users may see the old site, others the new one. This is normal.
- If a client reports their site looks different after a DNS change, first check if propagation is still in progress

## Common DNS Tasks (Troy handles)
- Pointing a domain to a new hosting provider
- Setting up email DNS records (MX, SPF, DKIM, DMARC)
- Creating subdomains
- Setting up domain redirects
- Transferring domains between registrars

## Email Deliverability & DNS
- Contact form emails not arriving? Could be DNS-related:
  - **SPF records** — authorize which servers can send email for the domain
  - **DKIM records** — cryptographic email signing
  - **DMARC records** — policy for handling failed SPF/DKIM checks
- All email DNS configuration goes through Troy

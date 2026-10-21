# Deployment

## Requirements

- Node.js 20.9 or later (built and tested on Node 24.22)
- About 40 MB of static media in `public/media/`

## Option A: Node server (VPS, or any host with a persistent disk)

Recommended if you want local RFQ storage as one of the channels.

```bash
npm ci
cp .env.example .env.local   # fill in values
npm run build
npm run start                # or: pm2 start "npm run start" --name miit
```

- Put it behind Nginx or Caddy for TLS. Make sure the proxy **overwrites** `X-Forwarded-For` with the client IP, because the rate limiter keys on its first value.
- Set `RFQ_STORAGE_DIR` to a directory outside the web root. Back it up and restrict access, since it holds customer documents.
- Define a retention rule, for example deleting submissions older than 24 months (a cron job over `.data/rfq/*`).

## Option B: Vercel or another serverless platform

- Set `RFQ_STORAGE=off`, because the serverless file system isn't durable. **Configure email and/or Odoo**, or every submission will fail with a 503. That is deliberate: requests are never silently dropped.
- The in-memory rate limiter is per instance. For strict limits, swap `src/lib/rfq/rate-limit.ts` for a shared store such as Upstash Redis.
- Request bodies: uploads can total 25 MB. Check your plan's request size limit; on Vercel the function payload limit is lower, so lower `LIMITS` in `src/lib/rfq/schema.ts` or upload files directly to object storage.

## Domain and DNS

1. Point `www.miitcorporation.com` (and the apex) at the new host.
2. Set `NEXT_PUBLIC_SITE_URL=https://www.miitcorporation.com`.
3. If the Odoo website stays live at `miitcorporation.odoo.com`, unpublish it or add redirects to avoid duplicate content. The old site's paths map like this:
   - `/our-services` → `/products`
   - `/about-us` → `/about`
   - `/contactus` → `/contact`
   - `/blog/3` → `/case-studies`
4. Email sending: verify the sending domain in Resend (SPF and DKIM records) before setting `NOTIFY_EMAIL_FROM`.

## Caching

- Pages are prerendered at build time (Next.js Cache Components).
- `/media/*` is served with `max-age=604800, stale-while-revalidate=2592000`. Purge the CDN after re-rendering media.
- Content changes in `src/content/*` need a rebuild and redeploy.

## Launch verification

Run these after every deployment:

1. `npm run test` (unit) and `npm run test:e2e` (against a production build) pass.
2. Submit a real RFQ with an attachment. Confirm it arrives in every configured channel, then delete it.
3. Submit the contact form. Confirm it arrives.
4. `/sitemap.xml` and `/robots.txt` resolve with the production domain.
5. Submit the sitemap in Google Search Console.
6. Check the homepage film on a real iPhone (Safari) and Android (Chrome).
7. If GTM is enabled: accept consent and confirm events arrive. Decline, and confirm none do.

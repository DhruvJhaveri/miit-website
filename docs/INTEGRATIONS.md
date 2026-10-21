# Integrations and data ownership

## Submission flow

```
Browser form ──► POST /api/rfq (multipart) ──► validate (zod, file signatures, honeypot,
                                               min fill time, optional Turnstile, rate limit)
                                         ──► idempotency check (duplicate → same reference)
                                         ──► fan-out to every configured channel:
                                               • storage  (.data/rfq/<ref>/submission.json + files)
                                               • email    (Resend, with attachments)
                                               • odoo     (crm.lead + ir.attachment)
                                               • webhook  (JSON, no file contents, HMAC-signed)
                                         ──► recorded = at least one channel succeeded
                                               yes → 200 { ref }   → /request-quote/received?ref=…
                                               no  → 503 error     → visitor keeps their entries
                                                                    and gets an email/phone fallback
```

A request is never confirmed unless it was actually recorded. Logs contain only the reference number and each channel's status, never names, emails or specifications.

## Status of each channel

| Channel | Code | Status |
| --- | --- | --- |
| Local storage | `src/lib/rfq/store.ts` | **Working and tested** end-to-end (Playwright writes to `.data-e2e/`) |
| Email (Resend) | `src/lib/integrations/email.ts` | **Implemented, not tested**: needs `RESEND_API_KEY`, a verified sender domain and `NOTIFY_EMAIL_TO` |
| Odoo CRM | `src/lib/integrations/odoo.ts` | **Implemented, not verified**: needs credentials. Run `npm run odoo:check` first |
| Webhook | `src/lib/integrations/webhook.ts` | **Implemented, not tested**: needs `SUBMISSION_WEBHOOK_URL` |
| Turnstile | `src/lib/integrations/turnstile.ts` | **Implemented, not tested**: needs site and secret keys |
| Analytics (GTM) | `src/lib/analytics.ts`, `ConsentBanner.tsx` | **Implemented, consent-gated**: inactive until `NEXT_PUBLIC_GTM_ID` is set |

## Odoo

MIIT's current website runs on Odoo Online. This build **replaces the website front end** and leaves any Odoo ERP, CRM or quotation workflows untouched. To connect them:

1. Make sure the **CRM** app is installed.
2. Check that MIIT's Odoo plan allows **external API** access. On Odoo Online this depends on the subscription, so confirm with Odoo.
3. Create a dedicated integration user with rights to create leads and attachments. Generate an **API key** under Preferences → Account Security.
4. Set `ODOO_URL` (e.g. `https://miitcorporation.odoo.com`), `ODOO_DB`, `ODOO_USERNAME` and `ODOO_API_KEY`, then run `npm run odoo:check`.
5. Submit a test RFQ and confirm the lead and its attachments appear in CRM.

The adapter uses Odoo's documented JSON-RPC external API (`/jsonrpc`, services `common` and `object`). If the plan doesn't allow API access, use the webhook channel with an automation tool, or email-to-lead (an Odoo CRM mail alias) via the email channel.

## Analytics events

All events are consent-gated and carry no personal or specification data.

| Event | Props |
| --- | --- |
| `cta_click` | `location`, `target` |
| `category_view`, `product_view`, `industry_view`, `case_study_view` | slugs only |
| `product_search` | query length only |
| `rfq_start`, `rfq_step`, `rfq_validation_error`, `rfq_file_added`, `rfq_submit_success`, `rfq_submit_error` | `source`, step number, counts, HTTP status |
| `contact_click` | `method`, `location` |
| `contact_submit_success` | — |
| `calculator_complete` | `band` |

## Data ownership

| Data | Owner (source of truth) | Notes |
| --- | --- | --- |
| Products, categories, families | `src/content/categories.ts` | Typed and structured; ready to move to a headless CMS or Odoo `product.template` later |
| Industries, articles, FAQs, brands, case studies | `src/content/*.ts` | Same |
| Company facts and contact | `src/content/company.ts` | Email and WhatsApp can be overridden via env |
| RFQs and messages | Odoo CRM or email inbox, once configured. Local `.data/` until then | Treat `.data/` as confidential; back it up and restrict access |
| Analytics | GTM / GA property | No PII |

**CMS.** None is needed for launch. Every content type is a typed array with slugs, so moving to a headless CMS (Sanity, Payload, Strapi) or to Odoo product data means swapping the import in each page for a fetch. The components don't change.

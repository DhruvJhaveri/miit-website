# Launch checklist: items needed from MIIT CORPORATION

The site is built and tested, but these items need the company's input or credentials before launch. Each one notes where it plugs in.

## Facts to confirm

- [ ] **Official founding year.** The site says "early 1970s". Set `foundingYear` in `src/content/company.ts`.
- [ ] **Contact details.** Confirm both phone numbers, the email address and the street address. Then set `contactVerified: true` in `company.ts`.
- [ ] **WhatsApp number.** Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to enable the prefilled WhatsApp CTAs.
- [ ] **Metrics wording.** Approve the labels in `company.ts` (`metrics`), or edit them, then set `NEXT_PUBLIC_SHOW_METRICS=true`.
- [ ] **Industries.** Confirm that Infrastructure, and Automobile & Engineering, should be listed (`src/content/industries.ts`).
- [ ] **Supply modes.** Confirm, per category, which items may be available from stock, which are sourced, and which are project-supplied (`supplyModes` in `src/content/categories.ts`).
- [ ] **Brands.** Confirm the brand list and each brand's product area (`src/content/brands.ts`), and whether brand logos may be shown.
- [ ] **Case study.** Approve the published wording. Optionally approve more case studies.
- [ ] **Privacy and terms.** Legal review of `/privacy` and `/terms`, which are marked as drafts. Set a data-retention period.

## Assets

- [ ] **Vector logo** (SVG, AI or EPS), to replace the text wordmark in the header (`src/components/layout/Wordmark.tsx`).
- [ ] **Product photography** and **datasheets**, where available. Add them through the `image` and `documents` fields on each product family.
- [ ] **Company profile PDF**, if a verified one exists, for a download on `/about`.
- [ ] **Verified technical data** per product family: grades, standards, sizes and part numbers. The fields exist but are intentionally empty.
- [ ] Optional: HD licences for the film's source clips (see `docs/ASSETS.md`).

## Credentials

- [ ] Email: a Resend API key, a verified sending domain, and the notification inbox(es).
- [ ] Odoo (optional): URL, database, integration user and API key. Confirm the plan includes API access, then run `npm run odoo:check`.
- [ ] Turnstile site and secret keys (optional; recommended once the site is live).
- [ ] GTM container ID (optional) and your analytics/consent policy.

## Already removed or avoided

- Placeholder `mailto:info@yourcompany.example.com` (now the real email)
- Empty testimonial block, unverified client logo wall, and unsubstantiated "best/number one" claims
- Prices, stock levels, certifications and delivery guarantees (none are stated anywhere)

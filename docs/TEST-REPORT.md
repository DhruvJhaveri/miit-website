# Test report

Run on 21 October 2026, Windows 11, Node 24.22, Next.js 16.4.2, against a local production build (`next build && next start`) in Chromium (Playwright).

## Automated results

| Suite | Command | Result |
| --- | --- | --- |
| Lint | `npx eslint src tests scripts` | ✅ 0 problems |
| Typecheck | `npx tsc --noEmit` | ✅ 0 errors |
| Unit tests | `npm run test` | ✅ 30 / 30 |
| End-to-end | `npm run test:e2e` | ✅ 20 / 20 (19 desktop, 1 mobile Pixel 7) |
| Production build | `npm run build` | ✅ 106 pages generated, no warnings |

**Unit tests cover:**
- Complexity scoring: bands, caps, mix rules, no monetary output, bad input.
- RFQ and contact schemas: coercion, field paths, honeypot, consent, 300-line cap.
- Upload validation: magic bytes, renamed executable, size and count limits, file-name sanitising, binary posing as CSV.
- Spreadsheet paste parsing: TSV, quoted CSV, units, header skipping.
- Site search; content cross-reference integrity; frame load order and nearest-frame fallback; the rate limiter.

**End-to-end tests cover:**
- **All routes.** Every sitemap URL (80+) returns 200 with a unique `<title>`, an `<h1>` and zero console or page errors.
- **Links and 404.** No broken internal links or images across key pages. Unknown slugs return a real **404**.
- **SEO.** Product pages have the right title, description, canonical, and BreadcrumbList and Organization JSON-LD.
- **RFQ API:**
  - a valid request is persisted to disk
  - **duplicate prevention**: the same idempotency key returns the same reference
  - 422 with field errors; honeypot and too-fast rejection
  - a file whose contents don't match its extension is rejected
  - attachments are stored outside `/public` and are not web-reachable
  - **429 rate limiting**
- **RFQ form, the full journey:**
  - URL prefill
  - validation messages
  - add, remove and paste line items
  - delivery fields
  - a bad file rejected client-side, a CSV accepted
  - review table
  - consent enforcement
  - a **double-click submits once**
  - the confirmation page shows a reference
- **RFQ server failure.** A 503 shows a recoverable error, entries are kept, and a mailto fallback is prefilled with the items.
- **Other interactions:**
  - catalogue search, filters, URL sync and the empty state with suggestions
  - explorer tabs with keyboard arrows
  - FAQ accordion and filters
  - requirement planner
  - mega menu open and Escape
  - contact form submit and confirmation
- **Mobile (Pixel 7).** Menu accordion, no horizontal overflow on five key pages, and the floating quote bar.
- **Reduced motion.** The film becomes a static hero, all narrative beats are visible as text, and the canvas is hidden.

## Cinematic QA (`scripts/qa/film-check.mjs` plus screenshot review)

| Check | Result |
| --- | --- |
| Initial hero load | Poster and headline visible in ≈ 0.3–0.9 s locally. Text and CTAs are interactive immediately |
| Scroll-scrubbed progression | Screenshots at 11 scroll positions on desktop: beats, product labels and footage stay in sync |
| Reverse and rapid scrolling | Jumped 0.8 → 0.1 → 0.65 → 0.05 → 0.45; the scene settles to the correct frame and beat |
| Stopping mid-scene | Coherent frame and text at every sampled position |
| Section transition | The next section slides over the film's final frames (layered transition) |
| Mobile (390 × 844) | 9:16 frame set (160 frames), progress rail under the nav, finale wraps correctly |
| Failed media (frames and posters blocked) | Ink background and full text. Circuit breaker stops after 12 requests (was 223 before the fix) |
| Reduced motion | Static poster plus the full narrative list; no pinning |
| Console errors | None (desktop, mobile, reduced motion) |

**Defects found and fixed during QA:**
1. Narrative text was hard to read over bright pipework: the scrim was strengthened.
2. The mobile progress rail collided with the quote bar: moved under the nav.
3. "CORPORATION" overflowed at 390 px: it now stacks on mobile.
4. The static fallback list was covered by the overlapping panel: the overlap now applies only in film mode.
5. The frame loader kept requesting failed frames: circuit breaker added.
6. **Mobile horizontal overflow.** Scrolling chip rails inside CSS grid items widened the layout to 654 px. Fixed globally with `:where(.grid) > * { min-width: 0 }`.
7. Unknown slugs returned 200, a soft 404. Fixed with `ensureStatic = "navigation"`.
8. `Date.now()` was read during prerender in the line-item keys and the footer year.
9. React `set-state-in-effect` violations: URL and localStorage state moved to `useSyncExternalStore`.
10. Encoding damage from a PowerShell edit (footer arrow, copyright symbol): corrected.

## Lab performance (local production server, desktop, `scripts/qa/perf.mjs`)

| Page | Network | FCP | LCP | CLS | JS transferred |
| --- | --- | --- | --- | --- | --- |
| Home | unthrottled | 412 ms | 412 ms | 0 | 294 KB |
| Home | ~Fast 4G (9 Mbps, 60 ms) | 628 ms | 844 ms | 0.017 | 294 KB |
| Product page | ~Fast 4G | 496 ms | 528 ms | 0 | 251 KB |

On the homepage, film frames load progressively after first paint (35 frames in the first 3 s on Fast 4G). These are local lab numbers only. Measure field data (Search Console Core Web Vitals) after launch. No Lighthouse score is claimed.

## Not tested, and why

- **Email, Odoo, webhook and Turnstile delivery.** No credentials exist yet; adapters are implemented but unverified. See INTEGRATIONS.md.
- **Real iOS Safari and Android devices.** Only Chromium emulation was used. Test the film on physical devices before launch.
- **Firefox and WebKit engines.** Not run. Install them with `npx playwright install firefox webkit` and add projects to `playwright.config.ts`.
- **Screen-reader testing.** Semantics were checked in code and with Playwright role queries, but not with NVDA or VoiceOver.

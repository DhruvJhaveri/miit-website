# Discovery report

Conducted 21 October 2026, before implementation.

## Sources inspected

| Source | Access | What was available |
| --- | --- | --- |
| miitcorporation.odoo.com (home) | Public page text and image URLs | History, mission, vision, values, products, services, industries, brands, metrics, contact |
| MIIT logo (`/web/image/website/1/logo/...`) | Downloaded | 240 × 166 WebP raster on white. Blue monogram, about `#204788` |
| LinkedIn post (65-tonne order) | Public post text | Order facts, categories, client type, services |
| LinkedIn company page | Not inspected in depth (login wall) | — |
| terminal-industries.com | Page text and structure only | Section sequence, navigation, interactive patterns |

**Limitations:**
- The Terminal Industries site was read as rendered text. Its scripts, animation timing and video assets were not observable, and none were copied.
- No private systems, Odoo backend or source code were accessed.

## Verified MIIT facts used on the site

- **History.** Formerly **Apco Tools Traders**, founded in the **early 1970s**. It began with magnets, drills and tools and expanded into most industrial categories. The exact founding year is not public.
- **Mission, vision and values.** The wording is retained, lightly edited for grammar.
- **Products.** Cutting tools, abrasives, hand tools, safety equipment and workshop essentials. MS, SS and TMT; beams, channels, angles and plates; valves, flanges and pipe fittings. Also bearings, chain pulleys, nuts and bolts, instruments, couplings, magnets, pneumatics, aluminium and power tools.
- **Industries.** Manufacturing, Foundries, Exports, CNC-VMC, Construction and Contractors. Body copy also mentions Fabrication, EPC/Turnkey and Oil & Gas.
- **Brands.** Norton, Addison, Taparia, Miranda, Bipico and I.T., "and any other make as per customer preference".
- **Metrics.** 50+ years, 50+ affiliated partners/distributors, 1000+ products served, 100+ customers. Their meaning is unconfirmed, so they are hidden by default (`NEXT_PUBLIC_SHOW_METRICS`).
- **Contact.**
  - Phones: +91 9820293202 and +91 9869314101.
  - Email: miitcorporation@gmail.com. The existing site's mailto link points to the placeholder `info@yourcompany.example.com`, which was not reused.
  - Address: 96 Narayan Dhru Street, 3rd Floor, Mumbai 400003.
- **Case study (LinkedIn).**
  - The client was an exporter, and a repeat customer, supplying oil, water and steam-based plants to a textile manufacturer.
  - The order covered 130 products and 65 tonnes (65,000 kg), in specific sizes, grades and quantities, on a tight deadline.
  - Categories: valves, pipe fittings, pipes, H/L/C beams, flanges, tools, nuts and bolts, and instruments.
  - MIIT consolidated the plan, checked specifications against export compliance standards, and sourced from dozens of suppliers.
  - MIIT handled packaging, quality checks and dispatch, with one contact and one invoice. Delivery was reported as on time and to specification.

**Not reused from the existing site:**
- The empty "Trusted by Industry Leaders" testimonial block.
- The client-logo image, since permission is unverified.
- The generic "Why choose us" claims (on-time delivery, competitive pricing), because they are unsubstantiated.
- Unsplash stock images.

## Reference patterns adopted (in MIIT's own way)

| Terminal Industries pattern | MIIT implementation |
| --- | --- |
| Mega-menu navigation with product/market groups | Products mega menu with category previews; Industries and Resources panels |
| Strong hero then problem framing | Scroll-scrubbed film hero → positioning → procurement challenges |
| Tabbed module switcher | Product explorer (ARIA tabs) |
| Calculator with sliders | Requirement Complexity Planner (no prices or savings) |
| Numbered benefit blocks | "Why MIIT" editorial grid |
| FAQ with category tabs and accordion | FAQ filters and accordion |
| Lead form with intent dropdown | Multi-step, multi-line-item RFQ with uploads |
| Closing CTA and three-column footer | Final CTA scene and four-column footer |

## Decisions

- **Palette.** Taken from the MIIT monogram's blue (core stroke ≈ `#174787`), not the proposed forest green. There are three shades: `brand` for light backgrounds, `accent-fill` for buttons, and `accent` (a bright tint) for dark backgrounds. Tokens are in `src/app/globals.css`. The company supplied the dark-background logo on 21 Oct 2026, and a transparent version is at `public/brand/miit-mark.png`.
- **Logo.** The transparent mark (`public/brand/miit-mark.png`) appears beside the typeset name in the header and footer, and on the About page. Replace it with a vector file when one is supplied.
- **Odoo.** The new site runs independently. An optional Odoo CRM adapter is included but is not enabled until it is verified (see INTEGRATIONS.md).

## Open questions for MIIT

See `LAUNCH-CHECKLIST.md`.

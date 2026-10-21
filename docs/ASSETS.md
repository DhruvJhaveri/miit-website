# Media plan and asset register

## What was produced, and how

The site's cinematic media is **real footage**: licensed stock shot by professional videographers, researched and selected shot by shot. It was then trimmed, graded and joined into one film by `scripts/media/build_media.py`.

**No AI-generated video or imagery is used anywhere on the site.** The environment had no video-generation tool, and the brief asked for realistic footage that does not look AI-generated.

**Pipeline:**
1. `fetch_sources.py` downloads the source clips.
2. `build_media.py` processes each shot:
   - trim to the edit decision list (EDL)
   - crop to 16:9 for desktop, or to a subject-centred 9:16 for mobile
   - a slow dolly push-in (2× upscale, then zoompan)
   - a shared colour grade: steel-blue shadows, warm molten highlights, filmic curve, vignette
3. The shots are cross-faded into one sequence.
4. The sequence is exported as numbered WebP frame sequences for canvas scroll-scrubbing.
5. Film grain is added live in CSS, so it isn't baked into the frames.

## Deliverables in `public/media/`

| Asset | Files | Size | Use |
| --- | --- | --- | --- |
| Scroll film (desktop, 16:9) | `film/desktop/0000–0239.webp`, 1280×720 | ≈ 12.6 MB total (≈ 54 KB/frame) | Homepage Scenes 1–2, scrubbed by scroll |
| Scroll film (mobile, 9:16) | `film/mobile/0000–0159.webp`, 540×960 | ≈ 4.5 MB total | Same, on portrait screens |
| Film manifest | `film/manifest.json` | — | Frame counts and sizes read by the player |
| Posters | `film/poster-{desktop,mobile}.{webp,jpg}` | 23–83 KB | First paint, reduced motion, failed media |
| Watchable film cut | `film/miit-film-{desktop,mobile}.mp4` | 7.2 / 4.8 MB | Reference, social, presentations (not loaded by the site) |
| Product macro loop | `loops/product-macro.{webm,mp4}` + poster | ≈ 1.3–1.8 MB | "Everyday supplies" panel |
| Logistics loop | `loops/logistics.{webm,mp4}` + poster | ≈ 1.3–1.5 MB | "Project procurement" panel; Procurement page |
| Stills (30) | `stills/cat-*`, `ind-*`, `ed-*` (1440 px JPEG) | 60–250 KB each | Categories, industries, editorial |
| Company logo | `public/brand/miit-logo-original.png` | 240×166 | The company's own asset, from its website |

**Loading strategy:**
- Only the poster loads with the page.
- Frames load after hydration in strided passes (0, last, every 16th, 8th, 4th, 2nd, then the rest), so the whole film is scrubbable coarsely within a few requests.
- A missing frame is replaced by the nearest loaded frame.
- A circuit breaker stops requests if the first ones fail.
- Loops attach their source only near the viewport, and never with reduced motion.

## Film edit (EDL)

The film runs 25.8 s, at 240 frames on desktop and 160 on mobile.

| # | Act | Source (Mixkit ID) | Shot | Purpose |
| --- | --- | --- | --- | --- |
| 1 | I | 17897 | Steel-mill hall, crane, furnace flare, slow push | Dark, atmospheric opening; hero headline |
| 2 | I | 1675 | Night aerial of an industrial estate | Heritage beat (five decades) |
| 3 | II | 2252 | Lathe on bright steel with coolant | 01 The right products |
| 4 | II | 2247 | Twist drill cutting steel (MIIT began with drills) | Drills & cutting tools |
| 5 | II | 46082 | Cut-off disc throwing sparks | Cutting & grinding |
| 6 | II | 21045 | CNC plasma cutting rings from plate | 02 The right specifications |
| 7 | II | 32822 | Fasteners falling onto a surface | Nuts, bolts & fasteners |
| 8 | II | 47641 | Heavy chain links | Chain & lifting |
| 9 | III | 32824 | Stainless process pipework | 03 Coordination: pipes, valves & fittings |
| 10 | III | 22194 | Refinery aerial, graded towards dusk | Project-scale supply |
| 11 | IV | 36318 | Night container port with light trails | MIIT identity and CTA finale |

Shot timings used by the typography live in `src/components/home/film/timeline.ts`. If the EDL changes, update them.

## Source licence

All source clips come from **Mixkit** under the **Mixkit Stock Video Free License** (https://mixkit.co/license/#videoFree). It permits commercial use without attribution, but not resale or redistribution of the raw clips. The full per-clip register is in `src/content/media-credits.ts` and is published at `/credits`.

> Before launch, have MIIT confirm the licence terms on the Mixkit website. Online summaries were consistent, but the full licence text could not be retrieved programmatically.

**Honesty labelling.** Product and editorial images carry "Illustrative" captions or alt text where context could imply otherwise. The credits page states that the footage does not depict MIIT's premises, staff, stock, customers or shipments.

## Generated vs licensed vs company-provided

| Type | Assets |
| --- | --- |
| Generated (AI) | **None** |
| Licensed stock (edited and graded for MIIT) | Every film frame, poster, loop and still in `public/media/` |
| Company-provided | The logo (`public/brand/miit-logo-original.png`) |
| Typography-only | Brand names (no partner logos are shown until permission is given) |

## Known limitations

- **Resolution.** Most of these Mixkit clips are free only at 720p; HD needs a paid Envato Elements licence. Frames are exported at native 1280×720 and shown with CSS grain, which reads as filmic on large screens but isn't 4K-sharp. To upgrade:
  1. License the same clips in HD from Envato Elements.
  2. Put them in `media-src/raw/<id>.mp4`.
  3. In `build_media.py`, change the landscape output in `shot_filter` and `build_film` to 1920×1080.
  4. Run `npm run media:build`.
- **No MIIT photography yet.** Category and industry images are representative stock. Replace them with MIIT's own product and warehouse photography when it's available (see below).

## Replacing or updating media

- **Re-cut the film.** Edit `FILM` in `scripts/media/build_media.py`, run `npm run media:fetch && npm run media:build`, then update `timeline.ts`.
- **Swap a still.** Edit the `STILLS` entry (clip ID, timestamp, horizontal focus), or drop a new 1440 px JPEG into `public/media/stills/` with the same file name.
- **Use MIIT photography.** Add images under `public/media/stills/`, then point the `image` fields in `src/content/categories.ts` and `industries.ts` at them. Product families can also set their own `image`.
- Purge the CDN cache after replacing media. `/media/*` is cached for 7 days.

## Optional: brief for a commissioned shoot or AI-assisted pickups

If MIIT later wants footage of its own operations, these shot descriptions match the existing edit's framing and grade.

1. **Warehouse establishing.** Slow dolly down an aisle of racked industrial stock at dawn. Warm practical lights, cool ambient fill.
2. **Product macro.** Flanges, valves and fittings on dark steel. Single hard key light, slow 10–15° orbit. No branding visible.
3. **Dispatch.** Pallets being strapped and labelled, then a forklift lifting a mixed-category consignment.
4. **Team at work.** Hands checking a drawing against a part with callipers.

Any real-company shoot needs releases for identifiable people. Any AI-generated pickup must be labelled as such and must never be presented as MIIT's facilities.

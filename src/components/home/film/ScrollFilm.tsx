"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import manifest from "../../../../public/media/film/manifest.json";
import { BEATS, FINALE_START } from "./timeline";
import { drawCover, FrameSequence } from "./frames";
import { track } from "@/lib/analytics";

type Mode = "film" | "static";
type SetKey = "desktop" | "mobile";

const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Scene 1–2: full-screen opening + pinned, scroll-scrubbed industrial film.
 *
 * - Pinning uses CSS `position: sticky` (no scroll hijacking, works with touch).
 * - GSAP ScrollTrigger maps scroll progress to one timeline that drives both the
 *   frame index and the typography, so text and footage stay in sync in both
 *   directions.
 * - Without JS, or with reduced motion, the section renders as a static poster
 *   with every narrative beat listed as normal content (see globals.css).
 */
export function ScrollFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [setKey, setSetKey] = useState<SetKey>("desktop");
  const [ready, setReady] = useState(false);

  // Decide mode and frame set on the client and follow preference changes.
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_QUERY);
    const portrait = window.matchMedia(PORTRAIT_QUERY);
    const sync = () => {
      setMode(reduced.matches ? "static" : "film");
      setSetKey(portrait.matches ? "mobile" : "desktop");
    };
    sync();
    reduced.addEventListener("change", sync);
    portrait.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      portrait.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (mode !== "film") return;
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const meta = manifest[setKey];
    const state = { frame: 0, drawn: -1 };
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const draw = (force = false) => {
      const i = Math.round(state.frame);
      if (!force && i === state.drawn) return;
      const img = seq.get(i);
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCover(ctx, img, canvas.width, canvas.height);
      state.drawn = seq.images[i] ? i : -1;
      if (!ready) setReady(true);
    };

    const seq = new FrameSequence({ ...meta, base: `/media/film/${setKey}` }, (i) => {
      // redraw when the frame we want (or a closer one) arrives
      if (i === Math.round(state.frame) || state.drawn === -1) draw(true);
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(stage.clientWidth * dpr);
      canvas.height = Math.round(stage.clientHeight * dpr);
      draw(true);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();
    seq.start();

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = gsap.utils.selector(section);
      const rail = q("[data-rail-step]");

      const gctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const active = p < BEATS[1].start ? 0 : p < BEATS[2].start ? 1 : p < BEATS[3].start ? 2 : p < FINALE_START ? 3 : 4;
              rail.forEach((el, k) => el.toggleAttribute("data-active", k <= active));
            },
          },
        });

        tl.to(state, { frame: meta.frames - 1, duration: 1, onUpdate: () => draw() }, 0);
        tl.to(q("[data-film-fill]"), { scaleX: 1, scaleY: 1, duration: 1 }, 0);

        // hero leaves early, but is fully visible and interactive on arrival
        tl.to(q("[data-scroll-cue]"), { autoAlpha: 0, duration: 0.02 }, 0.005);
        tl.to(q("[data-beat='hero']"), { autoAlpha: 0, y: -70, duration: 0.07 }, 0.075);
        tl.to(q("[data-film-scrim='hero']"), { autoAlpha: 0.8, duration: 0.08 }, 0.07);

        for (const b of BEATS) {
          const el = q(`[data-beat='${b.id}']`);
          const title = q(`[data-beat='${b.id}'] [data-beat-title]`);
          tl.fromTo(el, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.04, ease: "power2.out" }, b.start);
          tl.fromTo(title, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.05, ease: "power3.out" }, b.start);
          tl.to(el, { autoAlpha: 0, y: -60, duration: 0.035, ease: "power2.in" }, b.end - 0.035);
          b.labels.forEach((l, k) => {
            const lab = q(`[data-label='${b.id}-${k}']`);
            tl.fromTo(lab, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.02 }, l.start + 0.01);
            tl.to(lab, { autoAlpha: 0, x: -24, duration: 0.02 }, l.end - 0.015);
          });
        }

        tl.fromTo(q("[data-beat='finale']"), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, FINALE_START);
        tl.fromTo(q("[data-finale-word]"), { yPercent: 105 }, { yPercent: 0, duration: 0.07, stagger: 0.012, ease: "power3.out" }, FINALE_START);
        tl.to(q("[data-film-scrim='finale']"), { autoAlpha: 1, duration: 0.06 }, FINALE_START - 0.02);
      }, section);

      ScrollTrigger.refresh();
      cleanup = () => gctx.revert();
    })();

    return () => {
      disposed = true;
      seq.abort();
      ro.disconnect();
      cleanup?.();
    };
    // `ready` intentionally excluded: it only gates the poster cross-fade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, setKey]);

  return (
    <section ref={sectionRef} className="film relative bg-ink text-paper" aria-label="MIIT CORPORATION introduction" data-mode={mode}>
      <div ref={stageRef} className="film-stage grain overflow-hidden">
        {/* Poster: first frame of the film. Visible until the canvas paints, and the static fallback. */}
        <picture>
          <source media={PORTRAIT_QUERY} srcSet="/media/film/poster-mobile.webp" type="image/webp" />
          <source media={PORTRAIT_QUERY} srcSet="/media/film/poster-mobile.jpg" />
          <source srcSet="/media/film/poster-desktop.webp" type="image/webp" />
          <img
            src="/media/film/poster-desktop.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready && mode === "film" ? "opacity-0" : "opacity-100"}`}
          />
        </picture>
        <canvas ref={canvasRef} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${mode === "film" ? "opacity-100" : "opacity-0"}`} />

        {/* Scrims for legibility */}
        <div data-film-scrim="hero" className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" aria-hidden />
        <div data-film-scrim="finale" className="film-only absolute inset-0 bg-ink/45 opacity-0" aria-hidden />

        {/* Scene 1 — hero */}
        <div data-beat="hero" className="film-beat film-beat--hero absolute inset-0 z-10 flex items-end">
          <div className="shell pb-[max(4.5rem,11vh)]">
            <p className="hero-in t-eyebrow mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/70" style={{ "--d": "0ms" } as React.CSSProperties}>
              <span className="inline-block size-1.5 rounded-full bg-accent-fill" aria-hidden />
              Industrial engineering supplies · Mumbai · Since the early 1970s
            </p>
            <h1 className="t-display max-w-[14ch]">
              <span className="hero-in block" style={{ "--d": "80ms" } as React.CSSProperties}>Industrial Procurement.</span>
              <span className="hero-in block text-accent" style={{ "--d": "180ms" } as React.CSSProperties}>Simplified.</span>
            </h1>
            <p className="hero-in t-lead mt-7 max-w-[38ch] text-paper/80" style={{ "--d": "300ms" } as React.CSSProperties}>
              Industrial components and engineering supplies for businesses that keep industry moving.
            </p>
            <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ "--d": "400ms" } as React.CSSProperties}>
              <Link
                href="/products"
                onClick={() => track("cta_click", { location: "hero", target: "products" })}
                className="group inline-flex items-center gap-2 rounded-full bg-accent-fill px-7 py-4 font-semibold text-white transition-colors hover:bg-paper"
              >
                Explore Products
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="/request-quote?source=hero"
                onClick={() => track("cta_click", { location: "hero", target: "rfq" })}
                className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-7 py-4 font-semibold backdrop-blur-sm transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Scene 2 — narrative beats */}
        {BEATS.map((b) => (
          <div key={b.id} data-beat={b.id} className="film-beat absolute inset-0 z-10 flex items-center" aria-hidden>
            <div className="shell">
              <div className="max-w-2xl">
                {b.index && <p className="t-eyebrow mb-5 text-accent">{b.index} — {b.id === "coordination" ? "Coordination" : b.id === "specifications" ? "Specifications" : "Products"}</p>}
                <h2 data-beat-title className="t-h1 max-w-[16ch]">{b.title}</h2>
                <p className="t-lead mt-6 max-w-[34ch] text-paper/75">{b.body}</p>
              </div>
            </div>
            {b.labels.map((l, k) => (
              <p
                key={l.text}
                data-label={`${b.id}-${k}`}
                className="t-eyebrow absolute bottom-[13vh] right-[var(--gutter)] flex items-center gap-3 text-paper/85 opacity-0 max-md:bottom-[18vh]"
              >
                <span className="inline-block h-px w-10 bg-accent" aria-hidden />
                {l.text}
              </p>
            ))}
          </div>
        ))}

        {/* Finale — identity + CTA */}
        <div data-beat="finale" className="film-beat absolute inset-0 z-10 flex items-center justify-center text-center" aria-hidden>
          <div className="shell">
            <p className="t-eyebrow mb-6 text-paper/70">Industrial engineering supplies &amp; procurement</p>
            <p className="t-display overflow-hidden pb-2" aria-label="MIIT CORPORATION">
              <span data-finale-word className="block sm:inline-block">MIIT</span>{" "}
              <span data-finale-word className="block text-[0.62em] text-paper/90 sm:inline-block sm:text-[1em]">CORPORATION</span>
            </p>
            <p className="t-lead mx-auto mt-6 max-w-[40ch] text-paper/75">One partner for tools, consumables, materials and multi-category project requirements.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/request-quote?source=film-finale" tabIndex={-1} className="film-cta inline-flex items-center gap-2 rounded-full bg-accent-fill px-7 py-4 font-semibold text-white transition-colors hover:bg-paper">
                Request a Quote <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link href="/products" tabIndex={-1} className="film-cta inline-flex items-center gap-2 rounded-full border border-paper/35 px-7 py-4 font-semibold transition-colors hover:bg-paper hover:text-ink">
                Explore Products
              </Link>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="film-only pointer-events-none absolute left-[var(--gutter)] right-[var(--gutter)] top-[calc(var(--nav-h)+0.75rem)] z-20 flex items-center gap-4 md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:flex-col" aria-hidden>
          <div className="relative h-px flex-1 bg-paper/20 md:h-48 md:w-px md:flex-none">
            <div data-film-fill className="absolute inset-0 origin-left scale-x-0 bg-accent md:origin-top md:scale-x-100 md:scale-y-0" />
          </div>
          <ol className="t-eyebrow flex gap-4 text-[0.65rem] md:flex-col md:gap-3">
            {["Intro", "01", "02", "03", "MIIT"].map((s, k) => (
              <li key={s} data-rail-step className="text-paper/35 transition-colors data-[active]:text-paper" data-active={k === 0 ? "" : undefined}>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div data-scroll-cue className="film-only absolute bottom-8 left-1/2 z-20 -translate-x-1/2" aria-hidden>
          <div className="hidden flex-col items-center gap-2 text-paper/60 md:flex">
            <span className="t-eyebrow text-[0.65rem]">Scroll</span>
            <ArrowDown className="size-4 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Static narrative: shown without JS / with reduced motion; screen-reader text in film mode. */}
      <div className="film-static bg-ink">
        <div className="shell grid gap-10 py-20 md:grid-cols-3">
          {BEATS.filter((b) => b.index).map((b) => (
            <div key={b.id} className="border-t border-paper/15 pt-6">
              <p className="t-eyebrow text-accent">{b.index}</p>
              <h2 className="t-h3 mt-3">{b.title}</h2>
              <p className="mt-3 text-paper/70">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

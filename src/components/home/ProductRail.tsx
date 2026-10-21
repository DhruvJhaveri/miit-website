"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories } from "@/content/categories";

/**
 * Scene 3 — product portfolio. Desktop with motion: the section pins and the
 * category panels travel horizontally with vertical scroll; each image settles
 * from a slight scale as its panel arrives. Elsewhere (touch, reduced motion,
 * no JS): a native horizontal scroll-snap rail that never traps scrolling.
 */
export function ProductRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (hover: hover)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        const viewport = viewportRef.current!;
        viewport.dataset.pinned = "true";
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-rail-panel]", track).forEach((panel) => {
          const img = panel.querySelector("[data-rail-img]");
          const copy = panel.querySelectorAll("[data-rail-copy]");
          gsap.fromTo(img, { scale: 1.18 }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "center center", scrub: true },
          });
          gsap.fromTo(copy, { autoAlpha: 0, y: 24 }, {
            autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 75%", toggleActions: "play none none reverse" },
          });
        });
        return () => {
          delete viewport.dataset.pinned;
        };
      });
      revert = () => mm.revert();
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-24 text-paper lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="portfolio-title">
      <div className="shell flex flex-wrap items-end justify-between gap-6 lg:pt-[calc(var(--nav-h)+1rem)]">
        <div>
          <p className="t-eyebrow mb-4 flex items-center gap-3 text-accent">
            <span className="inline-block h-px w-8 bg-current" aria-hidden /> Product portfolio
          </p>
          <h2 id="portfolio-title" className="t-h2 max-w-[20ch]">Nine product families. One requirement.</h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="t-eyebrow hidden items-center gap-2 text-paper/50 md:flex lg:hidden">
            Swipe <ArrowRight className="size-3.5" aria-hidden />
          </p>
          <Link href="/products" className="link-underline inline-flex items-center gap-2 text-paper/80">
            Full catalogue <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="no-scrollbar mt-12 snap-x snap-mandatory overflow-x-auto overscroll-x-contain data-[pinned]:snap-none data-[pinned]:overflow-visible lg:mt-10"
        tabIndex={0}
        aria-label="Product categories"
      >
        <ul ref={trackRef} className="flex w-max gap-5 px-[var(--gutter)] lg:gap-8">
          {categories.map((c) => (
            <li key={c.slug} data-rail-panel className="w-[80vw] shrink-0 snap-start sm:w-[52vw] lg:w-[30vw] xl:w-[27vw]">
              <Link href={`/products/${c.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-3 lg:aspect-[5/6] lg:max-h-[56vh] lg:w-full">
                  <div data-rail-img className="absolute inset-0 will-change-transform">
                    <Image src={c.image} alt={c.imageAlt} fill sizes="(min-width:1024px) 30vw, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span className="t-eyebrow absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-paper/80 backdrop-blur">{c.code} / 09</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 data-rail-copy className="t-h3 group-hover:text-accent">{c.name}</h3>
                    <p data-rail-copy className="mt-2 max-w-[38ch] text-sm text-paper/60">{c.tagline}</p>
                  </div>
                  <span data-rail-copy className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-paper/25 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

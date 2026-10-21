"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Scene 4 — an ILLUSTRATIVE requirement assembling from scattered lines into a
 * consolidated BOM and an RFQ. Desktop + motion only; elsewhere the final BOM is
 * shown statically. The real, working form is the RFQ section further down.
 */
const GROUPS = ["Structural", "Piping", "Tools", "Fasteners", "Instruments"] as const;

const LINES: { g: number; name: string; spec: string }[] = [
  { g: 0, name: "Beam ISMB 200", spec: "6 m · 40 nos" },
  { g: 0, name: "TMT bar 12 mm", spec: "Fe 500D · 8 t" },
  { g: 0, name: "MS plate 10 mm", spec: "2500×1250 · 12 nos" },
  { g: 1, name: "Gate valve 50 NB", spec: "Class 150 · 24 nos" },
  { g: 1, name: "Weld-neck flange 4″", spec: "Class 150 · 36 nos" },
  { g: 1, name: "Elbow 90° 2″", spec: "Sch 40 · 80 nos" },
  { g: 2, name: "HSS drill set", spec: "1–13 mm · 10 sets" },
  { g: 2, name: "Spanner set", spec: "6–32 mm · 15 sets" },
  { g: 2, name: "Cut-off wheel 355 mm", spec: "Steel · 200 nos" },
  { g: 3, name: "Hex bolt M16×60", spec: "Gr 8.8 · 600 nos" },
  { g: 3, name: "Stud bolt M20", spec: "B7 · 240 nos" },
  { g: 3, name: "Spring washer M16", spec: "Zinc · 600 nos" },
  { g: 4, name: "Pressure gauge", spec: "0–10 bar · 30 nos" },
  { g: 4, name: "Vernier calliper", spec: "300 mm · 6 nos" },
  { g: 4, name: "Dial gauge", spec: "0–10 mm · 6 nos" },
];

// stage 1: scattered positions (% of stage box)
const SCATTER: [number, number][] = [
  [6, 8], [58, 4], [31, 22], [72, 30], [12, 41], [46, 47], [80, 12], [24, 63], [62, 66],
  [4, 78], [40, 82], [76, 52], [20, 30], [54, 22], [70, 84],
];

const STEPS = [
  { t: "Multiple product requirements", d: "Lines arrive from maintenance, stores and projects — in different formats." },
  { t: "Organised by category", d: "Each line is grouped with the category and suppliers it belongs to." },
  { t: "Specification and quantity", d: "Sizes, grades, ratings and quantities are confirmed for every line." },
  { t: "One consolidated BOM", d: "The requirement becomes a single, sourceable bill of materials." },
  { t: "A coordinated quotation request", d: "One RFQ, one point of contact — ready to quote." },
];

export function ComplexityAssembly() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current!;
        section.dataset.animated = "true";
        const q = gsap.utils.selector(section);
        const chips = q("[data-chip]");
        const steps = q("[data-step]");
        const setStep = (k: number) => steps.forEach((s, i) => s.toggleAttribute("data-active", i === k));
        setStep(0);

        const grouped = (i: number): [number, number] => {
          const line = LINES[i];
          const row = LINES.slice(0, i).filter((l) => l.g === line.g).length;
          return [1 + line.g * 20, 18 + row * 19];
        };
        const bom = (i: number): [number, number] => [8, 14 + i * 5.1];

        chips.forEach((c, i) => gsap.set(c, { left: `${SCATTER[i][0]}%`, top: `${SCATTER[i][1]}%`, rotate: (i % 5) * 2 - 4 }));
        gsap.set(q("[data-spec]"), { autoAlpha: 0, height: 0 });
        gsap.set(q("[data-group-label]"), { autoAlpha: 0, y: 10 });
        gsap.set(q("[data-bom-frame]"), { autoAlpha: 0, scale: 0.97 });
        gsap.set(q("[data-rfq-card]"), { autoAlpha: 0, y: 30 });
        gsap.set(q("[data-qty]"), { autoAlpha: 0, width: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => setStep(Math.min(4, Math.floor(self.progress * 5))),
          },
        });
        // 2 — group by category
        tl.addLabel("group", 1);
        chips.forEach((c, i) => {
          const [x, y] = grouped(i);
          tl.to(c, { left: `${x}%`, top: `${y}%`, rotate: 0 }, `group-=${0.9 - (i % 5) * 0.04}`);
        });
        tl.to(q("[data-group-label]"), { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.5 }, "group-=0.3");
        // 3 — specs and quantities
        tl.to(q("[data-spec]"), { autoAlpha: 1, height: "auto", stagger: 0.02, duration: 0.6 }, "group+=0.4");
        // 4 — consolidate into BOM
        tl.addLabel("bom", "+=0.6");
        tl.to(q("[data-group-label]"), { autoAlpha: 0, duration: 0.4 }, "bom-=0.8");
        tl.to(q("[data-spec]"), { autoAlpha: 0, height: 0, duration: 0.4 }, "bom-=0.8");
        chips.forEach((c, i) => {
          const [x, y] = bom(i);
          tl.to(c, { left: `${x}%`, top: `${y}%`, width: "84%", borderRadius: 4, paddingTop: 2, paddingBottom: 2 }, `bom-=${0.6 - i * 0.02}`);
        });
        tl.to(q("[data-qty]"), { autoAlpha: 1, width: "auto", duration: 0.4 }, "bom");
        tl.to(q("[data-bom-frame]"), { autoAlpha: 1, scale: 1, duration: 0.6 }, "bom-=0.2");
        // 5 — RFQ
        tl.addLabel("rfq", "+=0.5");
        tl.to(q("[data-bom-wrap]"), { scale: 0.82, yPercent: -8, transformOrigin: "50% 0%", duration: 0.8 }, "rfq-=0.4");
        tl.to(q("[data-rfq-card]"), { autoAlpha: 1, y: 0, duration: 0.6 }, "rfq-=0.1");
        tl.to({}, { duration: 0.4 });

        return () => {
          delete section.dataset.animated;
          steps.forEach((s) => s.setAttribute("data-active", ""));
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
    <section ref={sectionRef} className="group/assembly relative bg-paper-2 data-[animated]:h-[420vh]" aria-labelledby="assembly-title">
      <div className="shell grid gap-12 py-24 lg:sticky lg:top-0 lg:h-screen lg:grid-cols-12 lg:items-center lg:py-0">
        <div className="lg:col-span-4 lg:pt-[var(--nav-h)]">
          <p className="t-eyebrow mb-5 flex items-center gap-3 text-blue">
            <span className="inline-block h-px w-8 bg-current" aria-hidden /> Consolidated procurement
          </p>
          <h2 id="assembly-title" className="t-h2 max-w-[16ch]">One requirement. Many categories. One coordinated process.</h2>
          <ol className="mt-10 space-y-1">
            {STEPS.map((s, i) => (
              <li
                key={s.t}
                data-step
                data-active=""
                className="border-l-2 border-ink/10 py-3 pl-5 opacity-45 transition-[opacity,border-color] duration-500 data-[active]:border-brand data-[active]:opacity-100"
              >
                <p className="font-medium">
                  <span className="t-eyebrow mr-3 text-graphite">{String(i + 1).padStart(2, "0")}</span>
                  {s.t}
                </p>
                <p className="mt-1 text-sm text-graphite">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-8 lg:pt-[var(--nav-h)]">
          {/* Static (default): a readable BOM list. Animated (desktop + motion): absolute chips on a stage. */}
          <div className="relative overflow-hidden rounded-md border border-ink/10 bg-paper p-5 shadow-[0_30px_80px_-40px_rgba(12,15,18,0.35)] group-data-[animated]/assembly:aspect-[16/12] group-data-[animated]/assembly:max-h-[78vh] group-data-[animated]/assembly:p-0">
            <p className="t-eyebrow mb-3 text-graphite group-data-[animated]/assembly:absolute group-data-[animated]/assembly:right-4 group-data-[animated]/assembly:top-4 group-data-[animated]/assembly:z-10 group-data-[animated]/assembly:mb-0">Illustrative requirement</p>

            <div className="absolute inset-x-0 top-[8%] hidden group-data-[animated]/assembly:block" aria-hidden>
              {GROUPS.map((g, i) => (
                <span key={g} data-group-label className="t-eyebrow absolute text-blue" style={{ left: `${1 + i * 20}%` }}>{g}</span>
              ))}
            </div>

            <div data-bom-wrap className="relative group-data-[animated]/assembly:h-full">
              <div data-bom-frame className="pointer-events-none mb-4 flex items-center justify-between gap-4 border-b border-ink/10 pb-3 group-data-[animated]/assembly:pr-48 group-data-[animated]/assembly:absolute group-data-[animated]/assembly:left-[6%] group-data-[animated]/assembly:right-[6%] group-data-[animated]/assembly:top-[4%] group-data-[animated]/assembly:mb-0">
                <p className="t-eyebrow">Bill of materials</p>
                <p className="t-eyebrow text-graphite">15 lines · 5 categories</p>
              </div>
              <ul className="space-y-1.5 group-data-[animated]/assembly:space-y-0" aria-label="Example bill of materials">
                {LINES.map((l) => (
                  <li
                    key={l.name}
                    data-chip
                    className="flex items-center justify-between gap-3 rounded-sm border border-ink/12 bg-white px-3 py-1.5 text-[0.82rem] shadow-sm group-data-[animated]/assembly:absolute group-data-[animated]/assembly:w-[18%] group-data-[animated]/assembly:rounded-2xl group-data-[animated]/assembly:px-3.5 group-data-[animated]/assembly:py-2"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{l.name}</span>
                      <span data-spec className="hidden overflow-hidden text-[0.72rem] text-graphite group-data-[animated]/assembly:block">{l.spec}</span>
                    </span>
                    <span data-qty className="shrink-0 overflow-hidden whitespace-nowrap font-mono text-[0.72rem] text-graphite">
                      <span className="mr-2 hidden text-blue sm:inline">{GROUPS[l.g]}</span>
                      {l.spec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-rfq-card className="relative mt-5 flex flex-wrap items-center justify-between gap-4 rounded-md bg-ink p-5 text-paper group-data-[animated]/assembly:absolute group-data-[animated]/assembly:inset-x-[6%] group-data-[animated]/assembly:bottom-[5%] group-data-[animated]/assembly:mt-0">
              <div>
                <p className="t-eyebrow text-accent">Request for quotation</p>
                <p className="mt-1 font-medium">15 lines · 5 categories · one point of contact</p>
              </div>
              <a href="#rfq" className="inline-flex items-center gap-2 rounded-full bg-accent-fill px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-paper">
                Start your RFQ <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

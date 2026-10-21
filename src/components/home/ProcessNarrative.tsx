"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/content/process";
import { ProcessSteps } from "@/components/process/ProcessSteps";

/**
 * Scene 5 — procurement process. Desktop + motion: a pinned sequence where
 * scroll advances the active stage (nodes are also clickable). Mobile / reduced
 * motion: the same content as expandable steps in normal document flow.
 */
export function ProcessNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<{ start: number; end: number } | null>(null);

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
        // set the scroll length before measuring, then let React swap the layout
        section.style.height = `${processSteps.length * 70 + 100}vh`;
        setAnimated(true);
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(Math.min(processSteps.length - 1, Math.floor(self.progress * processSteps.length)));
          },
          onRefresh: (self) => {
            triggerRef.current = { start: self.start, end: self.end };
          },
        });
        triggerRef.current = { start: st.start, end: st.end };
        return () => {
          section.style.height = "";
          setAnimated(false);
          st.kill();
        };
      });
      revert = () => mm.revert();
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  const jump = (i: number) => {
    const t = triggerRef.current;
    if (!t) return;
    const y = t.start + ((t.end - t.start) * (i + 0.5)) / processSteps.length;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const step = processSteps[active];

  return (
    <section
      ref={sectionRef}
      className="relative bg-steel text-paper"
      aria-labelledby="process-title"
    >
      <div className={animated ? "sticky top-0 flex h-screen items-center overflow-hidden" : "py-28"}>
        <div className="shell w-full">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-eyebrow mb-5 flex items-center gap-3 text-accent">
                <span className="inline-block h-px w-8 bg-current" aria-hidden /> How procurement works with MIIT
              </p>
              <h2 id="process-title" className="t-h2 max-w-[18ch]">From requirement to dispatch, coordinated.</h2>
            </div>
            <p className="max-w-sm text-sm text-paper/60">An indicative process. The exact steps depend on the order, the products and the project requirements.</p>
          </div>

          {animated ? (
            <div className="mt-16">
              {/* rail */}
              <div className="relative">
                <div className="absolute left-0 right-0 top-[11px] h-px bg-white/15" aria-hidden />
                <div className="absolute left-0 top-[11px] h-px bg-accent transition-[width] duration-150" style={{ width: `${progress * 100}%` }} aria-hidden />
                <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${processSteps.length}, minmax(0, 1fr))` }}>
                  {processSteps.map((s, i) => (
                    <li key={s.n}>
                      <button type="button" onClick={() => jump(i)} className="group flex flex-col items-start gap-4 text-left" aria-current={i === active ? "step" : undefined}>
                        <span className={`flex size-[23px] items-center justify-center rounded-full border transition-colors duration-500 ${i <= active ? "border-accent bg-accent" : "border-white/30 bg-steel"}`}>
                          <span className={`size-1.5 rounded-full ${i <= active ? "bg-ink" : "bg-white/40"}`} />
                        </span>
                        <span className={`t-eyebrow transition-colors ${i === active ? "text-paper" : "text-paper/45 group-hover:text-paper/80"}`}>{s.n}</span>
                        <span className={`max-w-[14ch] text-sm font-medium transition-colors ${i === active ? "text-paper" : "text-paper/45 group-hover:text-paper/80"}`}>{s.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* active stage */}
              <div key={step.n} className="mt-16 grid grid-cols-12 gap-10 animate-[hero-in_0.7s_var(--ease-out-expo)_both]" aria-live="polite">
                <div className="col-span-5">
                  <p className="t-metric text-[9rem] text-white/10">{step.n}</p>
                  <h3 className="t-h2 -mt-10">{step.title}</h3>
                  <p className="t-lead mt-5 text-paper/70">{step.summary}</p>
                </div>
                <dl className="col-span-7 grid grid-cols-3 gap-8 self-end border-t border-white/15 pt-8">
                  {(
                    [
                      ["Inputs", step.inputs],
                      ["Activities", step.activities],
                      ["Outputs", step.outputs],
                    ] as const
                  ).map(([label, list]) => (
                    <div key={label}>
                      <dt className="t-eyebrow text-accent">{label}</dt>
                      <dd className="mt-3">
                        <ul className="space-y-2 text-[0.95rem] text-paper/80">
                          {list.map((x) => <li key={x}>{x}</li>)}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ) : (
            <div className="mt-14">
              <ProcessSteps tone="dark" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

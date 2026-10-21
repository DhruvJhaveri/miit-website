"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { processSteps } from "@/content/process";

/** Expandable process steps showing the inputs, activities and outputs of each stage. */
export function ProcessSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const line = tone === "dark" ? "border-white/12" : "border-ink/12";
  const muted = tone === "dark" ? "text-paper/65" : "text-graphite";
  return (
    <ol className={`border-b ${line}`}>
      {processSteps.map((s, i) => {
        const expanded = open === i;
        return (
          <li key={s.n} className={`border-t ${line}`}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left"
              >
                <span className={`t-eyebrow ${tone === "dark" ? "text-accent" : "text-brand"}`}>{s.n}</span>
                <span>
                  <span className="t-h3 block">{s.title}</span>
                  <span className={`mt-1 block text-[0.95rem] ${muted}`}>{s.summary}</span>
                </span>
                <Plus className={`size-5 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`} aria-hidden />
              </button>
            </h3>
            <div id={`${id}-${i}`} hidden={!expanded} className="pb-8 pl-[4rem]">
              <dl className="grid gap-6 sm:grid-cols-3">
                {(
                  [
                    ["Inputs", s.inputs],
                    ["Activities", s.activities],
                    ["Outputs", s.outputs],
                  ] as const
                ).map(([label, list]) => (
                  <div key={label}>
                    <dt className={`t-eyebrow ${muted}`}>{label}</dt>
                    <dd className="mt-2">
                      <ul className="space-y-1.5 text-[0.95rem]">
                        {list.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span className="mt-2.5 inline-block size-1 shrink-0 rounded-full bg-current opacity-50" aria-hidden />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

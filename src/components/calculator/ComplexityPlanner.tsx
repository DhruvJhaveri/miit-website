"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Info } from "lucide-react";
import { assessComplexity, type ComplexityInput, type MixKey, type SpecCompleteness } from "@/lib/rfq/complexity";
import { categoryBySlug } from "@/content/categories";
import { track } from "@/lib/analytics";

const MIX: { key: MixKey; label: string }[] = [
  { key: "structural", label: "Structural steel" },
  { key: "piping", label: "Pipes, valves, fittings" },
  { key: "tools", label: "Engineering tools" },
  { key: "consumables", label: "Cutting & grinding" },
  { key: "fasteners", label: "Fasteners" },
  { key: "instruments", label: "Instruments" },
  { key: "mechanical", label: "Bearings & mechanical" },
  { key: "safety", label: "Safety & PPE" },
];

const SPECS: { v: SpecCompleteness; label: string }[] = [
  { v: "all", label: "All lines" },
  { v: "most", label: "Most lines" },
  { v: "some", label: "Some lines" },
  { v: "none", label: "Not yet" },
];

/** Requirement Complexity Planner — an internal planning aid; no prices or savings. */
export function ComplexityPlanner() {
  const [input, setInput] = useState<ComplexityInput>({
    lineItems: 40,
    categories: 4,
    suppliers: 6,
    consignments: 2,
    specs: "most",
    mix: ["structural", "piping", "fasteners"],
    documentation: false,
    packaging: false,
    exportOrder: false,
  });
  const result = useMemo(() => assessComplexity(input), [input]);
  const tracked = useRef(false);
  const set = <K extends keyof ComplexityInput>(k: K, v: ComplexityInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (tracked.current) return;
    const t = setTimeout(() => {
      tracked.current = true;
      track("calculator_complete", { band: result.band });
    }, 4000);
    return () => clearTimeout(t);
  }, [result.band]);

  const num = (k: "lineItems" | "categories" | "suppliers" | "consignments", label: string, min: number, max: number, hint?: string) => (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={`cp-${k}`} className="text-sm font-medium">{label}</label>
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max * 4}
          value={input[k]}
          onChange={(e) => set(k, Math.max(min, Number(e.target.value) || min))}
          className="w-20 rounded-md border border-ink/15 bg-white px-2 py-1 text-right font-mono text-sm"
        />
      </div>
      <input id={`cp-${k}`} type="range" min={min} max={max} value={Math.min(input[k], max)} onChange={(e) => set(k, Number(e.target.value))} className="mt-3 w-full accent-[var(--color-brand)]" />
      {hint && <p className="mt-1 text-xs text-graphite">{hint}</p>}
    </div>
  );

  const bandColor = result.band === "Complex" ? "text-accent" : result.band === "Moderate" ? "text-blue-soft" : "text-paper";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form className="space-y-8 rounded-md border border-ink/12 bg-white p-7 lg:col-span-6" onSubmit={(e) => e.preventDefault()} aria-label="Requirement details">
        {num("lineItems", "Product line items", 1, 300, "Distinct products / sizes in the requirement")}
        {num("categories", "Product categories", 1, 12)}
        {num("suppliers", "Suppliers involved today", 1, 30, "How many vendors you would otherwise deal with")}
        {num("consignments", "Deliveries or consignments", 1, 12)}

        <fieldset>
          <legend className="text-sm font-medium">Are specifications complete?</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SPECS.map((s) => (
              <label key={s.v} className={`cursor-pointer rounded-full border px-3 py-2 text-center text-sm transition-colors ${input.specs === s.v ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"}`}>
                <input type="radio" name="specs" value={s.v} checked={input.specs === s.v} onChange={() => set("specs", s.v)} className="sr-only" />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">What does the requirement include?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {MIX.map((m) => {
              const on = input.mix.includes(m.key);
              return (
                <label key={m.key} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${on ? "border-blue bg-blue text-paper" : "border-ink/15 hover:border-ink"}`}>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => set("mix", on ? input.mix.filter((x) => x !== m.key) : [...input.mix, m.key])} />
                  {on && <Check className="size-3.5" aria-hidden />}
                  {m.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Additional needs</legend>
          {(
            [
              ["documentation", "Certificates or inspection documentation"],
              ["packaging", "Special packing or marking"],
              ["exportOrder", "Export consignment"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="mt-2 flex items-center gap-3 text-sm">
              <input type="checkbox" checked={input[k]} onChange={(e) => set(k, e.target.checked)} className="size-4 accent-[var(--color-blue)]" />
              {label}
            </label>
          ))}
        </fieldset>
      </form>

      <div className="lg:col-span-6" aria-live="polite">
        <div className="sticky top-[calc(var(--nav-h)+2rem)] space-y-6">
          <div className="rounded-md bg-ink p-7 text-paper">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-eyebrow text-paper/55">Indicative complexity</p>
                <p className={`t-h2 mt-2 ${bandColor}`}>{result.band}</p>
              </div>
              <p className="t-metric text-6xl">{result.score}<span className="text-2xl text-paper/40">/100</span></p>
            </div>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${result.score}%` }} />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-paper/65">
              {result.breakdown.map((b) => (
                <div key={b.label} className="flex justify-between gap-2"><dt>{b.label}</dt><dd className="font-mono text-paper">{b.points}/{b.max}</dd></div>
              ))}
            </dl>
            <p className="mt-6 flex gap-2 text-xs text-paper/50"><Info className="size-3.5 shrink-0" aria-hidden /> An internal planning aid, not a certified procurement assessment. It does not estimate prices, savings or lead times.</p>
          </div>

          <div className="rounded-md border border-ink/12 bg-white p-7">
            <p className="t-eyebrow text-blue">Recommended path</p>
            <p className="t-h3 mt-2">{result.path.title}</p>
            <p className="mt-2 text-graphite">{result.path.detail}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Information to confirm</p>
                <ul className="mt-2 space-y-1.5 text-sm text-graphite">{result.missing.map((m) => <li key={m} className="flex gap-2"><span aria-hidden>—</span>{m}</li>)}</ul>
              </div>
              <div>
                <p className="text-sm font-medium">Documents to prepare</p>
                <ul className="mt-2 space-y-1.5 text-sm text-graphite">{result.documents.map((m) => <li key={m} className="flex gap-2"><span aria-hidden>—</span>{m}</li>)}</ul>
              </div>
            </div>
            {result.categories.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium">Relevant categories</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {result.categories.map((s) => {
                    const c = categoryBySlug(s);
                    return c ? <li key={s}><Link href={`/products/${s}`} className="inline-block rounded-full border border-ink/15 px-3 py-1 text-sm hover:border-ink">{c.shortName}</Link></li> : null;
                  })}
                </ul>
              </div>
            )}
            <Link href={`/request-quote?source=planner-${result.band.toLowerCase()}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-fill px-6 py-3.5 font-semibold text-white hover:bg-ink hover:text-paper">
              Submit the requirement <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

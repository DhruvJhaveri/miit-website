"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { categories, supplyModeLabel } from "@/content/categories";
import { industryBySlug } from "@/content/industries";
import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

const FEATURED = [
  "cutting-grinding",
  "pipes-valves-fittings",
  "metals-structural-materials",
  "bearings-mechanical",
  "fasteners-hardware",
  "engineering-hand-tools",
  "safety-maintenance",
  "pneumatics-instrumentation",
];

/** Part 8 — interactive product explorer (ARIA tabs, arrow-key navigation). */
export function ProductExplorer() {
  const items = FEATURED.map((s) => categories.find((c) => c.slug === s)!);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const cat = items[active];

  const select = (i: number, focus = false) => {
    const next = (i + items.length) % items.length;
    setActive(next);
    track("category_view", { category: items[next].slug, location: "explorer" });
    if (focus) tabs.current[next]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: items.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  return (
    <section className="bg-paper py-28 md:py-36" aria-labelledby={`${id}-title`}>
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-reveal className="t-eyebrow mb-5 flex items-center gap-3 text-blue">
              <span className="inline-block h-px w-8 bg-current" aria-hidden /> Product explorer
            </p>
            <h2 id={`${id}-title`} data-reveal className="t-h2 max-w-[18ch]">Find the family your requirement belongs to.</h2>
          </div>
          <p data-reveal className="max-w-sm text-graphite">Select a family to see typical applications, the industries that use it and what to specify in an enquiry.</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div role="tablist" aria-orientation="vertical" aria-label="Product families" onKeyDown={onKey} className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {items.map((c, i) => (
              <button
                key={c.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                className={`group flex shrink-0 items-center gap-4 rounded-full border px-4 py-2.5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-5 ${
                  i === active ? "border-ink bg-ink text-paper lg:border-ink/15 lg:bg-transparent lg:text-ink" : "border-ink/15 text-graphite hover:text-ink"
                }`}
              >
                <span className={`t-eyebrow hidden lg:inline ${i === active ? "text-brand" : ""}`}>{c.code}</span>
                <span className={`whitespace-nowrap lg:t-h3 lg:whitespace-normal ${i === active ? "lg:translate-x-2" : ""} transition-transform duration-500`}>{c.shortName}</span>
                <span className={`ml-auto hidden h-px bg-ink transition-all duration-500 lg:block ${i === active ? "w-10" : "w-0"}`} aria-hidden />
              </button>
            ))}
          </div>

          <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="grid gap-8 md:grid-cols-2 lg:col-span-8" aria-live="polite">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink md:aspect-auto md:min-h-[34rem]">
              {items.map((c, i) => (
                <Image
                  key={c.slug}
                  src={c.image}
                  alt={i === active ? c.imageAlt : ""}
                  fill
                  sizes="(min-width:1024px) 32vw, (min-width:768px) 50vw, 100vw"
                  className={`object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)] ${i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
                />
              ))}
              <p className="t-eyebrow absolute bottom-4 left-4 rounded-full bg-ink/60 px-3 py-1 text-paper/80 backdrop-blur">Illustrative footage</p>
            </div>

            <div key={cat.slug} className="flex flex-col animate-[hero-in_0.7s_var(--ease-out-expo)_both]">
              <p className="t-eyebrow text-brand">{cat.code} — {cat.shortName}</p>
              <h3 className="t-h3 mt-3">{cat.name}</h3>
              <p className="mt-4 text-graphite">{cat.description}</p>

              <dl className="mt-8 space-y-6 text-[0.95rem]">
                <div>
                  <dt className="t-eyebrow text-graphite">Common applications</dt>
                  <dd className="mt-2">
                    <ul className="flex flex-wrap gap-2">
                      {cat.applications.map((a) => (
                        <li key={a} className="rounded-full border border-ink/15 px-3 py-1 text-sm">{a}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="t-eyebrow text-graphite">Industries</dt>
                  <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {cat.industries.map((s) => {
                      const ind = industryBySlug(s);
                      return ind ? (
                        <Link key={s} href={`/industries/${s}`} className="link-underline text-sm">{ind.name}</Link>
                      ) : null;
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="t-eyebrow text-graphite">Product families</dt>
                  <dd className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    {cat.families.map((f) => (
                      <Link key={f.slug} href={`/products/${cat.slug}/${f.slug}`} className="group inline-flex items-center gap-1 text-sm hover:text-blue">
                        {f.name} <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                      </Link>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="t-eyebrow text-graphite">Availability</dt>
                  <dd className="mt-2 text-sm text-graphite">{cat.supplyModes.map((m) => supplyModeLabel[m]).join(" · ")}. Confirmed per enquiry.</dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                <ButtonLink href={`/request-quote?category=${cat.slug}&source=explorer`} variant="ink">Quote for {cat.shortName}</ButtonLink>
                <ButtonLink href={`/products/${cat.slug}`} variant="ghost-light" arrow={false}>View category</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

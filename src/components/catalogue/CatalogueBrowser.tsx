"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, supplyModeLabel } from "@/content/categories";
import type { SupplyMode } from "@/content/types";
import { buildIndex, search, SUGGESTIONS } from "@/lib/search";
import { track } from "@/lib/analytics";
import { useQueryParams } from "@/lib/use-query-params";

type Sort = "category" | "az";

const index = buildIndex();
const allProducts = categories.flatMap((c) => c.families.map((f) => ({ c, f })));

/** Searchable, filterable catalogue. State mirrors to the URL (?q=&cat=&mode=) without reloads. */
export function CatalogueBrowser() {
  const [params, update] = useQueryParams();
  const [sort, setSort] = useState<Sort>("category");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The URL (?q=&cat=&mode=) is the single source of truth for search and filters.
  const q = params.get("q") ?? "";
  const cats = useMemo(() => params.getAll("cat").filter((s) => categories.some((c) => c.slug === s)), [params]);
  const modes = useMemo(() => params.getAll("mode").filter((m): m is SupplyMode => m in supplyModeLabel), [params]);
  const setQ = (v: string) => update((p) => (v ? p.set("q", v) : p.delete("q")));
  const setList = (key: "cat" | "mode", values: string[]) =>
    update((p) => {
      p.delete(key);
      values.forEach((v) => p.append(key, v));
    });
  const setCats = (v: string[]) => setList("cat", v);
  const setModes = (v: SupplyMode[]) => setList("mode", v);

  useEffect(() => {
    if (q.length <= 2) return;
    const t = setTimeout(() => track("product_search", { length: q.length }), 800);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    let list = allProducts;
    if (q.trim()) {
      const hits = new Set(search(index, q, ["product"]).map((e) => e.href));
      list = list.filter(({ c, f }) => hits.has(`/products/${c.slug}/${f.slug}`));
    }
    if (cats.length) list = list.filter(({ c }) => cats.includes(c.slug));
    if (modes.length) list = list.filter(({ c }) => c.supplyModes.some((m) => modes.includes(m)));
    if (sort === "az") list = [...list].sort((a, b) => a.f.name.localeCompare(b.f.name));
    return list;
  }, [q, cats, modes, sort]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const clear = () =>
    update((p) => {
      p.delete("q");
      p.delete("cat");
      p.delete("mode");
    });
  const activeCount = cats.length + modes.length;

  const filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="t-eyebrow text-graphite">Category</legend>
        <ul className="mt-3 space-y-1">
          {categories.map((c) => (
            <li key={c.slug}>
              <label className="flex cursor-pointer items-center gap-3 rounded py-1.5 text-[0.95rem]">
                <input type="checkbox" className="size-4 accent-[var(--color-blue)]" checked={cats.includes(c.slug)} onChange={() => setCats(toggle(cats, c.slug))} />
                <span className="flex-1">{c.shortName}</span>
                <span className="text-xs text-graphite">{c.families.length}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="t-eyebrow text-graphite">Supply</legend>
        <ul className="mt-3 space-y-1">
          {(Object.keys(supplyModeLabel) as SupplyMode[]).map((m) => (
            <li key={m}>
              <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[0.95rem]">
                <input type="checkbox" className="size-4 accent-[var(--color-blue)]" checked={modes.includes(m)} onChange={() => setModes(toggle(modes, m))} />
                {supplyModeLabel[m]}
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-graphite">Availability is confirmed for every enquiry.</p>
      </fieldset>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-[calc(var(--nav-h)+2rem)]">{filters}</div>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-graphite" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products — e.g. flange, grinding wheel, TMT"
              className="w-full rounded-full border border-ink/15 bg-white py-4 pl-12 pr-4 text-[0.95rem] outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm lg:hidden" aria-haspopup="dialog">
              <SlidersHorizontal className="size-4" aria-hidden /> Filters{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 rounded-full border border-ink/15 px-4 text-sm">
              <span className="text-graphite">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent py-3 outline-none">
                <option value="category">By category</option>
                <option value="az">A–Z</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
          <span className="text-graphite">{results.length} product famil{results.length === 1 ? "y" : "ies"}</span>
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCats(toggle(cats, c))} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-paper">
              {categories.find((x) => x.slug === c)?.shortName} <X className="size-3" aria-hidden /><span className="sr-only">Remove filter</span>
            </button>
          ))}
          {modes.map((m) => (
            <button key={m} type="button" onClick={() => setModes(toggle(modes, m))} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-paper">
              {supplyModeLabel[m]} <X className="size-3" aria-hidden /><span className="sr-only">Remove filter</span>
            </button>
          ))}
          {(activeCount > 0 || q) && <button type="button" onClick={clear} className="text-blue underline">Clear all</button>}
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-md border border-ink/12 bg-white p-10">
            <p className="t-h3">No product families match “{q}”.</p>
            <p className="mt-3 max-w-[56ch] text-graphite">MIIT sources many items not listed individually. Try a broader term, or send the requirement directly — the team will confirm whether it can be sourced.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => update((p) => { p.set("q", s); p.delete("cat"); p.delete("mode"); })} className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-ink">{s}</button>
              ))}
            </div>
            <Link href={`/request-quote?source=catalogue-empty`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold">
              Request it anyway <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ c, f }) => (
              <li key={`${c.slug}/${f.slug}`}>
                <Link href={`/products/${c.slug}/${f.slug}`} className="group flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-white transition-shadow hover:shadow-[0_24px_60px_-36px_rgba(12,15,18,0.5)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    <Image src={f.image ?? c.image} alt="" fill sizes="(min-width:1280px) 25vw, (min-width:640px) 45vw, 100vw" className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                    <span className="t-eyebrow absolute left-3 top-3 rounded-full bg-ink/65 px-2.5 py-1 text-[0.62rem] text-paper/85 backdrop-blur">{c.shortName}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-blue">{f.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-graphite">{f.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue">View & enquire <ArrowUpRight className="size-3.5" aria-hidden /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-2xl bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="t-h3">Filters</p>
              <button type="button" onClick={() => setFiltersOpen(false)} className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15">
                <X className="size-4" aria-hidden /><span className="sr-only">Close</span>
              </button>
            </div>
            {filters}
            <button type="button" onClick={() => setFiltersOpen(false)} className="mt-8 w-full rounded-full bg-ink py-4 font-semibold text-paper">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}

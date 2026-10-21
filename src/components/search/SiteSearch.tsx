"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Search } from "lucide-react";
import { buildIndex, search, SUGGESTIONS } from "@/lib/search";
import { useQueryParams } from "@/lib/use-query-params";

const index = buildIndex();
const LABEL = { product: "Product", category: "Category", industry: "Industry", article: "Guide" } as const;

export function SiteSearch() {
  const [params, update] = useQueryParams();
  const q = params.get("q") ?? "";
  const setQ = (v: string) => update((p) => (v ? p.set("q", v) : p.delete("q")));
  const results = useMemo(() => search(index, q), [q]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search the site</span>
        <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-graphite" aria-hidden />
        <input autoFocus type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, industries and guides" className="w-full rounded-full border border-ink/15 bg-white py-5 pl-14 pr-5 text-lg outline-none focus:border-blue focus:ring-2 focus:ring-blue/20" />
      </label>
      <p className="mt-4 text-sm text-graphite" aria-live="polite">{q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Try a product, material or industry."}</p>
      {q && results.length === 0 && (
        <div className="mt-6">
          <p>No results for “{q}”. Suggestions:</p>
          <div className="mt-3 flex flex-wrap gap-2">{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-ink/15 px-4 py-2 text-sm">{s}</button>)}</div>
          <p className="mt-6 text-graphite">Not listed? <Link href="/request-quote?source=search-empty" className="text-blue underline">Send the requirement anyway</Link> — MIIT will confirm whether it can be sourced.</p>
        </div>
      )}
      <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {results.slice(0, 40).map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="flex flex-col gap-1 py-5 hover:text-blue sm:flex-row sm:items-baseline sm:gap-6">
              <span className="t-eyebrow w-24 shrink-0 text-graphite">{LABEL[r.kind]}</span>
              <span>
                <span className="block text-lg font-medium">{r.title}</span>
                <span className="block text-sm text-graphite">{r.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

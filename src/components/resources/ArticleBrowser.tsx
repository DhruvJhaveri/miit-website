"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { Article } from "@/content/types";
import { topics } from "@/content/topics";

export function ArticleBrowser({ items, initialTopic = "All" }: { items: Article[]; initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic);
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((a) => (topic === "All" || a.topic === topic) && (!needle || `${a.title} ${a.excerpt}`.toLowerCase().includes(needle)));
  }, [items, topic, q]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0" role="group" aria-label="Filter by topic">
          {["All", ...topics.map((t) => t.name)].map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${topic === t ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"}`}>
              {t}
            </button>
          ))}
        </div>
        <label className="relative lg:w-80">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-graphite" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides" className="w-full rounded-full border border-ink/15 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue" />
        </label>
      </div>
      <p className="mt-6 text-sm text-graphite" aria-live="polite">{shown.length} guide{shown.length === 1 ? "" : "s"}</p>
      {shown.length === 0 ? (
        <p className="mt-6 rounded-md border border-ink/12 bg-white p-8 text-graphite">No guides match. Try another topic or a shorter search term.</p>
      ) : (
        <ul className="mt-6 grid gap-px overflow-hidden rounded-md bg-ink/10 md:grid-cols-2">
          {shown.map((a) => (
            <li key={a.slug} className="bg-paper">
              <Link href={`/resources/${a.slug}`} className="group flex h-full flex-col p-8 transition-colors hover:bg-white">
                <p className="t-eyebrow text-blue">{a.topic} · {a.readingMinutes} min read</p>
                <h2 className="t-h3 mt-4 group-hover:text-blue">{a.title}</h2>
                <p className="mt-3 flex-1 text-graphite">{a.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium">Read <ArrowUpRight className="size-4" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

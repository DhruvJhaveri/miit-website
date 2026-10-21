"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faqGroups, faqs } from "@/content/faqs";
import type { Faq } from "@/content/types";

/** Categorised FAQ with filter chips and accessible disclosure buttons. */
export function FaqList({ items = faqs, showFilters = true }: { items?: Faq[]; showFilters?: boolean }) {
  const [group, setGroup] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(null);
  const id = useId();
  const groups = ["All", ...faqGroups.filter((g) => items.some((f) => f.group === g))];
  const shown = group === "All" ? items : items.filter((f) => f.group === group);

  return (
    <div>
      {showFilters && (
        <div className="no-scrollbar -mx-[var(--gutter)] mb-8 flex gap-2 overflow-x-auto px-[var(--gutter)]" role="group" aria-label="Filter questions by topic">
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${group === g ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"}`}
            >
              {g}
            </button>
          ))}
        </div>
      )}
      <ul className="border-b border-ink/12">
        {shown.map((f, i) => {
          const key = `${f.group}-${i}`;
          const expanded = open === f.q;
          return (
            <li key={key} className="border-t border-ink/12">
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${id}-${key}`}
                  onClick={() => setOpen(expanded ? null : f.q)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[1.08rem] font-medium">{f.q}</span>
                  <Plus className={`mt-1 size-5 shrink-0 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`} aria-hidden />
                </button>
              </h3>
              <div id={`${id}-${key}`} className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden" inert={!expanded}>
                  <p className="max-w-[68ch] pb-6 text-graphite">{f.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

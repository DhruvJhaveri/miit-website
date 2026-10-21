"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/content/industries";

/** Industries served: an editorial index with a hover/focus image preview on desktop. */
export function IndustriesList() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-ink py-28 text-paper md:py-36" aria-labelledby="industries-title">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <p data-reveal className="t-eyebrow mb-5 flex items-center gap-3 text-accent">
              <span className="inline-block h-px w-8 bg-current" aria-hidden /> Industries served
            </p>
            <h2 id="industries-title" data-reveal className="t-h2 max-w-[14ch]">Built around how each sector buys.</h2>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-sm bg-ink-3 lg:block">
              {industries.map((ind, i) => (
                <Image
                  key={ind.slug}
                  src={ind.image}
                  alt=""
                  fill
                  sizes="40vw"
                  className={`object-cover transition-[opacity,transform] duration-700 ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
                <p className="text-sm text-paper/80">{industries[active].short}</p>
              </div>
            </div>
          </div>
        </div>
        <ul className="lg:col-span-7">
          {industries.map((ind, i) => (
            <li key={ind.slug} data-reveal style={{ "--reveal-i": i % 4 } as React.CSSProperties}>
              <Link
                href={`/industries/${ind.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-t border-white/10 py-6 transition-colors hover:text-accent"
              >
                <span className="t-eyebrow text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t-h3 block transition-transform duration-500 group-hover:translate-x-2">{ind.name}</span>
                  <span className="mt-1 block text-sm text-paper/55 lg:hidden">{ind.short}</span>
                </span>
                <ArrowUpRight className="size-5 opacity-40 transition-opacity group-hover:opacity-100" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

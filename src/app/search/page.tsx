import type { Metadata } from "next";
import { SiteSearch } from "@/components/search/SiteSearch";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default function SearchPage() {
  return (
    <section className="min-h-[80svh] bg-paper pb-24 pt-[calc(var(--nav-h)+4rem)]">
      <div className="absolute inset-x-0 top-0 h-[var(--nav-h)] bg-ink" aria-hidden />
      <div className="shell max-w-4xl">
        <h1 className="t-h2 mb-10">Search</h1>
        <SiteSearch />
      </div>
    </section>
  );
}

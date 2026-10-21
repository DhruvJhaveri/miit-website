import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { topics } from "@/content/topics";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleBrowser } from "@/components/resources/ArticleBrowser";

export const metadata: Metadata = {
  title: "Resources — Industrial Buyer Guides",
  description: "Practical guides on industrial RFQs, specifications, multi-category procurement, BOM preparation and project supply.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Resources" }]} eyebrow="Resources" title="Guides for industrial buyers." lead="Practical advice on preparing requirements, getting specifications right and coordinating multi-category and project procurement." image="/media/stills/ed-lathe.jpg" />
      <section className="bg-paper py-20">
        <div className="shell">
          <nav aria-label="Topics" className="mb-12 grid gap-px overflow-hidden rounded-md bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((t) => (
              <Link key={t.slug} href={`/resources/topics/${t.slug}`} className="bg-paper-2 p-6 transition-colors hover:bg-white">
                <span className="t-eyebrow text-graphite">Topic</span>
                <span className="mt-2 block font-display text-lg font-semibold">{t.name}</span>
                <span className="mt-1 block text-sm text-graphite">{articles.filter((a) => a.topic === t.name).length} guides</span>
              </Link>
            ))}
          </nav>
          <ArticleBrowser items={articles} />
        </div>
      </section>
    </>
  );
}

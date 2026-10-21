import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { topicBySlug, topics } from "@/content/topics";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleBrowser } from "@/components/resources/ArticleBrowser";

// Fully static content: unknown params resolve before streaming, so notFound() returns a real 404.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/topics/[topic]">): Promise<Metadata> {
  const { topic } = await params;
  const t = topicBySlug(topic);
  return t ? { title: `${t.name} — Guides`, description: `MIIT CORPORATION buyer guides on ${t.name.toLowerCase()}.`, alternates: { canonical: `/resources/topics/${t.slug}` } } : {};
}

export default async function TopicPage({ params }: PageProps<"/resources/topics/[topic]">) {
  const { topic } = await params;
  const t = topicBySlug(topic);
  if (!t) notFound();
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Resources", href: "/resources" }, { label: t.name }]} eyebrow="Topic" title={t.name} image="/media/stills/ed-gears.jpg" />
      <section className="bg-paper py-20">
        <div className="shell">
          <ArticleBrowser items={articles} initialTopic={t.name} />
        </div>
      </section>
    </>
  );
}

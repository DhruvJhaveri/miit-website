import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { articleBySlug, articles } from "@/content/articles";
import { categoryBySlug } from "@/content/categories";
import { topicSlug } from "@/content/topics";
import { company, siteUrl } from "@/content/company";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";

// Fully static content: unknown params resolve before streaming, so notFound() returns a real 404.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return a ? { title: a.title, description: a.excerpt, alternates: { canonical: `/resources/${a.slug}` }, openGraph: { type: "article" } } : {};
}

export default async function ArticlePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const related = articles.filter((x) => x.slug !== a.slug && (x.topic === a.topic || x.relatedCategories.some((c) => a.relatedCategories.includes(c)))).slice(0, 3);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    publisher: { "@type": "Organization", name: company.name },
    mainEntityOfPage: `${siteUrl}/resources/${a.slug}`,
  };

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: "Resources", href: "/resources" }, { label: a.topic, href: `/resources/topics/${topicSlug(a.topic)}` }, { label: a.title }]}
        eyebrow={`${a.topic} · ${a.readingMinutes} min read`}
        title={a.title}
        lead={a.excerpt}
        image="/media/stills/ed-gears.jpg"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="bg-paper py-20">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="max-w-[68ch] text-[1.1rem] leading-[1.75] lg:col-span-7 lg:col-start-2">
            {a.body.map((b, i) => {
              if (b.type === "h2") return <h2 key={i} className="t-h3 mb-4 mt-12">{b.text}</h2>;
              if (b.type === "list")
                return (
                  <ul key={i} className="my-6 space-y-2 border-l-2 border-accent pl-6">
                    {b.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                );
              if (b.type === "callout") return <p key={i} className="my-10 rounded-md bg-ink p-7 text-paper">{b.text}</p>;
              return <p key={i} className="mt-5 text-ink/85">{b.text}</p>;
            })}
          </div>
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="sticky top-[calc(var(--nav-h)+2rem)] space-y-8">
              <div className="rounded-md bg-ink p-6 text-paper">
                <p className="t-h3">Ready to send a requirement?</p>
                <p className="mt-2 text-sm text-paper/70">Add each line with its specification, or upload your BOM.</p>
                <ButtonLink href={`/request-quote?source=article-${a.slug}`} className="mt-5 w-full">Request a Quote</ButtonLink>
              </div>
              <div>
                <p className="t-eyebrow text-graphite">Related products</p>
                <ul className="mt-3 space-y-2">
                  {a.relatedCategories.map((s) => {
                    const c = categoryBySlug(s);
                    return c ? <li key={s}><Link href={`/products/${s}`} className="link-underline">{c.name}</Link></li> : null;
                  })}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-paper-2 py-20" aria-labelledby="related-articles">
          <div className="shell">
            <h2 id="related-articles" className="t-h3">Related guides</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/resources/${r.slug}`} className="group flex h-full flex-col rounded-md bg-white p-6">
                    <span className="t-eyebrow text-blue">{r.topic}</span>
                    <span className="mt-3 font-display text-lg font-semibold group-hover:text-blue">{r.title}</span>
                    <ArrowUpRight className="mt-auto size-4 pt-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

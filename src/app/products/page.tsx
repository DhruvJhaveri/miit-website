import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/content/categories";
import { PageHero } from "@/components/layout/PageHero";
import { CatalogueBrowser } from "@/components/catalogue/CatalogueBrowser";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Product Catalogue — Industrial Engineering Supplies",
  description:
    "Browse MIIT CORPORATION's industrial catalogue: structural steel, pipes, valves and fittings, cutting and grinding, tools, fasteners, bearings, pneumatics, instruments, safety and aluminium.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Products" }]}
        eyebrow="Product catalogue"
        title="Engineering supplies across nine product families."
        lead="Search by product, filter by family, and send a requirement for any item — listed or not. Availability and specifications are confirmed for every enquiry."
        image="/media/stills/ed-gears.jpg"
      >
        <ButtonLink href="/request-quote?source=catalogue">Request a Quote</ButtonLink>
      </PageHero>

      <section className="bg-paper py-20" aria-label="Product families">
        <div className="shell">
          <ul className="no-scrollbar -mx-[var(--gutter)] flex gap-3 overflow-x-auto px-[var(--gutter)] pb-2">
            {categories.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link href={`/products/${c.slug}`} className="group relative flex h-36 w-56 items-end overflow-hidden rounded-md bg-ink p-4 text-paper">
                  <Image src={c.image} alt="" fill sizes="224px" className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
                  <span className="relative">
                    <span className="t-eyebrow block text-accent">{c.code}</span>
                    <span className="mt-1 block font-medium leading-tight">{c.shortName}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper pb-28" aria-label="Search and filter the catalogue">
        <div className="shell">
          <CatalogueBrowser />
        </div>
      </section>
    </>
  );
}

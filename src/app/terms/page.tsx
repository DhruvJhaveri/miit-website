import type { Metadata } from "next";
import { company } from "@/content/company";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Terms and conditions", alternates: { canonical: "/terms" } };

/** DRAFT — must be reviewed by MIIT and its legal adviser before launch. */
export default function TermsPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Terms" }]} title="Terms and conditions" lead="Draft for review — to be approved by MIIT CORPORATION before publication." />
      <section className="bg-paper py-20">
        <div className="shell max-w-3xl space-y-8 text-[1.05rem] leading-relaxed text-ink/85">
          <div><h2 className="t-h3 mb-3">Website information</h2><p>Product information on this website is general and for guidance. It is not an offer to sell. Specifications, availability, brands, prices and delivery are confirmed only in a written quotation from {company.name}.</p></div>
          <div><h2 className="t-h3 mb-3">Quotation requests</h2><p>Submitting a request does not create a contract. Orders are subject to the terms stated in the quotation and any agreed order confirmation.</p></div>
          <div><h2 className="t-h3 mb-3">Imagery</h2><p>Photographs and footage are illustrative and licensed from third parties. They do not depict specific products supplied by {company.name}.</p></div>
          <div><h2 className="t-h3 mb-3">Trademarks</h2><p>Brand names referred to on this website belong to their respective owners. Their mention does not imply an authorised dealership, distributorship or endorsement.</p></div>
          <div><h2 className="t-h3 mb-3">Contact</h2><p>{company.email} · {company.phones.map((p) => p.display).join(" / ")}</p></div>
        </div>
      </section>
    </>
  );
}

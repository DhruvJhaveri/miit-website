import type { Metadata } from "next";
import { company } from "@/content/company";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Privacy notice", alternates: { canonical: "/privacy" } };

/** DRAFT — must be reviewed by MIIT and its legal adviser before launch (see docs/LAUNCH-CHECKLIST.md). */
export default function PrivacyPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Privacy" }]} title="Privacy notice" lead="Draft for review — to be approved by MIIT CORPORATION before publication." />
      <section className="bg-paper py-20">
        <div className="shell max-w-3xl space-y-8 text-[1.05rem] leading-relaxed text-ink/85">
          <div><h2 className="t-h3 mb-3">Who we are</h2><p>{company.name}, {company.address.line1}, {company.address.city} {company.address.postalCode}, {company.address.region}, {company.address.country}. Contact: {company.email}.</p></div>
          <div><h2 className="t-h3 mb-3">What we collect</h2><p>When you submit a quotation request or message, we collect the details you provide: name, company, email, phone, role, product requirements, delivery details and any documents you attach. We also receive basic technical data (such as IP address) needed to operate and protect the website.</p></div>
          <div><h2 className="t-h3 mb-3">How we use it</h2><p>To review and respond to your request, prepare quotations, communicate with you about your requirement, and protect the website against spam and abuse. We do not sell your information.</p></div>
          <div><h2 className="t-h3 mb-3">Analytics</h2><p>If analytics is enabled, it runs only after you give consent. Analytics events do not include your contact details or the contents of your requirements.</p></div>
          <div><h2 className="t-h3 mb-3">Sharing</h2><p>Requirement details may be shared with suppliers only to the extent needed to source the items you request. Service providers that host the website or deliver email process data on our behalf.</p></div>
          <div><h2 className="t-h3 mb-3">Retention</h2><p>Submissions and attachments are kept only as long as needed to respond and for legitimate business records, then deleted. [Retention period to be confirmed by MIIT.]</p></div>
          <div><h2 className="t-h3 mb-3">Your choices</h2><p>You can ask us to access, correct or delete your information by emailing {company.email}. You can withdraw analytics consent by clearing this site&apos;s data in your browser.</p></div>
        </div>
      </section>
    </>
  );
}

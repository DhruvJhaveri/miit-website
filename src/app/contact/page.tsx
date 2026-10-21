import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company, whatsappLink } from "@/content/company";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact MIIT CORPORATION",
  description: "Contact MIIT CORPORATION, 96 Narayan Dhru Street, Mumbai 400003. Phone +91 98202 93202 / +91 98693 14101, email miitcorporation@gmail.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const wa = whatsappLink("Hello MIIT CORPORATION, I have an enquiry.");
  const mapQuery = encodeURIComponent(`${company.address.line1}, ${company.address.city} ${company.address.postalCode}`);
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Contact" }]} eyebrow="Contact" title="Talk to the team." lead="For quotations, use the RFQ form — it captures every line item and document. For anything else, send a message or call." image="/media/stills/ed-port-night.jpg">
        <ButtonLink href="/request-quote?source=contact">Request a Quote</ButtonLink>
      </PageHero>
      <section className="bg-paper py-24">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <aside className="space-y-8 lg:col-span-4">
            <div className="flex gap-4">
              <Phone className="mt-1 size-5 text-blue" aria-hidden />
              <div>
                <p className="t-eyebrow text-graphite">Phone</p>
                {company.phones.map((p) => <a key={p.tel} href={`tel:${p.tel}`} className="link-underline block text-lg font-medium">{p.display}</a>)}
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-1 size-5 text-blue" aria-hidden />
              <div>
                <p className="t-eyebrow text-graphite">Email</p>
                <a href={`mailto:${company.email}`} className="link-underline text-lg font-medium">{company.email}</a>
              </div>
            </div>
            {wa && (
              <div className="flex gap-4">
                <MessageCircle className="mt-1 size-5 text-blue" aria-hidden />
                <div>
                  <p className="t-eyebrow text-graphite">WhatsApp</p>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline text-lg font-medium">Message us</a>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 text-blue" aria-hidden />
              <div>
                <p className="t-eyebrow text-graphite">Address</p>
                <address className="text-lg not-italic">
                  {company.address.line1}
                  <br />
                  {company.address.city} {company.address.postalCode}, {company.address.region}, {company.address.country}
                </address>
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-blue underline">Open in Google Maps ↗</a>
              </div>
            </div>
          </aside>
          <div className="rounded-lg bg-white p-6 shadow-[0_40px_100px_-60px_rgba(12,15,18,0.45)] sm:p-10 lg:col-span-7 lg:col-start-6">
            <h2 className="t-h3 mb-8">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

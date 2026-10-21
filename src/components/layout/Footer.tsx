import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company } from "@/content/company";
import { categories } from "@/content/categories";
import { industries } from "@/content/industries";
import { Wordmark } from "./Wordmark";

async function copyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await copyrightYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="shell pt-24">
        <div data-reveal className="grid gap-10 border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="t-eyebrow text-accent">Start a requirement</p>
            <p className="t-h1 mt-4 max-w-[18ch]">Send us the list. We’ll coordinate the rest.</p>
          </div>
          <div className="flex flex-col justify-end gap-3 lg:col-span-5 lg:items-end">
            <Link href="/request-quote?source=footer" className="group inline-flex items-center gap-2 rounded-full bg-accent-fill px-7 py-4 font-semibold text-white transition-colors hover:bg-paper">
              Request a Quote
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <a href={`mailto:${company.email}`} className="link-underline text-paper/70">{company.email}</a>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark className="text-paper" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">
              Industrial engineering supplies, procurement and project supply from Mumbai. Formerly {company.formerName}, serving industry since the {company.originsLabel.toLowerCase()}.
            </p>
          </div>
          <FooterCol title="Products" links={categories.map((c) => ({ href: `/products/${c.slug}`, label: c.shortName }))} className="lg:col-span-3" />
          <FooterCol title="Industries" links={industries.slice(0, 8).map((i) => ({ href: `/industries/${i.slug}`, label: i.name }))} className="lg:col-span-2" />
          <div className="lg:col-span-3">
            <p className="t-eyebrow text-paper/45">Reach us</p>
            <address className="mt-4 space-y-3 text-sm not-italic text-paper/75">
              <p>
                {company.address.line1}
                <br />
                {company.address.city} {company.address.postalCode}, {company.address.region}, {company.address.country}
              </p>
              <p className="flex flex-col">
                {company.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="link-underline w-fit">{p.display}</a>
                ))}
              </p>
              <p><a href={`mailto:${company.email}`} className="link-underline">{company.email}</a></p>
              <p><a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline">LinkedIn ↗</a></p>
            </address>
            <ul className="mt-6 space-y-2 text-sm text-paper/60">
              {[
                { href: "/about", label: "About" },
                { href: "/procurement", label: "Procurement Solutions" },
                { href: "/case-studies", label: "Case studies" },
                { href: "/resources", label: "Resources" },
                { href: "/faq", label: "FAQs" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="link-underline">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="shell select-none pb-6" aria-hidden>
        <svg data-reveal viewBox="0 0 1000 120" className="block w-full fill-white/[0.06]" role="presentation">
          <text x="0" y="104" textLength="1000" lengthAdjust="spacingAndGlyphs" className="t-metric" style={{ fontSize: 128 }}>
            MIIT CORPORATION
          </text>
        </svg>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="link-underline">Privacy</Link>
            <Link href="/terms" className="link-underline">Terms</Link>
            <Link href="/credits" className="link-underline">Media credits</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, className = "" }: { title: string; links: { href: string; label: string }[]; className?: string }) {
  return (
    <div className={className}>
      <p className="t-eyebrow text-paper/45">{title}</p>
      <ul className="mt-4 space-y-2 text-sm text-paper/75">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="link-underline">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

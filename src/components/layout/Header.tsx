"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { categories } from "@/content/categories";
import { industries } from "@/content/industries";
import { Wordmark } from "./Wordmark";
import { track } from "@/lib/analytics";

type PanelKey = "products" | "industries" | "resources" | null;

const resources = [
  { href: "/resources", label: "Buyer guides", note: "RFQs, specifications and planning" },
  { href: "/case-studies", label: "Case studies", note: "Published procurement examples" },
  { href: "/procurement#planner", label: "Requirement planner", note: "Structure a complex requirement" },
  { href: "/faq", label: "FAQs", note: "Products, process and delivery" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preview, setPreview] = useState(categories[0].slug);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close everything on navigation (state adjusted during render, not in an effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setPanel(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const open = (k: PanelKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPanel(k);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setPanel(null), 160);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || panel !== null;
  const previewCat = categories.find((c) => c.slug === preview) ?? categories[0];

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 text-paper transition-[background-color,backdrop-filter,border-color] duration-500 ${
        solid ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent"
      }`}
    >
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 shrink-0" aria-label="MIIT CORPORATION home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.92rem]">
            <NavTrigger label="Products" panelKey="products" panel={panel} active={isActive("/products")} onOpen={open} onClose={scheduleClose} />
            <NavTrigger label="Industries" panelKey="industries" panel={panel} active={isActive("/industries")} onOpen={open} onClose={scheduleClose} />
            <NavLink href="/procurement" label="Procurement Solutions" active={isActive("/procurement")} />
            <NavLink href="/about" label="About" active={isActive("/about")} />
            <NavTrigger label="Resources" panelKey="resources" panel={panel} active={isActive("/resources") || isActive("/case-studies") || isActive("/faq")} onOpen={open} onClose={scheduleClose} />
            <NavLink href="/contact" label="Contact" active={isActive("/contact")} />
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" className="inline-flex size-11 items-center justify-center rounded-full text-paper/80 transition-colors hover:text-accent" aria-label="Search">
            <Search className="size-[1.15rem]" aria-hidden />
          </Link>
          <Link
            href="/request-quote"
            onClick={() => track("cta_click", { location: "nav" })}
            className="group hidden items-center gap-2 rounded-full bg-accent-fill px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-paper sm:inline-flex"
          >
            Request a Quote
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Desktop panels */}
      <div
        className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-white/10 bg-ink/95 backdrop-blur-xl transition-[opacity,transform] duration-300 lg:block ${
          panel ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        onMouseEnter={() => panel && open(panel)}
        onMouseLeave={scheduleClose}
      >
        {panel === "products" && (
          <div id="panel-products" className="shell grid grid-cols-12 gap-10 py-10">
            <div className="col-span-8">
              <p className="t-eyebrow mb-5 text-paper/50">Product portfolio</p>
              <ul className="grid grid-cols-3 gap-x-8 gap-y-1">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products/${c.slug}`}
                      onMouseEnter={() => setPreview(c.slug)}
                      onFocus={() => setPreview(c.slug)}
                      className="group flex gap-3 rounded-md py-3 pr-2 transition-colors hover:text-accent"
                    >
                      <span className="t-eyebrow pt-1 text-paper/40 group-hover:text-accent">{c.code}</span>
                      <span>
                        <span className="block font-medium leading-snug">{c.shortName}</span>
                        <span className="mt-0.5 block text-[0.8rem] leading-snug text-paper/50">{c.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/products" className="link-underline mt-6 inline-flex items-center gap-2 text-sm text-paper/80">
                Browse the full catalogue <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="col-span-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-3">
                <Image key={previewCat.slug} src={previewCat.image} alt="" fill sizes="30vw" className="object-cover opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="t-eyebrow text-accent">{previewCat.code}</p>
                  <p className="t-h3 mt-1">{previewCat.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {panel === "industries" && (
          <div id="panel-industries" className="shell grid grid-cols-12 gap-10 py-10">
            <div className="col-span-4">
              <p className="t-eyebrow mb-4 text-paper/50">Industries served</p>
              <p className="t-h3 max-w-sm">Procurement support shaped around how each sector buys.</p>
              <Link href="/industries" className="link-underline mt-6 inline-flex items-center gap-2 text-sm text-paper/80">
                All industries <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="col-span-8 grid grid-cols-2 gap-x-10">
              {industries.map((i) => (
                <li key={i.slug} className="border-b border-white/10">
                  <Link href={`/industries/${i.slug}`} className="flex items-center justify-between py-3 transition-colors hover:text-accent">
                    <span>{i.name}</span>
                    <ArrowUpRight className="size-4 opacity-40" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {panel === "resources" && (
          <div id="panel-resources" className="shell grid grid-cols-4 gap-8 py-10">
            {resources.map((r) => (
              <Link key={r.href} href={r.href} className="group border-t border-white/15 pt-5 transition-colors hover:border-accent">
                <span className="t-h3 block group-hover:text-accent">{r.label}</span>
                <span className="mt-2 block text-sm text-paper/55">{r.note}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`relative rounded-full px-3.5 py-2 transition-colors hover:text-accent ${active ? "text-accent" : "text-paper/85"}`}
      >
        {label}
      </Link>
    </li>
  );
}

function NavTrigger({
  label,
  panelKey,
  panel,
  active,
  onOpen,
  onClose,
}: {
  label: string;
  panelKey: Exclude<PanelKey, null>;
  panel: PanelKey;
  active: boolean;
  onOpen: (k: PanelKey) => void;
  onClose: () => void;
}) {
  const expanded = panel === panelKey;
  return (
    <li onMouseEnter={() => onOpen(panelKey)} onMouseLeave={onClose}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`panel-${panelKey}`}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(expanded ? null : panelKey);
        }}
        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 transition-colors hover:text-accent ${active || expanded ? "text-accent" : "text-paper/85"}`}
      >
        {label}
        <ChevronDown className={`size-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
    </li>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [section, setSection] = useState<string | null>(null);
  const id = useId();
  const groups = [
    { key: "products", label: "Products", links: [{ href: "/products", label: "Full catalogue" }, ...categories.map((c) => ({ href: `/products/${c.slug}`, label: c.shortName }))] },
    { key: "industries", label: "Industries", links: [{ href: "/industries", label: "All industries" }, ...industries.map((i) => ({ href: `/industries/${i.slug}`, label: i.name }))] },
    { key: "resources", label: "Resources", links: resources.map((r) => ({ href: r.href, label: r.label })) },
  ];
  return (
    <div
      id="mobile-menu"
      className={`fixed inset-x-0 bottom-0 top-[var(--nav-h)] overflow-y-auto bg-ink transition-[opacity,visibility] duration-300 lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      <nav aria-label="Mobile" className="shell flex min-h-full flex-col py-6">
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {groups.map((g) => (
            <li key={g.key}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-xl"
                aria-expanded={section === g.key}
                aria-controls={`${id}-${g.key}`}
                onClick={() => setSection(section === g.key ? null : g.key)}
              >
                {g.label}
                <ChevronDown className={`size-5 transition-transform ${section === g.key ? "rotate-180" : ""}`} aria-hidden />
              </button>
              <ul id={`${id}-${g.key}`} hidden={section !== g.key} className="pb-4">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={onClose} className="block py-2 pl-3 text-paper/75">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {[
            { href: "/procurement", label: "Procurement Solutions" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={onClose} className="block py-4 text-xl">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/request-quote" onClick={onClose} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent-fill px-6 py-4 font-semibold text-white">
          Request a Quote <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </nav>
    </div>
  );
}

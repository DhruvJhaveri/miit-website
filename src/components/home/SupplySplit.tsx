import Link from "next/link";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { ButtonLink } from "@/components/ui/Button";

const everyday = [
  { label: "Cutting tools & abrasives", href: "/products/cutting-grinding" },
  { label: "Drills, taps & reamers", href: "/products/engineering-hand-tools" },
  { label: "Hand & power tools", href: "/products/engineering-hand-tools/hand-tools" },
  { label: "Nuts, bolts & washers", href: "/products/fasteners-hardware" },
  { label: "Bearings & chain pulleys", href: "/products/bearings-mechanical" },
  { label: "Safety equipment & PPE", href: "/products/safety-maintenance" },
];
const project = [
  { label: "MS, SS & TMT bars", href: "/products/metals-structural-materials" },
  { label: "Beams, channels, angles & plates", href: "/products/metals-structural-materials/beams-channels-angles" },
  { label: "Pipes & pipe fittings", href: "/products/pipes-valves-fittings" },
  { label: "Flanges & valves", href: "/products/pipes-valves-fittings/flanges" },
  { label: "Instruments", href: "/products/pneumatics-instrumentation" },
  { label: "Project bolting", href: "/products/fasteners-hardware/nuts-bolts" },
];

export function SupplySplit() {
  return (
    <section className="bg-ink text-paper" aria-label="Everyday supplies and project procurement">
      <div className="grid lg:grid-cols-2">
        <Panel
          video="product-macro"
          eyebrow="Powering daily operations"
          title="Everyday industrial supplies"
          body="High-performance cutting tools, abrasives, hand tools, safety equipment and workshop essentials — the recurring requirements that keep production, maintenance and machine shops running."
          links={everyday}
          cta={{ href: "/request-quote?source=everyday", label: "Quote everyday supplies" }}
        />
        <Panel
          video="logistics"
          eyebrow="Procurement & supply"
          title="Project procurement & structural materials"
          body="Mild steel, stainless steel and TMT bars; beams, channels, angles and plates; valves, flanges and pipe fittings — procured and coordinated for industrial and infrastructure projects."
          links={project}
          cta={{ href: "/procurement", label: "Project procurement" }}
        />
      </div>
    </section>
  );
}

function Panel({
  video,
  eyebrow,
  title,
  body,
  links,
  cta,
}: {
  video: "product-macro" | "logistics";
  eyebrow: string;
  title: string;
  body: string;
  links: { label: string; href: string }[];
  cta: { href: string; label: string };
}) {
  return (
    <div className="grain relative isolate flex min-h-[44rem] flex-col justify-end overflow-hidden border-white/10 p-[var(--gutter)] py-20 lg:min-h-[52rem] lg:[&:first-child]:border-r">
      <AmbientVideo name={video} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/20" aria-hidden />
      <p data-reveal className="t-eyebrow text-accent">{eyebrow}</p>
      <h2 data-reveal className="t-h2 mt-4 max-w-[16ch]">{title}</h2>
      <p data-reveal className="mt-5 max-w-[48ch] text-paper/75">{body}</p>
      <ul data-reveal className="mt-8 grid grid-cols-1 gap-x-6 border-t border-white/15 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.label} className="border-b border-white/10">
            <Link href={l.href} className="flex items-center justify-between py-3 text-[0.95rem] text-paper/85 transition-colors hover:text-accent">
              {l.label} <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <ButtonLink href={cta.href} variant="ghost-dark">{cta.label}</ButtonLink>
      </div>
    </div>
  );
}

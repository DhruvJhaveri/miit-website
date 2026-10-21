import Image from "next/image";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Dark cinematic page header used by every inner page. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  crumbs,
  children,
  size = "lg",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  size?: "lg" | "md";
}) {
  return (
    <section className={`grain relative isolate overflow-hidden bg-ink text-paper ${size === "lg" ? "min-h-[78svh]" : "min-h-[56svh]"} flex items-end`}>
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="hero-zoom object-cover opacity-70" />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/30" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" aria-hidden />
      <div className="shell w-full pb-16 pt-[calc(var(--nav-h)+4rem)] md:pb-20">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && (
          <p className="hero-in t-eyebrow mt-8 flex items-center gap-3 text-accent">
            <span className="inline-block h-px w-8 bg-current" aria-hidden /> {eyebrow}
          </p>
        )}
        <h1 className="hero-in t-h1 mt-5 max-w-[20ch]" style={{ "--d": "80ms" } as React.CSSProperties}>{title}</h1>
        {lead && (
          <p className="hero-in t-lead mt-6 max-w-[56ch] text-paper/75" style={{ "--d": "180ms" } as React.CSSProperties}>{lead}</p>
        )}
        {children && <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ "--d": "260ms" } as React.CSSProperties}>{children}</div>}
      </div>
    </section>
  );
}

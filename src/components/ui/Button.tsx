import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost-dark" | "ghost-light" | "ink";

const styles: Record<Variant, string> = {
  primary: "bg-accent-fill text-white hover:bg-ink hover:text-paper",
  "ghost-dark": "border border-paper/35 text-paper hover:bg-paper hover:text-ink",
  "ghost-light": "border border-ink/25 text-ink hover:bg-ink hover:text-paper",
  ink: "bg-ink text-paper hover:bg-accent-fill hover:text-white",
};

export function ButtonLink({
  variant = "primary",
  arrow = true,
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link
      {...props}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />}
    </Link>
  );
}

import Image from "next/image";

/**
 * MIIT logo lock-up: the company's monogram (public/brand/miit-mark.png, made
 * transparent from the supplied dark-background logo) beside the name set in type.
 * Replace the PNG with the official vector file when available.
 */
export function Wordmark({ className = "", showName = true }: { className?: string; showName?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 leading-none ${className}`}>
      <Image src="/brand/miit-mark.png" alt="" width={372} height={204} priority className="h-9 w-auto" />
      {showName && (
        <span className="flex flex-col gap-1">
          <span className="font-display text-[1.3rem] font-bold tracking-[-0.03em] [font-stretch:118%]">MIIT</span>
          <span className="t-eyebrow text-[0.56rem] tracking-[0.3em] opacity-70">Corporation</span>
        </span>
      )}
    </span>
  );
}

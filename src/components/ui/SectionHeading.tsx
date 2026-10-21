export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  className = "",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
}) {
  const muted = tone === "dark" ? "text-paper/70" : "text-graphite";
  return (
    <div className={className}>
      {eyebrow && (
        <p data-reveal className={`t-eyebrow mb-5 flex items-center gap-3 ${tone === "dark" ? "text-accent" : "text-blue"}`}>
          <span className="inline-block h-px w-8 bg-current" aria-hidden />
          {eyebrow}
        </p>
      )}
      <Tag data-reveal className={`${Tag === "h1" ? "t-h1" : "t-h2"} max-w-[22ch]`} style={{ "--reveal-i": 1 } as React.CSSProperties}>
        {title}
      </Tag>
      {lead && (
        <p data-reveal className={`t-lead mt-6 max-w-[52ch] ${muted}`} style={{ "--reveal-i": 2 } as React.CSSProperties}>
          {lead}
        </p>
      )}
    </div>
  );
}

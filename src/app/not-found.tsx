import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-paper">
      <Image src="/media/stills/ed-gears.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-35" />
      <div className="shell">
        <p className="t-eyebrow text-accent">Error 404</p>
        <h1 className="t-h1 mt-5 max-w-[16ch]">This part isn’t in the catalogue.</h1>
        <p className="t-lead mt-6 max-w-[48ch] text-paper/70">The page may have moved. Try the catalogue or search — or send the requirement and the team will help find it.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-accent-fill px-6 py-3.5 font-semibold text-white">Product catalogue</Link>
          <Link href="/search" className="rounded-full border border-paper/30 px-6 py-3.5 font-semibold">Search</Link>
          <Link href="/request-quote?source=404" className="rounded-full border border-paper/30 px-6 py-3.5 font-semibold">Request a Quote</Link>
        </div>
      </div>
    </section>
  );
}

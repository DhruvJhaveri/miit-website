import type { Metadata } from "next";
import { mixkitClips } from "@/content/media-credits";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Media credits", description: "Sources and licences of the footage and imagery used on this website.", alternates: { canonical: "/credits" } };

export default function CreditsPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Media credits" }]} title="Media credits" lead="The film, loops and stills on this website were edited and colour-graded from real, licensed stock footage. They are illustrative and do not depict MIIT CORPORATION's premises, staff, stock, customers or shipments." />
      <section className="bg-paper py-20">
        <div className="shell max-w-4xl">
          <p className="text-graphite">All source clips are from <a className="underline" href="https://mixkit.co/" target="_blank" rel="noopener noreferrer">Mixkit</a> under the <a className="underline" href="https://mixkit.co/license/#videoFree" target="_blank" rel="noopener noreferrer">Mixkit Stock Video Free License</a>. The MIIT logo is the company&apos;s own.</p>
          <table className="mt-10 w-full text-left text-sm">
            <thead className="text-graphite"><tr className="border-b border-ink/15"><th className="py-2 pr-4 font-normal">Clip</th><th className="py-2 pr-4 font-normal">Source</th><th className="py-2 font-normal">Used in</th></tr></thead>
            <tbody>
              {mixkitClips.map((c) => (
                <tr key={c.id} className="border-b border-ink/8 align-top">
                  <td className="py-2.5 pr-4">{c.title}</td>
                  <td className="py-2.5 pr-4"><a className="text-blue underline" href={`https://mixkit.co/free-stock-video/${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}-${c.id}/`} target="_blank" rel="noopener noreferrer">Mixkit #{c.id}</a></td>
                  <td className="py-2.5 text-graphite">{c.usedIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

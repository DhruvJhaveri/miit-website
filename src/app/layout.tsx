import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { company, siteUrl } from "@/content/company";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileQuoteBar } from "@/components/layout/MobileQuoteBar";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ConsentBanner } from "@/components/layout/ConsentBanner";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", axes: ["wdth"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MIIT CORPORATION — Industrial Procurement. Simplified.",
    template: "%s | MIIT CORPORATION",
  },
  description:
    "MIIT CORPORATION, Mumbai — industrial engineering supplies, procurement and project supply since the early 1970s. Tools, consumables, fasteners, piping, valves, structural steel and more, coordinated through one partner.",
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_IN",
    images: [{ url: "/media/film/poster-desktop.jpg", width: 1280, height: 720, alt: "MIIT CORPORATION" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0c0f12",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  alternateName: company.formerName,
  url: siteUrl,
  email: company.email,
  telephone: company.phones.map((p) => p.tel),
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.line1,
    addressLocality: company.address.city,
    postalCode: company.address.postalCode,
    addressRegion: company.address.region,
    addressCountry: "IN",
  },
  sameAs: [company.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables reveal styles before first paint; without JS all content stays visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-motion')`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent-fill focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileQuoteBar />
        <ConsentBanner />
        <RevealObserver />
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/search", "/request-quote/received", "/contact/received"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

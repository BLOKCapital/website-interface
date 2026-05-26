import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

/**
 * Web app manifest. Improves mobile/PWA signals and how the site appears when
 * added to a home screen. Icons reference the generated icon routes so there's
 * a single source of truth for the brand mark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} · Decentralized Wealth Management`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F0",
    theme_color: "#FAF7F0",
    icons: [
      { src: "/favicon.ico", sizes: "222x220", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}

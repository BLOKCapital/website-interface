import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

/**
 * Web app manifest. Improves mobile/PWA signals and how the site appears when
 * added to a home screen. Icons reference the static metadata files in
 * src/app (icon.png, apple-icon.png) so there's a single source of truth for
 * the brand mark.
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
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

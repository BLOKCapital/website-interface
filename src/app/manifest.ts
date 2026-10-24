import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

// Required by `output: "export"` — metadata routes must opt in to being
// rendered once at build time rather than per request.
export const dynamic = "force-static";

/** Day garden paper (--p-paper-50), the page background and the icons' tile. */
const PAPER = "#F7F8F4";

/**
 * Web app manifest. Improves mobile/PWA signals and how the site appears when
 * added to a home screen. Icons are the static metadata files in src/app
 * (icon.png, apple-icon.png) plus a padded maskable copy of icon.png; all
 * three sit on the Day garden paper (MISS-03).
 *
 * `display: "browser"` keeps the address bar when the site is installed: the
 * site tells people to check the domain, so it shouldn't hide it.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${siteConfig.name} · Non-custodial wealth management`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "en-GB",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: PAPER,
    theme_color: PAPER,
    categories: ["finance"],
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // The same art at 85%, so the mark's corners stay inside the 80% safe circle.
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

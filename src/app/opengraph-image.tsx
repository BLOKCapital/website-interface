import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/seo/og";
import { OG_DEFAULT } from "@/lib/seo/metadata";

// The site-wide social card: the home page's, and every page without a card
// of its own (pageMetadata() points those at /opengraph-image). Rendered once
// at build time; `output: "export"` needs metadata routes to opt in.
export const dynamic = "force-static";
export const alt = OG_DEFAULT.alt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogCard({
    eyebrow: "Non-custodial wealth management",
    title: "Grow your crypto.",
    italic: "Keep the keys.",
    footer: "Curated on-chain indices · Arbitrum One",
  });
}

import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/seo/og";
import { indexById, indices } from "@/lib/data/indices";

// One card per index (SEO-02): name, tagline, components and status. No
// weights or values: none are published yet (honest-data rule).
export const dynamic = "force-static";
export const alt = "A BLOK Capital index: its name, its components and its launch status";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return indices.map((i) => ({ id: i.id }));
}

export default async function IndexOpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const idx = indexById((await params).id);
  if (!idx) throw new Error("Unknown index");
  return ogCard({
    eyebrow: "BLOK Capital index",
    title: idx.name,
    italic: idx.tagline,
    // Name and tagline on one line, leaving room for ten components.
    titleSize: 76,
    chips: idx.components,
    badge: idx.status,
    footer: "Market-cap weighted · Chainlink prices · Arbitrum One",
  });
}

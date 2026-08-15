/**
 * The 12 brand Garden renders, served from /public/gardens.
 *
 * (The Accents-Elements SVG originals these were extracted from are no longer
 * in the repo — they were 64MB of unreferenced build weight. Recover from git
 * history if the renders ever need regenerating.)
 *
 * Each render is a 1440×1440 WebP with a real alpha channel, so it drops onto
 * bg-paper directly — no `mix-blend-mode` compositing (that was needed only
 * for the older black-background renders on the dark eggplant theme).
 *
 * 1440px is 2× the largest call-site render (720px in the Hero). The 2000×2000
 * PNG masters were 3.4–4.5MB each — 48MB of images on a 12-image set, with the
 * home page alone pulling ~19MB — and are recoverable from git history if the
 * renders ever need regenerating at a different size.
 */
export const GARDENS_TOTAL = 12;

export type GardenMeta = {
  n: number;
  src: string;
  alt: string;
};

const ALTS: Record<number, string> = {
  1:  "Floating Garden, moss, quartz cluster, pink wildflowers",
  2:  "Floating Garden, three quartz crystals over moss bed with anemone-style blooms",
  3:  "Floating Garden, verdant moss with delicate florals",
  4:  "Floating Garden, vertical rock with pink rose cluster and quartz",
  5:  "Floating Garden, broad moss island with crystal cluster",
  6:  "Floating Garden, stone outcrop with mixed wildflowers",
  7:  "Floating Garden, wide moss-and-rock bed with pink blossoms",
  8:  "Floating Garden, clustered crystals and floral ground cover",
  9:  "Floating Garden, angular rock with crystals and ferns",
  10: "Floating Garden, sculptural stone with rose-pink florals",
  11: "Floating Garden, mossy rock outcrop with quartz spire and pink blooms",
  12: "Floating Garden, dense moss with mixed wildflowers and crystals",
};

export function getGarden(n: number): GardenMeta {
  const padded = String(n).padStart(2, "0");
  return {
    n,
    src: `/gardens/garden-${padded}.webp`,
    alt: ALTS[n] ?? `Floating Garden, variant ${n}`,
  };
}

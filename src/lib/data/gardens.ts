/**
 * The 12 brand Garden renders. Real source: extracted from
 * /public/images/Accents-Elements/*.svg (originals preserved).
 *
 * Each PNG is 2000×2000, photorealistic 3D, black background. We composite
 * them onto bg-paper using `mix-blend-mode: lighten` so the black is
 * dropped and the floral/moss/crystal subject reads cleanly on eggplant.
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
    src: `/gardens/garden-${padded}.png`,
    alt: ALTS[n] ?? `Floating Garden, variant ${n}`,
  };
}

/**
 * The site-wide announcement bar (components/nav/AnnouncementBar.tsx). Change
 * `id` whenever the message changes, so visitors who dismissed the previous
 * one see the new one.
 */
export const announcement = {
  id: "public-launch-waitlist-2026-10",
  /** Chip label; shown with the "soon" (planned) badge tone. */
  label: "Public launch",
  text: "Gardens open to the public after testing.",
  /**
   * The bar's Discord link, in the site's one benefit form (CRO-10): `long`
   * where the bar has room, `short` where it's narrow. Discord buttons
   * elsewhere say "Join the Discord" (DISCORD_LABEL in lib/nav.ts).
   */
  cta: { short: "Hear first on Discord", long: "Join the Discord to hear first" },
} as const;

/** localStorage key holding the id of the last dismissed announcement. */
export const BAR_KEY = "blok:bar-dismissed";

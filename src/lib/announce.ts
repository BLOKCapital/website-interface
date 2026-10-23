/**
 * The site-wide announcement bar (components/nav/AnnouncementBar.tsx). Change
 * `id` whenever the message changes, so visitors who dismissed the previous
 * one see the new one.
 */
export const announcement = {
  id: "private-testing-app-2026-10",
  /** Chip label; shown with the "soon" (planned) badge tone. */
  label: "Private testing",
  text: "The BLOKC app is open to testers first. Gardens open to everyone after testing.",
  /**
   * The community link (Discord), in the site's one benefit form (CRO-10):
   * `long` where the bar has room, `short` where it's narrow. The app itself
   * is the navbar's "Launch App" button.
   */
  cta: { short: "Hear first on Discord", long: "Join the Discord to hear first" },
} as const;

/** localStorage key holding the id of the last dismissed announcement. */
export const BAR_KEY = "blok:bar-dismissed";

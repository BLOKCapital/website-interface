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
  cta: { short: "Hear first on Discord", long: "Join the Discord to hear first" },
} as const;

/** localStorage key holding the id of the last dismissed announcement. */
export const BAR_KEY = "blok:bar-dismissed";

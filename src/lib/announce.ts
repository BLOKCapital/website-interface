import { links } from "@/lib/data/socials";

/**
 * The site-wide announcement bar (components/nav/AnnouncementBar.tsx). Change
 * `id` whenever the message changes, so visitors who dismissed the previous
 * one see the new one.
 */
export const announcement = {
  id: "contributor-program-2026-10",
  /** The lime tag's label. */
  label: "Earn $BLOKC",
  text: "Post about BLOK Capital on X, or complete quests, in the Contributor Program.",
  /** Where the bar's one link goes: `long` where the bar has room, `short` where it's narrow. */
  cta: { href: links.contribute, short: "Join the program", long: "Join the Contributor Program" },
} as const;

/** localStorage key holding the id of the last dismissed announcement. */
export const BAR_KEY = "blok:bar-dismissed";

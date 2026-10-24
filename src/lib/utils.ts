import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom scales in tailwind.config.ts. Without this
// it reads an unknown `text-small` as a colour, so `cn("text-small",
// "text-fg-muted")` silently drops the font size, and it can't tell that two
// custom values of the same scale conflict. Keep these lists in step with
// the config.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Feeds padding, margin, gap, inset, size, scroll-margin and friends.
      spacing: ["section", "section-sm", "header", "gutter", "pad-card", "pad-panel"],
      borderRadius: ["xs", "tag", "control", "card", "panel"],
    },
    classGroups: {
      shadow: [{ shadow: ["e1", "e2", "e3", "halo", "inset-accent"] }],
      z: [{ z: ["raised", "tooltip", "nav", "banner", "overlay", "toast", "skip"] }],
      "font-size": [
        {
          text: [
            "micro",
            "label",
            "eyebrow",
            "caption",
            "small",
            "ui",
            "body",
            "lead",
            "h4",
            "h3",
            "display-sm",
            "display-md",
            "h2",
            "h1",
          ],
        },
      ],
      tracking: [{ tracking: ["caps", "eyebrow"] }],
      duration: [{ duration: ["instant", "fast", "base", "slow", "scenic"] }],
      ease: [{ ease: ["expo", "inout"] }],
      animate: [
        {
          animate: [
            "rise",
            "reveal",
            "fade-in",
            "swap",
            "pop-in",
            "progress",
            "enter-up",
            "enter-fade",
            "morph-in",
            "flow",
            "float",
            "pulse-ring",
            "blink",
            "stamp",
          ],
        },
      ],
      "max-w": [{ "max-w": ["page", "wide", "measure", "measure-narrow"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(addr: string, head = 6, tail = 4) {
  if (!addr || addr.length < head + tail + 2) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

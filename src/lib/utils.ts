import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom type scale (tailwind.config.ts fontSize).
// Without this it reads `text-small` as a colour, and `cn("text-small",
// "text-fg-muted")` silently drops the font size.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["eyebrow", "caption", "small", "body", "lead", "h4", "h3", "h2", "h1"] }],
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

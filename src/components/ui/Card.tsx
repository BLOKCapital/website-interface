import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardTone = "default" | "feature" | "tint-cobalt" | "tint-sand" | "planned";
export type CardSize = "sm" | "md" | "lg";
export type CardRadius = "card" | "panel";

const tones: Record<CardTone, string> = {
  default: "border-subtle bg-card shadow-soft",
  // A Night-garden island (the featured tile): re-declares every token inside.
  feature: "theme-dark border-subtle bg-card shadow-e3",
  "tint-cobalt": "border-data/20 bg-data/6",
  "tint-sand": "border-emphasis/20 bg-emphasis/6",
  // Not built yet: a dashed outline and no fill.
  planned: "border-dashed border-line/25 bg-transparent",
};

const sizes: Record<CardSize, string> = {
  sm: "p-5", // 20 · dense tiles, link rows
  md: "p-pad-card", // 24 → 28 · the default
  lg: "p-pad-panel", // 24 → 40 · consoles, feature panels
};

const radii: Record<CardRadius, string> = {
  card: "rounded-card", // 16
  panel: "rounded-panel", // 24
};

// Hover only with a real pointer. No lift: the card stays put, a clear leaf
// outline (its border plus a 1px ring, so nothing shifts) and a deeper
// ambient shadow say it's the target.
const hover =
  "transition-[border-color,box-shadow] duration-base ease-out can-hover:hover:border-leaf/60 can-hover:hover:shadow-soft-hover can-hover:hover:ring-1 can-hover:hover:ring-leaf/60";
// For a card that holds its own stretched link: the same outline while that
// link is hovered or focused.
const within =
  "transition-[border-color,box-shadow] duration-base ease-out can-hover:has-[a:hover]:border-leaf/60 can-hover:has-[a:hover]:shadow-soft-hover can-hover:has-[a:hover]:ring-1 can-hover:has-[a:hover]:ring-leaf/60 has-[a:focus-visible]:border-leaf/60";

type Props = {
  tone?: CardTone;
  size?: CardSize;
  radius?: CardRadius;
  /**
   * Hover and focus treatment for a card that isn't a link itself but
   * contains one (a stretched link on its heading). Cards with `href` get
   * the link treatment anyway.
   */
  interactive?: boolean;
  /** The whole card becomes a link. External links open in a new tab. */
  href?: string;
  /**
   * Name a whole-card link by its heading (A11Y-31): the id of the card's
   * h2/h3, so the link reads as its title instead of every word inside.
   */
  "aria-labelledby"?: string;
  /** The card's summary, read after the name. */
  "aria-describedby"?: string;
  /** Element for a non-link card (default div). */
  as?: ElementType;
  id?: string;
  /** Analytics hooks (lib/analytics.ts): a CTA id and where it sits. */
  "data-cta"?: string;
  "data-placement"?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The one card surface (VIS-09): `tone` × `size` × `radius`, on the
 * Foundation tokens. The defaults (default · md · card) render exactly the
 * card: rounded-card, a subtle hairline, bg-card with a soft ambient shadow,
 * p-pad-card. With `href`, the whole card is a link: on pointer hover it
 * gains a leaf outline and a deeper shadow, without moving.
 */
export function Card({
  tone = "default",
  size = "md",
  radius = "card",
  interactive = false,
  href,
  as: El = "div",
  className,
  children,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  id,
  "data-cta": dataCta,
  "data-placement": dataPlacement,
}: Props) {
  const surface = cn("relative border", radii[radius], tones[tone], sizes[size]);
  if (!href) {
    return (
      <El id={id} data-cta={dataCta} data-placement={dataPlacement} className={cn(surface, interactive && within, className)}>
        {children}
      </El>
    );
  }
  const external = /^https?:\/\//.test(href);
  // With aria-labelledby the name comes from the heading alone, so point at
  // the "(opens in a new tab)" note too.
  const noteId = labelledBy && external ? `${labelledBy}-newtab` : undefined;
  return (
    <Link
      href={href}
      id={id}
      data-cta={dataCta}
      data-placement={dataPlacement}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-labelledby={labelledBy ? [labelledBy, noteId].filter(Boolean).join(" ") : undefined}
      aria-describedby={describedBy}
      className={cn(surface, "group/card block", hover, className)}
    >
      {children}
      {external && (
        <span id={noteId} className="sr-only">
          {" "}
          (opens in a new tab)
        </span>
      )}
    </Link>
  );
}

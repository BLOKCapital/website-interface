import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Scroll reveals that don't wait for the JavaScript bundle.
 *
 * Plain markup with data attributes. The inline RevealScript (root layout)
 * marks `<html class="js">`, watches every [data-reveal] / [data-reveal-group]
 * with an IntersectionObserver and sets [data-revealed] as each enters the
 * viewport; globals.css runs the fade. Content is therefore visible without
 * JavaScript, revealed as soon as the HTML parses (not after hydration), and
 * never hidden under prefers-reduced-motion. Server components: no client JS.
 */

type Tag = "div" | "section" | "article" | "ul" | "ol" | "li" | "p" | "aside" | "figure";

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  id,
}: {
  children: ReactNode;
  /** Seconds before the transition starts. */
  delay?: number;
  as?: Tag;
  className?: string;
  id?: string;
}) {
  const El = as as ElementType;
  return (
    <El
      id={id}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
      // RevealScript adds data-revealed before React hydrates.
      suppressHydrationWarning
    >
      {children}
    </El>
  );
}

/** Container for a cascade: wrap items in <RevealItem>, at any depth. */
// Reveal/Stagger/RevealItem are one primitive set; co-located on purpose.
// react-doctor-disable-next-line react-doctor/no-multi-comp
export function Stagger({
  children,
  step = 0.07,
  as = "div",
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  /** Seconds between items. */
  step?: number;
  as?: Tag;
  className?: string;
  "aria-label"?: string;
}) {
  const El = as as ElementType;
  return (
    <El
      aria-label={ariaLabel}
      data-reveal-group=""
      className={className}
      style={{ "--stagger": `${step}s` } as CSSProperties}
      suppressHydrationWarning
    >
      {children}
    </El>
  );
}

// react-doctor-disable-next-line react-doctor/no-multi-comp
export function RevealItem({
  children,
  as = "div",
  className,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
}) {
  const El = as as ElementType;
  return (
    // RevealScript sets --i (the item's position) before React hydrates.
    <El data-reveal-item="" className={className} suppressHydrationWarning>
      {children}
    </El>
  );
}

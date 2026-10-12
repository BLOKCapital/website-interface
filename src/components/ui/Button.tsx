import Link from "next/link";
import { Children, isValidElement, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ExternalIcon } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

// States, for every variant: hover only with a real pointer (can-hover, so a
// tap never leaves a stuck hover), the site focus ring (globals.css), a
// press that scales to --scale-press, and disabled / aria-disabled / busy.
const base = cn(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium",
  "transition-[background-color,border-color,color,transform] duration-fast ease-out",
  "active:scale-[var(--scale-press)] active:duration-instant",
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
  "aria-busy:cursor-progress",
);

const variants: Record<Variant, string> = {
  // On-accent text on leaf: 5.7:1 Day, 11.5:1 Night.
  primary: "bg-accent text-accent-fg can-hover:hover:bg-accent-hover",
  secondary: "border border-line/15 bg-card text-fg can-hover:hover:border-line/30 can-hover:hover:bg-raised",
  ghost: "text-fg-muted can-hover:hover:text-fg",
};

// The host label is "muted" by weight and face, not by a fainter colour on
// the leaf fill (that would drop under 4.5:1).
const hostTone: Record<Variant, string> = {
  primary: "",
  secondary: "text-fg-muted",
  ghost: "text-fg-subtle",
};

// md and lg meet the 44px touch target; sm is for dense desktop rows.
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-5 text-ui",
  lg: "h-12 px-6 text-ui",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};
type AsLink = Common & {
  href: string;
  /**
   * External destinations that ask for a wallet (Aragon, Arbiscan): show
   * where the link goes, as a muted host label after the text. `true` uses
   * the link's own host (e.g. "app.aragon.org").
   */
  host?: string | boolean;
  /** External links show ↗ by default; `false` for icon-only buttons. */
  externalIcon?: boolean;
  loading?: never;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type AsButton = Common & {
  href?: undefined;
  host?: never;
  externalIcon?: never;
  /** Busy: disabled, aria-busy, and a spinner before the label. */
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Whether the caller already put an ↗ in the label (kept until Wave 3 drops them). */
const hasExternalIcon = (children: ReactNode) =>
  Children.toArray(children).some((c) => isValidElement(c) && c.type === ExternalIcon);

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-4 shrink-0 animate-spin motion-off:animate-none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Button, or a link styled as one when `href` is set. External links open
 * in a new tab and say so twice: a visible ↗ and, for screen readers,
 * "(opens in a new tab)". Add `host` where the destination asks for a wallet.
 */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    const { href, host, externalIcon = true, ...a } = rest as AsLink;
    if (isExternal(href)) {
      const hostLabel = host === true ? new URL(href).host : host || null;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...a}>
          {children}
          {hostLabel && <span className={cn("font-mono text-label font-normal", hostTone[variant])}>{hostLabel}</span>}
          {externalIcon && !hasExternalIcon(children) && <Icon name="external" size="sm" className="-mx-0.5" />}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...a}>
        {children}
      </Link>
    );
  }

  const { loading, disabled, ...b } = rest as AsButton;
  return (
    <button type="button" className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...b}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

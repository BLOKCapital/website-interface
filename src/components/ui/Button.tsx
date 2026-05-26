import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "secondary" | "discord";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition duration-150 ease-in-soft will-change-transform select-none focus-visible:outline-2 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  // Moss-on-paper primary: warm and grounded, no neon halo.
  primary:
    "bg-moss text-paper shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_24px_-14px_rgba(31,26,20,0.45)] hover:bg-moss-deep",
  // Clay accent — used for warmth / call-out CTAs.
  secondary:
    "bg-clay text-paper shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_24px_-14px_rgba(31,26,20,0.45)] hover:bg-clay-deep",
  // Paper card outline — sits inside cream surfaces.
  outline:
    "border border-ink/15 bg-paper text-ink hover:border-ink/40 hover:bg-paper-warm",
  ghost: "text-ink-muted hover:text-ink",
  // Brand-blue gradient lifted from the BLOK mark (cyan → indigo).
  discord:
    "bg-gradient-to-br from-[#16c2ff] via-[#2f6bff] to-[#1b1af0] text-white shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_10px_24px_-12px_rgba(37,99,255,0.55)] hover:brightness-110",
};

// 44pt touch target minimum: `sm` keeps a compact visual but an invisible
// ::before hit-pad extends the click area to 44px total.
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };
type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    ref?: React.Ref<HTMLButtonElement>;
  };

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, ref, ...anchorRest } = rest;
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...anchorRest}
        >
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cls}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...anchorRest}
      >
        {children}
      </Link>
    );
  }

  const { ref, ...buttonRest } = rest as ButtonProps;
  return (
    <button
      type="button"
      className={cls}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...buttonRest}
    >
      {children}
    </button>
  );
}

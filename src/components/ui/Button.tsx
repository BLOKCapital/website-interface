import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  // Leaf on canvas: 11.5:1.
  primary: "bg-leaf text-canvas hover:bg-[rgb(170_226_189)]",
  secondary: "border border-line/15 bg-card text-fg hover:border-line/30 hover:bg-raised",
  ghost: "text-fg-muted hover:text-fg",
};

// md and lg meet the 44px touch target; sm is for dense desktop rows.
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13.5px]",
  md: "h-11 px-5 text-[14.5px]",
  lg: "h-12 px-6 text-[15px]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };
type AsLink = Common & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type AsButton = Common & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Button, or a link styled as one when `href` is set. External links open in a new tab. */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    const { href, ...a } = rest as AsLink;
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...a}>
          {children}
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
  return (
    <button type="button" className={cls} {...(rest as AsButton)}>
      {children}
    </button>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

const surface =
  "relative rounded-2xl border border-line/[0.08] bg-card p-6 sm:p-7";

/** The one card surface. With `href`, the whole card is a link with a hover lift. */
export function Card({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={cn(surface, className)}>{children}</div>;
  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        surface,
        "group/card block transition-[border-color,background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-leaf/30 hover:bg-raised",
        className,
      )}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </Link>
  );
}

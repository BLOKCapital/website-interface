import Link from "next/link";
import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Inline "learn more" link with a directional arrow; external links get ↗. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group/al inline-flex items-center gap-1.5 text-[14.5px] font-medium text-leaf transition-colors hover:text-fg",
        className,
      )}
    >
      {children}
      {external ? (
        <ExternalIcon className="transition-transform group-hover/al:-translate-y-0.5 group-hover/al:translate-x-0.5" />
      ) : (
        <ArrowIcon className="transition-transform group-hover/al:translate-x-0.5" />
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </Link>
  );
}

import Link from "next/link";

export type Crumb = { label: string; href?: string };

/**
 * The one breadcrumb trail (UX-18, SEO-20). The page passes its labels, so
 * they can match the nav (lib/nav.ts) and the page's breadcrumbSchema()
 * JSON-LD word for word. Home comes first unless `home={false}`; the last
 * crumb is the current page (aria-current, never a link); any other crumb
 * without an href renders as plain text.
 */
export function Breadcrumb({ items, home = true, className }: { items: Crumb[]; home?: boolean; className?: string }) {
  const trail: Crumb[] = home ? [{ label: "Home", href: "/" }, ...items] : items;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-fg-subtle">
        {trail.map((c, i) => {
          const current = i === trail.length - 1;
          return (
            <li key={`${i}-${c.label}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {current ? (
                <span aria-current="page" className="text-fg-muted">
                  {c.label}
                </span>
              ) : c.href ? (
                <Link href={c.href} className="transition-colors duration-fast can-hover:hover:text-fg">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

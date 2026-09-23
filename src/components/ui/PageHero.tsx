import Link from "next/link";

/**
 * Inner-page header: breadcrumb, h1, lede, optional actions and aside. The
 * entrance is pure CSS, so it paints with the HTML instead of after
 * hydration. Pair with breadcrumbSchema() JSON-LD on the page.
 */
export function PageHero({
  crumb,
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  /** Current page name in the breadcrumb. */
  crumb: string;
  eyebrow?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/[0.07]">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="glow-leaf pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 opacity-60" />
      <div className="relative mx-auto grid w-full max-w-page gap-12 px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <nav aria-label="Breadcrumb" className="animate-enter-fade">
            <ol className="flex items-center gap-2 text-caption text-fg-subtle">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-fg-muted">
                {crumb}
              </li>
            </ol>
          </nav>
          {eyebrow && (
            <p className="eyebrow mt-8 animate-enter-up" style={{ animationDelay: "60ms" }}>
              {eyebrow}
            </p>
          )}
          <h1 className="display mt-4 animate-enter-up text-h1 text-balance text-fg" style={{ animationDelay: "120ms" }}>
            {title}
          </h1>
          <p className="mt-6 max-w-2xl animate-enter-up text-lead text-fg-muted" style={{ animationDelay: "200ms" }}>
            {description}
          </p>
          {actions && (
            <div className="mt-9 flex animate-enter-up flex-wrap gap-3" style={{ animationDelay: "280ms" }}>
              {actions}
            </div>
          )}
        </div>
        {aside && (
          <div className="animate-enter-up lg:col-span-4" style={{ animationDelay: "320ms" }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

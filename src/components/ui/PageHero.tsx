import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { cn } from "@/lib/utils";

/**
 * Inner-page header: breadcrumb, h1, lede, optional actions and aside.
 *
 * Entrance (D-32, PERF-01, MOT-01): pure CSS, painted with the HTML. The h1,
 * lede, actions and aside rise 8px from full opacity with no delay
 * (`animate-rise`), so the LCP candidate and the CTAs are visible on the
 * first frame. Only the breadcrumb and the eyebrow fade in. Everything has
 * settled by --dur-slow (420ms); after a client-side navigation none of it
 * replays (globals.css, "Page changes").
 *
 * The eyebrow is the h1's first line (SEO-11): a block span styled exactly
 * as the eyebrow always was, so the page's topic keyword is part of its
 * main heading with no visual change. Pair with breadcrumbSchema() JSON-LD
 * on the page, using the same labels as the breadcrumb.
 */
export function PageHero({
  crumb,
  parent,
  crumbs,
  eyebrow,
  title,
  description,
  actions,
  aside,
  asideAlign = "end",
}: {
  /** Current page name in the breadcrumb. */
  crumb?: string;
  /** Optional middle breadcrumb, e.g. Indices on an index page. */
  parent?: { label: string; href: string };
  /** The whole trail after Home, instead of `parent` + `crumb`. The last item is the current page. */
  crumbs?: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  /** "start" for an aside taller than the text beside it, so it lines up with the breadcrumb instead of rising above it. */
  asideAlign?: "start" | "end";
}) {
  const trail: Crumb[] = crumbs ?? [...(parent ? [parent] : []), ...(crumb ? [{ label: crumb }] : [])];
  return (
    <section className="relative overflow-hidden border-b border-subtle">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="glow-leaf pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 opacity-60" />
      <CornerMarks only="bottom" />
      <Container className={cn("relative grid gap-12 pb-16 pt-32 sm:pb-20 sm:pt-40 lg:grid-cols-12", asideAlign === "start" ? "lg:items-start" : "lg:items-end")}>
        <div className="lg:col-span-8">
          {trail.length > 0 && <Breadcrumb items={trail} className="animate-fade-in" />}
          <h1 className={cn("display animate-rise text-h1 text-balance text-fg", eyebrow ? "mt-8" : "mt-4")}>
            {/* The trailing space keeps "Eyebrow Title" apart in the text
                content; layout drops it at the end of the block. */}
            {eyebrow && <span className="eyebrow mb-4 block animate-fade-in">{`${eyebrow} `}</span>}
            {title}
          </h1>
          <p className="mt-6 max-w-2xl animate-rise text-lead text-fg-muted">{description}</p>
          {actions && <div className="mt-9 flex animate-rise flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && <div className="animate-rise lg:col-span-4">{aside}</div>}
      </Container>
    </section>
  );
}

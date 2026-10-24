import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DiscordIcon } from "@/components/ui/icons";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { IntentLink } from "@/components/ui/IntentLink";
import { NavIcon } from "@/components/nav/NavIcons";
import { docsLink, navGroups } from "@/lib/nav";
import { social } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

// noindex, follow and no canonical (SEO-05): the page isn't a URL to index,
// but its links are worth following.
export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "This page doesn't exist or has moved.",
  path: null,
  robots: { index: false, follow: true },
});

const navLink = (href: string) => navGroups.flatMap((g) => g.links).find((l) => l.href === href)!;

/** The next most useful pages, in the nav's own words (UX-19, CRO-28). */
const exits = [
  { ...navLink("/indices"), label: "Indices" },
  { ...navLink("/security"), label: "Security" },
  { ...navLink("/contact"), label: "Contact" },
  { ...docsLink, label: "Docs" },
];

const pill =
  "inline-flex h-11 items-center gap-2.5 rounded-full border border-subtle bg-card pl-1.5 pr-4 text-small font-semibold text-fg shadow-e1 transition-[border-color,box-shadow] duration-fast can-hover:hover:border-leaf/50 can-hover:hover:shadow-e2";

/**
 * 404, on the notebook paper: a heavy headline with its payoff by hand, the
 * Garden cut out as a sticker with a "404" stamp on it, the way home, and
 * the next most useful pages as pills (each with its menu icon). The
 * Discord, in its own colour, for anyone still lost.
 */
export default function NotFound() {
  return (
    <section className="paper-ruled relative overflow-hidden">
      <div aria-hidden className="glow-leaf pointer-events-none absolute -right-40 top-10 h-[520px] w-[720px] opacity-50" />
      <div className="relative mx-auto grid min-h-[86vh] w-full max-w-page items-center gap-12 px-gutter pb-20 pt-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">Error 404 · page not found</p>
          <h1 className="display mt-5 text-h1 text-balance text-fg">
            Nothing <em>planted here.</em>
          </h1>
          <p className="mt-6 max-w-md text-lead text-fg-muted">The page you&apos;re looking for doesn&apos;t exist, or it has moved.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/" size="lg" variant="solid">
              Back to home
            </Button>
            <Button href="/protocol" size="lg" variant="secondary">
              How it works
            </Button>
          </div>

          <h2 className="mt-12 font-mono text-label uppercase tracking-caps text-cobalt">Or try</h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {exits.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={pill}>
                    <span aria-hidden className="grid size-8 place-items-center rounded-full bg-cobalt/10 text-cobalt">
                      <NavIcon href={l.href} size={16} />
                    </span>
                    {l.label}
                    <Icon name="external" size="sm" className="-ml-1 text-fg-subtle" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <IntentLink href={l.href} className={pill}>
                    <span aria-hidden className="grid size-8 place-items-center rounded-full bg-cobalt/10 text-cobalt">
                      <NavIcon href={l.href} size={16} />
                    </span>
                    {l.label}
                  </IntentLink>
                )}
              </li>
            ))}
          </ul>

          <a
            href={social("discord").href}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="not_found"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#5865F2] py-1.5 pl-1.5 pr-5 text-small font-semibold text-white shadow-e1 transition-shadow duration-fast can-hover:hover:shadow-e2"
          >
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-white text-[#5865F2]">
              <DiscordIcon size={16} />
            </span>
            Still lost? Ask in the Discord
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[440px] lg:col-span-5 lg:block">
          <div className="absolute inset-0 animate-float">
            <GardenAsset n={7} sizes="440px" className="sticker" />
          </div>
          <span className="stamp absolute left-2 top-10 bg-canvas/80 px-4 py-2 text-h4 text-danger backdrop-blur-sm">404</span>
          <span className="note absolute bottom-6 right-0 -rotate-6 text-h4">this patch is empty</span>
        </div>
      </div>
    </section>
  );
}

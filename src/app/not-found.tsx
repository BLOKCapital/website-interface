import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { GardenAsset } from "@/components/ui/GardenAsset";
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
  { ...docsLink, label: "Docs" },
  { ...navLink("/contact"), label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[80vh] w-full max-w-page items-center gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-4 text-h1 text-fg">Nothing planted here.</h1>
        <p className="mt-6 max-w-md text-lead text-fg-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/protocol" variant="secondary">
            Protocol
          </Button>
        </div>

        <h2 className="eyebrow mt-12">Or try</h2>
        <ul className="mt-4 grid max-w-xl gap-3 sm:grid-cols-3">
          {exits.map((l) => (
            <li key={l.href}>
              <Card href={l.href} size="sm" className="flex h-full flex-col">
                <span className="flex items-center justify-between gap-2 text-ui font-medium text-fg">
                  {l.label}
                  <Icon
                    name={l.external ? "external" : "arrow-right"}
                    size="sm"
                    className="text-fg-subtle transition-colors duration-fast group-hover/card:text-leaf"
                  />
                </span>
                <span className="mt-1 text-caption text-fg-muted">{l.hint}</span>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-small text-fg-muted">
          {"Still lost? "}
          <a
            href={social("discord").href}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="not_found"
            className="inline-flex items-center gap-0.5 rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
          >
            Ask in the Discord
            <Icon name="external" size="sm" className="-mx-1" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
      <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] opacity-80 lg:block">
        <GardenAsset n={7} sizes="420px" />
      </div>
    </section>
  );
}

import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { links, socials } from "@/lib/data/socials";
import { siteConfig } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  label: string;
  /** Exactly what to compare against: a bare domain/path, or a full address. */
  literal: string;
  /** What the copy button copies. */
  copy: string;
  /** Where "Open" goes. */
  href: string;
  /** Extra detail, such as the X handle. */
  note?: string;
};

/** "https://www.youtube.com/@blokcapital" → "youtube.com/@blokcapital". */
const bare = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
const origin = (url: string) => new URL(url).origin;

/** The DAO's address, read from the Aragon link itself so the two can't disagree. */

/**
 * Generated from the site's verified sources (siteConfig, socials.ts,
 * token.ts), so the list can't drift from the links used everywhere else
 * (SEC-10, H §3.6). The app is listed too, now that it's the navbar's
 * primary action, and the Contributor Program app beside it.
 */
const groups: { id: string; title: string; entries: Entry[] }[] = [
  {
    id: "web",
    title: "Websites",
    entries: [
      { id: "site", label: "Website", literal: bare(siteConfig.url), copy: siteConfig.url, href: siteConfig.url },
      { id: "app", label: "App", literal: bare(links.app), copy: links.app, href: links.app },
      { id: "contribute", label: "Contributor app", literal: bare(links.contribute), copy: links.contribute, href: links.contribute },
      { id: "docs", label: "Docs", literal: bare(origin(links.docs)), copy: origin(links.docs), href: links.docs },
      // Contract addresses: the docs publish them, so the list points there rather than repeating them.
      { id: "addresses", label: "Contract addresses", literal: bare(links.docsAddresses), copy: links.docsAddresses, href: links.docsAddresses },
    ],
  },
  {
    id: "community",
    title: "Community",
    entries: socials.map((s) => ({
      id: s.id,
      label: s.label,
      literal: bare(s.href),
      copy: s.href,
      href: s.href,
      note: s.id === "x" ? siteConfig.twitterHandle : undefined,
    })),
  },
];

/**
 * Official links (#official): the one list to check a link or handle
 * against, written out in full with copy buttons. Contract addresses are
 * the docs' to publish, so the list links to that page instead. Ends with
 * "Anything else is not us." No "last checked" date: none is kept.
 */
export function OfficialLinks() {
  return (
    <Section
      id="official"
      eyebrow="Official links"
      title="Check it against this list."
      description="Every BLOK Capital domain and handle, written out in full, so you can compare them character by character before you click, sign or send. Contract addresses are in the docs."
    >
      <Reveal>
        <div data-placement="official_links" className="grid gap-5 lg:grid-cols-2">
          {groups.map((g) => (
            <div
              key={g.id}
              role="group"
              aria-labelledby={`official-group-${g.id}`}
              // Full addresses need the whole width.
              className={cn("rounded-card border border-subtle bg-card p-5 shadow-soft sm:p-6", g.id === "chain" && "lg:col-span-2")}
            >
              <h3 id={`official-group-${g.id}`} className="label-caps">
                {g.title}
              </h3>
              <dl className="mt-3 divide-y divide-subtle">
                {g.entries.map((e) => {
                  const id = `official-${e.id}`;
                  return (
                    <div key={e.id} className="grid gap-x-4 gap-y-1.5 py-3 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center">
                      <dt className="text-small text-fg-muted">{e.label}</dt>
                      <dd className="min-w-0">
                        {/* Addresses break anywhere; URLs prefer to break after a "/". */}
                        <code
                          id={id}
                          className={cn("font-mono text-[0.8125rem] text-fg", e.literal.startsWith("0x") ? "break-all" : "[overflow-wrap:anywhere]")}
                        >
                          {e.literal.startsWith("0x")
                            ? e.literal
                            : e.literal.split("/").map((part, i) => (
                                <Fragment key={i}>
                                  {i > 0 && (
                                    <>
                                      /<wbr />
                                    </>
                                  )}
                                  {part}
                                </Fragment>
                              ))}
                        </code>
                        {e.note && <span className="ml-2 font-mono text-caption text-fg-subtle">{e.note}</span>}
                      </dd>
                      <dd className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <CopyButton value={e.copy} label="Copy" selectTarget={id} />
                        <a
                          href={e.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-8 items-center gap-0.5 rounded-xs text-label font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg"
                        >
                          Open
                          <Icon name="external" size="sm" />
                          <span className="sr-only">
                            {" "}
                            {e.label} (opens in a new tab)
                          </span>
                        </a>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      </Reveal>
      <p className="display mt-10 text-h3 text-fg">
        Anything else is <em>not us.</em>
      </p>
    </Section>
  );
}

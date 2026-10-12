import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { links, socials } from "@/lib/data/socials";
import { BLOKC_TOKEN } from "@/lib/data/token";
import { ARBISCAN } from "@/lib/live/rpc";
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
const DAO_ADDRESS = links.aragon.match(/0x[0-9a-fA-F]{40}/)![0];

/**
 * Generated from the site's verified sources (siteConfig, socials.ts,
 * token.ts), so the list can't drift from the links used everywhere else
 * (SEC-10, H §3.6). The app domain is deliberately not listed while it's in
 * private testing (owner decision).
 */
const groups: { id: string; title: string; entries: Entry[] }[] = [
  {
    id: "web",
    title: "Websites",
    entries: [
      { id: "site", label: "Website", literal: bare(siteConfig.url), copy: siteConfig.url, href: siteConfig.url },
      { id: "docs", label: "Docs", literal: bare(origin(links.docs)), copy: origin(links.docs), href: links.docs },
      { id: "audits", label: "Audit reports", literal: bare(links.auditsRepo), copy: links.auditsRepo, href: links.auditsRepo },
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
  {
    id: "chain",
    title: "On-chain · Arbitrum One",
    entries: [
      { id: "blokc", label: "$BLOKC token", literal: BLOKC_TOKEN, copy: BLOKC_TOKEN, href: `${ARBISCAN}/token/${BLOKC_TOKEN}` },
      { id: "dao", label: "DAO (Aragon OSx)", literal: DAO_ADDRESS, copy: DAO_ADDRESS, href: links.aragon },
    ],
  },
];

/**
 * Official links (#official): the one list to check a link, handle or
 * address against, written out in full with copy buttons. Ends with
 * "Anything else is not us." No "last checked" date: none is kept.
 */
export function OfficialLinks() {
  return (
    <Section
      id="official"
      eyebrow="Official links"
      title={
        <>
          Check it against <em className="text-sand">this list.</em>
        </>
      }
      description="Every BLOK Capital domain, handle and address, written out in full, so you can compare them character by character before you click, sign or send."
    >
      <Reveal>
        <div data-placement="official_links" className="grid gap-5 lg:grid-cols-2">
          {groups.map((g) => (
            <div
              key={g.id}
              role="group"
              aria-labelledby={`official-group-${g.id}`}
              // Full addresses need the whole width.
              className={cn("rounded-card border border-subtle bg-card p-5 sm:p-6", g.id === "chain" && "lg:col-span-2")}
            >
              <h3 id={`official-group-${g.id}`} className="label-caps">
                {g.title}
              </h3>
              <dl className="mt-3 divide-y divide-line/[0.07]">
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
      <p className="mt-6 text-lead font-medium text-fg">Anything else is not us.</p>
    </Section>
  );
}

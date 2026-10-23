import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { BADGE_STATUS, type Tone } from "@/components/ui/Badge";
import { Stagger } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { IntentLink } from "@/components/ui/IntentLink";
import { RebalanceArt, RoutesArt, BadgeArt } from "@/components/home/products/ProductArt";
import { ArtReplay } from "@/components/home/products/ArtReplay";
import { protocolStatus } from "@/lib/data/status";
import { links } from "@/lib/data/socials";
import { cn } from "@/lib/utils";

export const products: {
  id: string;
  name: string;
  /** Who steers a Garden of this kind. */
  steer: string;
  /** Only for a product that isn't coming at the public launch (Gardeners). */
  status?: { tone: Tone; label: string };
  summary: string;
  /** Who it suits, in one line (also on /protocol's product stack). */
  audience: string;
  points: string[];
  /** Where the home tile goes. */
  href: string;
  /** Its page in the app (blokc.app), for the products the app already has. */
  app?: string;
}[] = [
  {
    id: "index",
    name: "Index Gardens",
    steer: "The index",
    // CRO-14: who decides what, in the site's one wording (faqs.ts, /indices).
    summary:
      "Follow a basket that rebalances itself. Components chosen by the team and approved by the DAO; weights set on-chain by market cap.",
    audience: "For people who want diversified exposure without managing it.",
    points: [
      "Three indices: BLOKC2, BLOKC5 and BLOKC10",
      "Market-cap weights, priced by Chainlink",
      "Pooled rebalancing, only past 2% drift",
    ],
    // Straight to the indices, one hop closer (UX-23).
    href: "/indices",
    app: "index-gardens",
  },
  {
    id: "yield",
    name: "Yield Gardens",
    steer: "You",
    summary: "Steer it yourself across the venues a Garden composes with.",
    audience: "For people who'd rather steer themselves.",
    points: ["Swap on Uniswap V3 and Camelot V3", "Lend and borrow on Aave V3", "Perps on GMX V2, fixed yield on Pendle V2"],
    href: "/protocol#yield",
    app: "gardens",
  },
  {
    id: "gardeners",
    name: "Gardeners",
    steer: "A manager you hire",
    status: { tone: BADGE_STATUS.planned.tone, label: `${BADGE_STATUS.planned.label} · ${protocolStatus.gardeners}` },
    summary: "Hire an on-chain manager whose record anyone can verify.",
    audience: "For people who want a professional, and for the professionals.",
    points: [
      "Track record kept on-chain, on a badge that can't be transferred",
      "Trades within limits you approve; can't hold your funds",
      "Fees capped by DAO-set ceilings; revoke any time",
    ],
    href: "/protocol#gardeners",
  },
];

/** Each tile's picture of what it does. */
const art = { index: RebalanceArt, yield: RoutesArt, gardeners: BadgeArt } as const;

/**
 * The three products, side by side, each set like one of the brand's
 * posts: a page number (and, for Gardeners, its "Planned" stamp) across the top; who steers it
 * as a mono label with the answer handwritten ("STEERED BY the index"); a
 * heavy title and the one-line summary; the picture on its own ruled sheet,
 * playing once (a basket drifting past its 2% band and pulled back in one
 * pooled trade; you routing to the venues; a manager's soulbound record,
 * with access you can switch off); the points typed on strips of paper; and
 * the links at the foot. Every Garden is the same wallet; the cards differ
 * in who steers it.
 *
 * Each tile's main link is its heading, stretched over the card and
 * described by the summary (A11Y-31), so the card reads as its title
 * instead of every word in it. Open products also get their own "Open in
 * the app" link to their page on blokc.app, layered above the stretched one.
 */
export function Products() {
  return (
    <Section
      id="products"
      eyebrow="What you can do"
      title="Three ways to grow a Garden."
      description="Every Garden is the same smart wallet underneath; what changes is who steers it."
    >
      <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => {
          const Art = art[p.id as keyof typeof art];
          const titleId = `product-${p.id}`;
          return (
            // A RevealItem that also carries the analytics id for the card link inside it.
            <li
              key={p.id}
              data-reveal-item=""
              data-cta={`products_${p.id}`}
              suppressHydrationWarning
              className={cn("h-full", i === 2 && "md:col-span-2 lg:col-span-1")}
            >
              <Card interactive className="group/card relative flex h-full flex-col overflow-hidden p-0 sm:p-0">
                {/* Across the top, as on a post: its page, and its status stamped. */}
                <div className="flex items-center justify-between gap-3 px-6 pt-5">
                  <span aria-hidden className="font-mono text-label text-cobalt">
                    {String(i + 1).padStart(2, "0")}/{String(products.length).padStart(2, "0")}
                  </span>
                  {p.status && <span className="stamp mr-1 text-fg-muted">{p.status.label}</span>}
                </div>

                <div className="px-6 pt-5">
                  <p className="leading-none">
                    <span className="label-caps text-cobalt">{"Steered by "}</span>
                    <span className="note">{p.steer.toLowerCase()}</span>
                  </p>
                  <h3 id={titleId} className="display mt-3 text-h3 text-fg">
                    {/* The card's one main link, stretched over the whole card; named by the heading, described by the summary. */}
                    <IntentLink
                      href={p.href}
                      aria-describedby={`${titleId}-summary`}
                      className="after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
                    >
                      {p.name}
                    </IntentLink>
                  </h3>
                  <p id={`${titleId}-summary`} className="mt-3 text-ui text-fg-muted">
                    {p.summary}
                  </p>
                </div>

                {/* The picture, on its own ruled sheet. Replays when the card is hovered or focused. */}
                <div className="paper-ruled relative mx-4 mt-5 flex items-center justify-center overflow-hidden rounded-control border border-subtle bg-canvas px-3 py-5 sm:mx-6 md:min-h-[272px]">
                  <ArtReplay className="relative w-full max-w-[420px]">
                    <Art />
                  </ArtReplay>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  {/* Who it's for (after Safenet's "Who is it for?"). */}
                  <p className="flex gap-2 text-small text-fg">
                    <span aria-hidden className="font-mono text-cobalt">
                      →
                    </span>
                    {p.audience}
                  </p>
                  {/* The points, typed on strips of paper. */}
                  <ul className="mt-4 flex flex-col items-start gap-2.5">
                    {p.points.map((pt, k) => (
                      <li key={pt} className={cn("strip max-w-full text-fg-muted", k % 2 === 1 && "rotate-1")}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-6">
                    <span aria-hidden className="inline-flex items-center gap-1.5 text-small font-medium text-leaf">
                      {p.id === "index" ? "Explore the indices" : "Learn more"}{" "}
                      <ArrowIcon size={13} className="transition-transform duration-fast can-hover:group-has-[a:hover]/card:translate-x-0.5" />
                    </span>
                    {p.app && (
                      // Above the stretched link, so it's its own target.
                      <a
                        href={new URL(p.app, links.app).href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta={`products_${p.id}_app`}
                        data-placement="products"
                        className="relative z-raised inline-flex items-center gap-1 rounded-full border border-subtle px-3 py-1.5 text-caption text-fg-muted transition-colors duration-fast can-hover:hover:border-leaf/40 can-hover:hover:text-fg"
                      >
                        Open in the app
                        <Icon name="external" size="sm" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </Stagger>
    </Section>
  );
}

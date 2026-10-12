import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge, BADGE_STATUS, type Tone } from "@/components/ui/Badge";
import { Stagger } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { RebalanceArt, RoutesArt, BadgeArt } from "@/components/home/products/ProductArt";
import { protocolStatus } from "@/lib/data/status";
import { cn } from "@/lib/utils";

export const products: {
  id: string;
  name: string;
  /** Who steers a Garden of this kind. */
  steer: string;
  status: { tone: Tone; label: string };
  summary: string;
  points: string[];
  /** Where the home tile goes. */
  href: string;
}[] = [
  {
    id: "index",
    name: "Index Gardens",
    steer: "The index",
    status: BADGE_STATUS.testing,
    // CRO-14: who decides what, in the site's one wording (faqs.ts, /indices).
    summary:
      "Follow a basket that rebalances itself. Components chosen by the team and approved by the DAO; weights set on-chain by market cap.",
    points: [
      "Three indices: BLOKC2, BLOKC5 and BLOKC10",
      "Market-cap weights, priced by Chainlink",
      "Pooled rebalancing, only past 2% drift",
    ],
    // Straight to the indices, one hop closer (UX-23).
    href: "/indices",
  },
  {
    id: "yield",
    name: "Yield Gardens",
    steer: "You",
    status: BADGE_STATUS.testing,
    summary: "Steer it yourself across the venues a Garden composes with.",
    points: ["Swap on Uniswap V3 and Camelot V3", "Lend and borrow on Aave V3", "Perps on GMX V2, fixed yield on Pendle V2"],
    href: "/protocol#yield",
  },
  {
    id: "gardeners",
    name: "Gardeners",
    steer: "A manager you hire",
    status: { tone: BADGE_STATUS.planned.tone, label: `${BADGE_STATUS.planned.label} · ${protocolStatus.gardeners}` },
    summary: "Hire an on-chain manager whose record anyone can verify.",
    points: [
      "Track record written to an ERC-5484 soulbound badge",
      "Trades within limits you approve; can't hold your funds",
      "Fees capped by DAO-set ceilings; revoke any time",
    ],
    href: "/protocol#gardeners",
  },
];

/** Each tile's picture of what it does. */
const art = { index: RebalanceArt, yield: RoutesArt, gardeners: BadgeArt } as const;

/**
 * The three products as a bento. Every Garden is the same wallet; the tiles
 * differ in who steers it, and each shows that in a small picture that plays
 * once: a basket drifting past its 2% band and being pulled back in one
 * pooled trade; you routing to the venues; a manager's soulbound record,
 * with access you can switch off. Index Gardens, where most people start,
 * gets a full-width dark row; the other two sit side by side beneath it.
 *
 * Each tile is one link named by its heading, with the summary as its
 * description (A11Y-31), instead of every word in the card.
 */
export function Products() {
  return (
    <Section
      id="products"
      eyebrow="What you can do"
      title={
        <>
          Three ways to <em className="text-sand">grow a Garden.</em>
        </>
      }
      description="Every Garden is the same smart wallet underneath; what changes is who steers it."
    >
      <Stagger as="ul" className="grid gap-5 md:grid-cols-2">
        {products.map((p, i) => {
          const featured = i === 0;
          const Art = art[p.id as keyof typeof art];
          const titleId = `product-${p.id}`;
          return (
            // A RevealItem that also carries the analytics id for the card link inside it.
            <li
              key={p.id}
              data-reveal-item=""
              data-cta={`products_${p.id}`}
              suppressHydrationWarning
              className={cn("h-full", featured && "md:col-span-2")}
            >
              <Card
                href={p.href}
                tone={featured ? "feature" : "default"}
                aria-labelledby={titleId}
                aria-describedby={`${titleId}-summary`}
                className={cn(
                  "flex h-full flex-col overflow-hidden p-0 sm:p-0",
                  featured && "sheen border-leaf/20 lg:grid lg:grid-cols-[1.15fr_1fr]",
                )}
              >
                <div
                  className={cn(
                    "relative flex items-center justify-center overflow-hidden border-b border-line/[0.07] px-4 py-5",
                    featured
                      ? "bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--leaf)/0.13),transparent_65%)] sm:px-10 sm:py-8 lg:border-b-0 lg:border-r"
                      : "bg-[radial-gradient(ellipse_at_30%_50%,rgb(var(--glow)/0.16),transparent_70%)]",
                  )}
                >
                  <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                  <Art className={cn("relative", featured ? "max-w-[560px]" : "max-w-[440px]")} />
                </div>
                <div className={cn("flex flex-1 flex-col p-6 sm:p-7", featured && "lg:justify-center lg:p-10")}>
                  <p className="label-caps">
                    Steered by <span className="text-leaf">{p.steer}</span>
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <h3 id={titleId} className={cn("display text-fg", featured ? "text-display-md" : "text-h3")}>
                      {p.name}
                    </h3>
                    <Badge tone={p.status.tone}>{p.status.label}</Badge>
                  </div>
                  <p id={`${titleId}-summary`} className={cn("mt-3 text-fg-muted", featured ? "text-lead" : "text-ui")}>
                    {p.summary}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-line/[0.08] pt-5 lg:flex-none">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-small text-fg-muted">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-leaf" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <span aria-hidden className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-leaf">
                    {featured ? "Explore the indices" : "Learn more"}{" "}
                    <ArrowIcon size={13} className="transition-transform duration-fast can-hover:group-hover/card:translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </li>
          );
        })}
      </Stagger>
    </Section>
  );
}

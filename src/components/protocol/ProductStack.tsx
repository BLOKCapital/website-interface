import type { CSSProperties, ReactNode } from "react";
import { products } from "@/components/home/Products";
import { RebalanceArt, RoutesArt, BadgeArt } from "@/components/home/products/ProductArt";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TermLink } from "@/components/protocol/Glossary";
import { cn } from "@/lib/utils";

/** Extra detail per product, beyond the home-page tile. */
const detail: Record<string, { body: ReactNode; more?: { label: string; href: string } }> = {
  index: {
    more: { label: "Explore BLOKC2, BLOKC5 and BLOKC10", href: "/indices" },
    body: (
      <>
        Connect your Garden to an <TermLink id="index">index</TermLink>: BLOKC2, BLOKC5 or BLOKC10. Weights are each
        component&apos;s share of market cap, priced by Chainlink. A pooled rebalancer trades only assets more than 2% off
        target, at the best quote across Uniswap and Camelot, at most once a day. Every rebalance is a transaction you can
        read.
      </>
    ),
  },
  yield: {
    body: "A Yield Garden lets you act directly across the venues the protocol composes with: swap on Uniswap V3 and Camelot V3, lend and borrow on Aave V3, take perp exposure on GMX V2, or lock fixed yield with Pendle V2.",
  },
  gardeners: {
    body: (
      <>
        A <TermLink id="gardener">Gardener</TermLink> publishes a strategy on-chain and investors authorise it from their own
        Garden, then revoke it the same way. Performance writes itself to a non-transferable ERC-5484 badge in the
        Gardener&apos;s wallet, and fees settle on-chain within DAO-set ceilings.
      </>
    ),
  },
};

/** Each card's colour, from the theme: night for the index, cobalt for yield, bronze for Gardeners. */
const look: Record<string, { card: string; art: string; accent: string; chip: string }> = {
  index: {
    card: "theme-dark border-leaf/20 bg-card",
    art: "bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--leaf)/0.14),transparent_65%)]",
    accent: "text-leaf",
    chip: "border-leaf/20 bg-leaf/6",
  },
  yield: {
    // Solid card colour under the tint: the card it slides over must not show through.
    card: "border-cobalt/20 bg-card bg-[linear-gradient(155deg,rgb(var(--cobalt)/0.09),rgb(var(--card))_55%)]",
    art: "bg-[radial-gradient(ellipse_at_40%_50%,rgb(var(--cobalt)/0.1),transparent_70%)]",
    accent: "text-cobalt",
    chip: "border-cobalt/15 bg-cobalt/5",
  },
  gardeners: {
    card: "border-sand/25 bg-card bg-[linear-gradient(155deg,rgb(var(--sand)/0.12),rgb(var(--card))_55%)]",
    art: "bg-[radial-gradient(ellipse_at_40%_50%,rgb(var(--sand)/0.12),transparent_70%)]",
    accent: "text-sand",
    chip: "border-sand/20 bg-sand/6",
  },
};

const art = { index: RebalanceArt, yield: RoutesArt, gardeners: BadgeArt } as const;

const two = (n: number) => String(n).padStart(2, "0");

/** Where each card pins on wide screens: 26px below the one before. */
const pinTop = (i: number) => 104 + i * 26;

/**
 * html's scroll-padding-top (globals.css: 88px, the sticky header) is added
 * to every anchor's scroll margin, so a marker's margin is its card's pin
 * minus that.
 */
const SCROLL_PADDING = 88;

/**
 * The three products as a deck. On wide screens each card pins near the top
 * as you reach it and the next one slides up over it; the one underneath
 * eases back (a CSS scroll timeline, see "Product stack" in globals.css) and
 * a strip of each earlier card stays visible above, so you always see where
 * you are in the three. On phones they simply stack.
 *
 * Anchors (UX-02): #index, #yield and #gardeners sit on zero-height markers
 * in the normal flow, not on the cards. A pinned card counts as already in
 * view, so after a client-side navigation from a scrolled page the browser
 * (and Next, which skips sticky targets) left the reader about 2,000px past
 * it. Each marker's scroll margin matches its card's pin, so a link lands
 * with the card exactly where it pins. The markers come after the cards in
 * the DOM, so `.pstack > :nth-child(1–3)` in globals.css still picks the
 * cards; flex `order` places each marker just before its card.
 *
 * The recede's scroll timeline is also set inline: in globals.css the
 * `animation` shorthand sits in a more specific rule than the
 * `animation-timeline` longhand and resets it to `auto`, which left the
 * first two cards stuck at their end state (scale 0.94, dimmed) on load.
 * Inline, it wins; it does nothing where that CSS doesn't animate (phones,
 * reduced motion, Pause motion, no scroll-timeline support).
 */
export function ProductStack() {
  return (
    <div className="pstack flex flex-col">
      {products.map((p, i) => {
        const d = detail[p.id];
        const l = look[p.id];
        const Art = art[p.id as keyof typeof art];
        const last = i === products.length - 1;
        return (
          <article
            key={p.id}
            aria-labelledby={`product-${p.id}`}
            className={cn(
              "relative overflow-hidden rounded-panel border shadow-e2 lg:sticky",
              last ? "mb-0" : "mb-5 lg:mb-[24vh]",
              l.card,
            )}
            style={{
              order: 2 * i + 1,
              // Below the page's section bar too, when it has one (--subnav).
              top: `calc(${pinTop(i)}px + var(--subnav, 0px))`,
              // Driven by the next card's view timeline (see above).
              animationTimeline: last ? undefined : `--pstack-${i + 2}`,
            }}
          >
            <div className="grid lg:min-h-[min(560px,calc(100svh-200px))] lg:grid-cols-12">
              <div className="flex flex-col p-6 sm:p-9 lg:col-span-7 lg:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="label-caps">
                    <span className={l.accent}>{two(i + 1)}</span> / {two(products.length)} · Steered by{" "}
                    <span className={l.accent}>{p.steer}</span>
                  </p>
                  <Badge tone={p.status.tone}>{p.status.label}</Badge>
                </div>
                <h3 id={`product-${p.id}`} className="display mt-6 text-display-md text-fg">
                  {p.name}
                </h3>
                <p className="mt-4 max-w-xl text-lead text-fg">{p.summary}</p>
                <p className="mt-4 max-w-2xl text-body text-fg-muted">{d.body}</p>
                <ul className="mt-8 grid gap-2.5 sm:grid-cols-3 lg:mt-auto lg:pt-8">
                  {p.points.map((pt) => (
                    <li key={pt} className={cn("rounded-control border p-3.5 text-small text-fg", l.chip)}>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-caption text-fg-subtle">{p.audience}</p>
                  {d.more && <ArrowLink href={d.more.href}>{d.more.label}</ArrowLink>}
                </div>
              </div>
              <div
                className={cn(
                  "relative order-first flex items-center justify-center overflow-hidden border-b border-subtle px-5 py-8 sm:px-10 lg:order-none lg:col-span-5 lg:border-b-0 lg:border-l",
                  l.art,
                )}
              >
                <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <Art className="relative max-w-[440px]" />
              </div>
            </div>
          </article>
        );
      })}
      {products.map((p, i) => (
        <span
          key={p.id}
          id={p.id}
          className="block h-0 scroll-mt-4 lg:scroll-mt-[var(--pin)]"
          style={{ order: 2 * i, "--pin": `${pinTop(i) - SCROLL_PADDING}px` } as CSSProperties}
        />
      ))}
    </div>
  );
}

import { products } from "@/components/home/Products";
import { RebalanceArt, RoutesArt, BadgeArt } from "@/components/home/products/ProductArt";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils";

/** Extra detail per product, beyond the home-page tile. */
const detail: Record<string, { body: string; audience: string; more?: { label: string; href: string } }> = {
  index: {
    audience: "For people who want diversified exposure without managing it.",
    more: { label: "Explore BLOKC2, BLOKC5 and BLOKC10", href: "/indices" },
    body: "Connect your Garden to BLOKC2, BLOKC5 or BLOKC10. Weights are each component's share of market cap, priced by Chainlink. A pooled rebalancer trades only assets more than 2% off target, at the best quote across Uniswap and Camelot, at most once a day. Every rebalance is a transaction you can read.",
  },
  yield: {
    audience: "For people who'd rather steer themselves.",
    body: "A Yield Garden lets you act directly across the venues the protocol composes with: swap on Uniswap V3 and Camelot V3, lend and borrow on Aave V3, take perp exposure on GMX V2, or lock fixed yield with Pendle V2.",
  },
  gardeners: {
    audience: "For people who want a professional, and for the professionals.",
    body: "A Gardener publishes a strategy on-chain and investors authorise it from their own Garden, then revoke it the same way. Performance writes itself to a non-transferable ERC-5484 badge in the Gardener's wallet, and fees settle on-chain within DAO-set ceilings.",
  },
};

/** Each card's colour, from the theme: night for the index, cobalt for yield, bronze for Gardeners. */
const look: Record<string, { card: string; art: string; accent: string; chip: string }> = {
  index: {
    card: "theme-dark border-leaf/20 bg-card",
    art: "bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--leaf)/0.14),transparent_65%)]",
    accent: "text-leaf",
    chip: "border-leaf/20 bg-leaf/[0.06]",
  },
  yield: {
    // Solid card colour under the tint: the card it slides over must not show through.
    card: "border-cobalt/20 bg-card bg-[linear-gradient(155deg,rgb(var(--cobalt)/0.09),rgb(var(--card))_55%)]",
    art: "bg-[radial-gradient(ellipse_at_40%_50%,rgb(var(--cobalt)/0.1),transparent_70%)]",
    accent: "text-cobalt",
    chip: "border-cobalt/15 bg-cobalt/[0.05]",
  },
  gardeners: {
    card: "border-sand/25 bg-card bg-[linear-gradient(155deg,rgb(var(--sand)/0.12),rgb(var(--card))_55%)]",
    art: "bg-[radial-gradient(ellipse_at_40%_50%,rgb(var(--sand)/0.12),transparent_70%)]",
    accent: "text-sand",
    chip: "border-sand/20 bg-sand/[0.06]",
  },
};

const art = { index: RebalanceArt, yield: RoutesArt, gardeners: BadgeArt } as const;

const two = (n: number) => String(n).padStart(2, "0");

/**
 * The three products as a deck. On wide screens each card pins near the top
 * as you reach it and the next one slides up over it; the one underneath
 * eases back (a CSS scroll timeline, see "Product stack" in globals.css) and
 * a strip of each earlier card stays visible above, so you always see where
 * you are in the three. On phones they simply stack. Each card keeps its
 * #index / #yield / #gardeners anchor for links from elsewhere.
 */
export function ProductStack() {
  return (
    <div className="pstack flex flex-col gap-5 lg:block">
      {products.map((p, i) => {
        const d = detail[p.id];
        const l = look[p.id];
        const Art = art[p.id as keyof typeof art];
        return (
          <article
            key={p.id}
            id={p.id}
            className={cn(
              "relative scroll-mt-28 overflow-hidden rounded-[28px] border shadow-[0_30px_80px_-50px_rgb(var(--shadow))] lg:sticky lg:mb-[24vh] lg:last:mb-0",
              l.card,
            )}
            style={{ top: `calc(104px + ${i * 26}px)` }}
          >
            <div className="grid lg:min-h-[min(560px,calc(100svh-200px))] lg:grid-cols-12">
              <div className="flex flex-col p-6 sm:p-9 lg:col-span-7 lg:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                    <span className={l.accent}>{two(i + 1)}</span> / {two(products.length)} · Steered by{" "}
                    <span className={l.accent}>{p.steer}</span>
                  </p>
                  <Badge tone={p.status.tone}>{p.status.label}</Badge>
                </div>
                <h3 className="display mt-6 text-[clamp(34px,2.6vw+18px,56px)] leading-[1.05] text-fg">{p.name}</h3>
                <p className="mt-4 max-w-xl text-lead text-fg">{p.summary}</p>
                <p className="mt-4 max-w-2xl text-body text-fg-muted">{d.body}</p>
                <ul className="mt-8 grid gap-2.5 sm:grid-cols-3 lg:mt-auto lg:pt-8">
                  {p.points.map((pt) => (
                    <li key={pt} className={cn("rounded-xl border p-3.5 text-small text-fg", l.chip)}>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-caption text-fg-subtle">{d.audience}</p>
                  {d.more && <ArrowLink href={d.more.href}>{d.more.label}</ArrowLink>}
                </div>
              </div>
              <div
                className={cn(
                  "relative order-first flex items-center justify-center overflow-hidden border-b border-line/[0.07] px-5 py-8 sm:px-10 lg:order-none lg:col-span-5 lg:border-b-0 lg:border-l",
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
    </div>
  );
}

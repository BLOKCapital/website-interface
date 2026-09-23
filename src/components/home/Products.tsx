import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { protocolStatus } from "@/lib/data/status";

export const products: {
  id: string;
  name: string;
  status: { tone: Tone; label: string };
  summary: string;
  points: string[];
}[] = [
  {
    id: "index",
    name: "Index Gardens",
    status: { tone: "current", label: "In testing" },
    summary: "Follow a professionally curated basket that rebalances itself.",
    points: [
      "Three indices: BLOKC2, BLOKC5 and BLOKC10",
      "Market-cap weights, priced by Chainlink",
      "Pooled rebalancing, only past 2% drift",
    ],
  },
  {
    id: "yield",
    name: "Yield Gardens",
    status: { tone: "current", label: "In testing" },
    summary: "Steer it yourself across the venues a Garden composes with.",
    points: ["Swap on Uniswap V3 and Camelot V3", "Lend and borrow on Aave V3", "Perps on GMX V2, fixed yield on Pendle V2"],
  },
  {
    id: "gardeners",
    name: "Gardeners",
    status: { tone: "soon", label: protocolStatus.gardeners },
    summary: "Hire an on-chain manager whose record anyone can verify.",
    points: [
      "Track record written to an ERC-5484 soulbound badge",
      "Trades within limits you approve; can't hold your funds",
      "Fees capped by DAO-set ceilings; revoke any time",
    ],
  },
];

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
      <Stagger as="ul" className="grid gap-5 md:grid-cols-3">
        {products.map((p) => (
          <RevealItem as="li" key={p.id} className="h-full">
            <Card href={`/protocol#${p.id}`} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <h3 className="display text-h3 text-fg">{p.name}</h3>
                <Badge tone={p.status.tone}>{p.status.label}</Badge>
              </div>
              <p className="mt-3 text-[15.5px] text-fg-muted">{p.summary}</p>
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-line/[0.08] pt-5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-small text-fg-muted">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-leaf" />
                    {pt}
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-leaf">
                Learn more <ArrowIcon size={13} className="transition-transform group-hover/card:translate-x-0.5" />
              </span>
            </Card>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}

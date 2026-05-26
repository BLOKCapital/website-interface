import { Section } from "@/components/ui/Section";
import { FeatureBlock } from "@/components/features/FeatureBlock";
import { Sparkline } from "@/components/ui/Sparkline";
import { Avatar } from "@/components/ui/Avatar";
import { SoulboundBadge } from "@/components/ui/SoulboundBadge";
import { AddressLink } from "@/components/ui/AddressLink";
import { managers } from "@/lib/data/managers";
import { presets } from "@/lib/data/sandbox";

const balanced = presets.find((p) => p.id === "balanced")!;

// Hoisted so these element objects aren't recreated on each render (the mock
// components are hoisted function declarations, so referencing them here is safe).
const indexVisual = (
  <IndexMock
    name="Balanced Index"
    allocations={balanced.allocations}
    apy={balanced.expectedApy}
  />
);
const managerProfileVisual = <ManagerProfileMock />;
const nonCustodialVisual = <NonCustodialFlow />;
const txReceiptVisual = <TxReceipt />;

export function ForInvestors() {
  return (
    <Section
      id="investors"
      eyebrow="For Investors"
      title={
        <>
          Garden{" "}
          <em className="font-serif italic text-moss">Owners.</em>
        </>
      }
      description="Open an Index Garden that rebalances itself, or a Yield Garden you steer by hand. Either way, the keys are yours."
    >
      <div className="space-y-20 lg:space-y-28">
        <FeatureBlock
          index={1}
          eyebrow="Index Gardens"
          title={
            <>
              Diversification, with{" "}
              <em className="font-serif italic text-clay">receipts.</em>
            </>
          }
          body={
            <p>
              Connect to a protocol Index, component weights are calculated
              on-chain, swaps route through Uniswap V3 with WETH as the base.
              Rebalance cadence is set by the DAO. Open with a minimal amount.
            </p>
          }
          visual={indexVisual}
        />

        <FeatureBlock
          reverse
          index={2}
          eyebrow="Yield Gardens & Gardeners"
          title={
            <>
              Go manual.{" "}
              <em className="font-serif italic text-moss">
                Or hire a Gardener.
              </em>
            </>
          }
          body={
            <p>
              A Yield Garden lets you swap on Uniswap V3 and Camelot V3, lend
              and borrow on Aave V3, take perp exposure via GMX V2, or chase
              fixed yield with Pendle V2, all yourself. Prefer a pro? Hire a
              Gardener whose reputation is written to an ERC-5484 soulbound
              badge, they can&apos;t hold your funds.
            </p>
          }
          visual={managerProfileVisual}
        />

        <FeatureBlock
          index={3}
          eyebrow="Always self-custodial"
          title={
            <>
              Keys never leave{" "}
              <em className="font-serif italic text-moss">your wallet.</em>
            </>
          }
          body={
            <p>
              Every Garden lives at your address. We can&apos;t move it, freeze
              it, or migrate it without your signature. We don&apos;t have an
              admin key. There&apos;s no admin key.
            </p>
          }
          visual={nonCustodialVisual}
        />

        <FeatureBlock
          reverse
          index={4}
          eyebrow="Transparent performance"
          title={
            <>
              Performance,{" "}
              <em className="font-serif italic text-clay">posted publicly.</em>
            </>
          }
          body={
            <p>
              Every action is a public receipt. You can read your Garden&apos;s
              full history from any block explorer, including the
              manager&apos;s, including ours.
            </p>
          }
          visual={txReceiptVisual}
        />
      </div>
    </Section>
  );
}

/* ---------- mocks ---------------------------------------------------------- */

function IndexMock({
  name,
  allocations,
  apy,
}: {
  name: string;
  allocations: { symbol: string; pct: number; color: string }[];
  apy: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="script text-[18px] leading-none text-clay">i.</span>
          <p className="eyebrow text-moss">{name}</p>
        </div>
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
          Expected APY · {apy}
        </p>
      </div>

      <ul className="mt-6 space-y-3.5">
        {allocations.map((a) => (
          <li key={a.symbol} className="flex items-center gap-3">
            <span
              className="size-1.5 rounded-full"
              style={{ background: a.color }}
            />
            <span className="w-14 text-[13px] font-medium text-ink">
              {a.symbol}
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${a.pct}%`,
                  background: a.color,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="mono w-10 text-right text-[12px] text-ink">
              {a.pct}%
            </span>
          </li>
        ))}
      </ul>

      <div aria-hidden className="rule-hand mt-7" />
      <p className="mt-3 text-[11.5px] leading-relaxed text-ink-subtle">
        Rebalanced by DAO-set cadence · minimal entry
      </p>
    </div>
  );
}

function ManagerProfileMock() {
  const m = managers[0];
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar initials={m.name.slice(0, 2).toUpperCase()} size={48} />
        <div className="flex-1">
          <p className="text-[15px] font-medium text-ink">{m.name}</p>
          <AddressLink address={m.address} />
        </div>
        <SoulboundBadge score={m.reputation} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Kpi label="AUM" value={`$${(m.aum / 1_000_000).toFixed(2)}M`} />
        <Kpi label="Trades" value={`${m.trades}`} />
        <Kpi
          label="ROI 24h"
          value={`+${m.roi24h.toFixed(2)}%`}
          tone="moss"
        />
      </div>

      <div className="mt-5">
        <p className="eyebrow text-moss">Trailing 14 periods</p>
        <Sparkline
          values={m.spark}
          width={400}
          height={50}
          className="mt-2 w-full"
        />
      </div>
    </div>
  );
}

function NonCustodialFlow() {
  return (
    <div>
      <p className="eyebrow text-moss">Flow · Your wallet → Diamond</p>

      <svg
        viewBox="0 0 480 220"
        className="mt-4 h-[210px] w-full"
        aria-hidden
      >
        <defs>
          <marker
            id="arrow-moss"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 Z" fill="rgb(var(--moss-deep))" />
          </marker>
        </defs>

        {/* Wallet */}
        <g>
          <rect
            x="20"
            y="80"
            width="120"
            height="60"
            rx="10"
            fill="rgb(var(--paper))"
            stroke="rgb(var(--ink) / 0.12)"
          />
          <text
            x="80"
            y="106"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill="rgb(var(--ink))"
          >
            Your wallet
          </text>
          <text
            x="80"
            y="124"
            textAnchor="middle"
            fontSize="10"
            fill="rgb(var(--ink) / 0.55)"
          >
            EOA / Smart account
          </text>
        </g>

        {/* Middle column */}
        <g>
          {[
            { y: 40, label: "Approve" },
            { y: 100, label: "Sign action" },
            { y: 160, label: "Withdraw" },
          ].map((row) => (
            <g key={row.label}>
              <rect
                x="180"
                y={row.y}
                width="120"
                height="40"
                rx="10"
                fill="rgb(var(--paper-deep))"
                stroke="rgb(var(--ink) / 0.10)"
              />
              <text
                x="240"
                y={row.y + 24}
                textAnchor="middle"
                fontSize="11"
                fill="rgb(var(--ink) / 0.7)"
              >
                {row.label}
              </text>
            </g>
          ))}
          <line
            x1="140"
            y1="100"
            x2="180"
            y2="60"
            stroke="rgb(var(--moss-deep))"
            strokeWidth="1.4"
            markerEnd="url(#arrow-moss)"
          />
          <line
            x1="140"
            y1="110"
            x2="180"
            y2="120"
            stroke="rgb(var(--moss-deep))"
            strokeWidth="1.4"
            markerEnd="url(#arrow-moss)"
          />
          <line
            x1="140"
            y1="120"
            x2="180"
            y2="180"
            stroke="rgb(var(--moss-deep))"
            strokeWidth="1.4"
            markerEnd="url(#arrow-moss)"
          />
        </g>

        {/* Diamond */}
        <g>
          <rect
            x="340"
            y="80"
            width="120"
            height="60"
            rx="10"
            fill="none"
            stroke="rgb(var(--clay))"
            strokeWidth="1.4"
            strokeDasharray="4 3"
          />
          <text
            x="400"
            y="106"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill="rgb(var(--clay-deep))"
          >
            Diamond
          </text>
          <text
            x="400"
            y="124"
            textAnchor="middle"
            fontSize="10"
            fill="rgb(var(--ink) / 0.55)"
          >
            No custody
          </text>
          <line
            x1="300"
            y1="60"
            x2="340"
            y2="100"
            stroke="rgb(var(--moss-deep))"
            strokeWidth="1.4"
            markerEnd="url(#arrow-moss)"
          />
          <line
            x1="300"
            y1="120"
            x2="340"
            y2="120"
            stroke="rgb(var(--moss-deep))"
            strokeWidth="1.4"
            markerEnd="url(#arrow-moss)"
          />
        </g>
      </svg>

      <p className="mt-4 text-[11.5px] leading-relaxed text-ink-subtle">
        Every step is your signature. The Diamond never holds the keys.
      </p>
    </div>
  );
}

function TxReceipt() {
  const lines = [
    { k: "from", v: "0x9F7c…Be21" },
    { k: "to", v: "GardenDiamond" },
    { k: "function", v: "rebalance(Balanced)" },
    { k: "input", v: "+0.34 ETH · -1,420 USDC" },
    { k: "block", v: "245,901,221" },
    { k: "gas", v: "204,118 (≈$0.04)" },
    { k: "tx", v: "0x8a4f…f4c2" },
  ];
  return (
    <div className="rounded-xl border border-ink/10 bg-paper-deep/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-3">
        <p className="eyebrow text-moss">Transaction receipt</p>
        <p className="script text-[18px] leading-none text-clay">№ 245,901,221</p>
      </div>
      <ul className="mt-3 space-y-1.5 font-mono text-[12px]">
        {lines.map((l) => (
          <li key={l.k} className="flex items-baseline justify-between gap-4">
            <span className="text-ink-muted">{l.k}</span>
            <span className="text-ink">{l.v}</span>
          </li>
        ))}
      </ul>
      <div aria-hidden className="rule-hand mt-4" />
      <p className="mt-3 text-[11px] leading-relaxed text-ink-subtle">
        Same receipt your block explorer prints, nothing private, nothing
        hidden.
      </p>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "moss";
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-paper/60 p-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p
        className={`mono mt-1 text-[12px] ${tone === "moss" ? "text-moss-deep" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}

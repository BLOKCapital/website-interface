import { Section } from "@/components/ui/Section";
import { FeatureBlock } from "@/components/features/FeatureBlock";

// Hoisted so these element objects aren't recreated on each render (the mock
// components are hoisted function declarations, so referencing them here is safe).
const diamondVisual = <DiamondDiagram />;
const repoVisual = <RepoMock />;
const ecosystemVisual = <EcosystemBadges />;

export function ForBuilders() {
  return (
    <Section
      id="builders"
      eyebrow="For Builders"
      title={
        <>
          Compose with{" "}
          <em className="font-serif italic text-moss">anything.</em>
        </>
      }
      description="Read the contracts. Fork the front-end. Extend it where you need to."
    >
      <div className="space-y-20 lg:space-y-28">
        <FeatureBlock
          index={1}
          eyebrow="Diamond proxy"
          title={
            <>
              One contract,{" "}
              <em className="font-serif italic text-clay">many facets.</em>
            </>
          }
          body={
            <p>
              EIP-2535 lets us add capabilities without migrating storage. Build
              a new Garden type or strategy primitive, plug it in as a facet.
            </p>
          }
          visual={diamondVisual}
        />
        <FeatureBlock
          reverse
          index={2}
          eyebrow="Open contracts"
          title={
            <>
              <em className="font-serif italic text-moss">MIT licensed.</em>{" "}
              On GitHub.
            </>
          }
          body={
            <p>
              The protocol doesn&apos;t depend on us being here. Read what runs
              in production. Re-deploy a fork with your own treasury.
            </p>
          }
          visual={repoVisual}
        />
        <FeatureBlock
          index={3}
          eyebrow="Composable with the ecosystem"
          title={
            <>
              ERC-4337 ·{" "}
              <em className="font-serif italic text-clay">5484</em> · 7702
            </>
          }
          body={
            <p>
              Account abstraction, soulbound reputation, EOA delegation. We
              don&apos;t reinvent, we adopt the standards the rest of the
              ecosystem moves on.
            </p>
          }
          visual={ecosystemVisual}
        />
      </div>
    </Section>
  );
}

/* ---------- mocks ---------------------------------------------------------- */

function DiamondDiagram() {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="eyebrow text-moss">EIP-2535 · Diamond</p>
        <span className="text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
          One proxy · Many facets
        </span>
      </div>

      <svg
        viewBox="0 0 480 240"
        className="mt-3 h-[210px] w-full"
        aria-hidden
      >
        <polygon
          points="240,30 360,120 240,210 120,120"
          fill="rgb(var(--moss) / 0.06)"
          stroke="rgb(var(--moss-deep))"
          strokeWidth="1.4"
        />
        <polygon
          points="240,60 330,120 240,180 150,120"
          fill="none"
          stroke="rgb(var(--moss-deep) / 0.55)"
          strokeWidth="1.4"
        />
        <text
          x="240"
          y="118"
          textAnchor="middle"
          fontSize="13"
          fontWeight="500"
          fill="rgb(var(--ink))"
        >
          Diamond
        </text>
        <text
          x="240"
          y="132"
          textAnchor="middle"
          fontSize="10"
          fill="rgb(var(--ink) / 0.55)"
        >
          one address
        </text>

        {[
          { x: 60, y: 50, l: "VaultFacet" },
          { x: 60, y: 190, l: "RepFacet" },
          { x: 420, y: 50, l: "IndexFacet" },
          { x: 420, y: 190, l: "FeeFacet" },
        ].map((f) => (
          <g key={f.l}>
            <line
              x1="240"
              y1="120"
              x2={f.x}
              y2={f.y}
              stroke="rgb(var(--ink) / 0.18)"
              strokeDasharray="3 3"
            />
            <rect
              x={f.x - 48}
              y={f.y - 13}
              width="96"
              height="26"
              rx="6"
              fill="rgb(var(--paper))"
              stroke="rgb(var(--ink) / 0.12)"
            />
            <text
              x={f.x}
              y={f.y + 4}
              textAnchor="middle"
              fontSize="11"
              fill="rgb(var(--ink) / 0.75)"
            >
              {f.l}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RepoMock() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[12.5px] text-ink-muted">
          <span className="text-moss-deep">github.com</span>
          /blokcapital/protocol
        </p>
        <span className="rounded-full border border-clay/35 bg-clay/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-clay-deep">
          Solidity 0.8.26
        </span>
      </div>

      <ul className="mt-4 space-y-1.5 rounded-xl border border-ink/10 bg-paper-deep/60 p-4 font-mono text-[12.5px] text-ink-muted">
        <li>contracts/Diamond.sol</li>
        <li>
          contracts/facets/
          <span className="text-moss-deep">VaultFacet.sol</span>
        </li>
        <li>
          contracts/facets/
          <span className="text-moss-deep">IndexFacet.sol</span>
        </li>
        <li>
          contracts/facets/
          <span className="text-moss-deep">RepFacet.sol</span>
        </li>
        <li>
          contracts/facets/
          <span className="text-moss-deep">FeeFacet.sol</span>
        </li>
        <li>
          test/<span className="text-clay-deep">…</span>
        </li>
      </ul>

      <p className="mt-4 text-[11.5px] leading-relaxed text-ink-subtle">
        MIT · ★ 1.4k · 18 contributors
      </p>
    </div>
  );
}

function EcosystemBadges() {
  const items = [
    { erc: "ERC-20", note: "Token standard" },
    { erc: "ERC-4337", note: "Account abstraction" },
    { erc: "ERC-5484", note: "Soulbound (consensual)" },
    { erc: "EIP-2535", note: "Diamond proxy" },
    { erc: "EIP-7702", note: "EOA delegation" },
  ];
  return (
    <div>
      <p className="eyebrow text-moss">Standards we adopt</p>
      <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.map((i) => (
          <li
            key={i.erc}
            className="flex items-center justify-between rounded-lg border border-ink/10 bg-paper/60 px-3 py-2.5 transition-colors hover:border-moss/35"
          >
            <span className="mono text-[12px] text-moss-deep">{i.erc}</span>
            <span className="text-[11.5px] text-ink-muted">{i.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

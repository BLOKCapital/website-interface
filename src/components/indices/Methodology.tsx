import { methodology, sources } from "@/lib/data/indices";
import { PlusIcon, ExternalIcon } from "@/components/ui/icons";
import { Stagger, RevealItem } from "@/components/ui/Reveal";

const Disclosure = ({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) => (
  <details className="group rounded-2xl border border-line/[0.08] bg-card open:bg-card">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
      <span>
        <span className="block text-small font-medium text-fg">{label}</span>
        <span className="block text-caption text-fg-subtle">{hint}</span>
      </span>
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/15 text-fg-muted transition-transform duration-300 group-open:rotate-45 group-open:text-leaf">
        <PlusIcon />
      </span>
    </summary>
    <div className="border-t border-line/[0.07] px-5 pb-5 pt-4">{children}</div>
  </details>
);

const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[11.5px] text-fg-subtle transition-colors hover:text-leaf">
    {children}
    <ExternalIcon size={10} />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/**
 * How every BLOKC index is weighted, in three depths: four plain steps,
 * then the guardrails with the contract that enforces each, then the
 * source files. All three indices share one method; only the components differ.
 */
export function Methodology() {
  return (
    <div className="space-y-4">
      <Stagger as="ol" className="grid gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-2 lg:grid-cols-4">
        {methodology.steps.map((s, i) => (
          <RevealItem as="li" key={s.title} className="bg-card p-5">
            <p className="font-mono text-[11.5px] text-leaf">0{i + 1}</p>
            <p className="mt-3 text-h4 font-medium text-fg">{s.title}</p>
            <p className="mt-2 text-small text-fg-muted">{s.body}</p>
          </RevealItem>
        ))}
      </Stagger>

      <div className="rounded-2xl border border-line/[0.08] bg-canvas/60 px-5 py-4">
        <p className="text-caption text-fg-subtle">The formula, as the contract computes it</p>
        <p className="mt-1.5 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-fg">{methodology.formula}</p>
      </div>

      <Disclosure label="Guardrails" hint="The limits the contracts enforce, and why each exists">
        <dl className="divide-y divide-line/[0.06]">
          {methodology.guardrails.map((g) => (
            <div key={g.k} className="grid gap-1 py-3 sm:grid-cols-[180px_120px_1fr] sm:gap-4">
              <dt className="text-small text-fg">{g.k}</dt>
              <dd className="font-mono text-small text-leaf tabular">{g.v}</dd>
              <dd className="text-small text-fg-muted">
                {g.why} <Src href={g.where}>{g.where.split("/").pop()}</Src>
              </dd>
            </div>
          ))}
        </dl>
      </Disclosure>

      <Disclosure label="Technical details" hint="Who calls what, and where the code lives">
        <ul className="space-y-3 text-small text-fg-muted">
          <li>
            <span className="text-fg">Weights</span> are computed by the <code className="font-mono text-[12.5px] text-fg">MarketCapWeighted</code>{" "}
            strategy and stored on each <code className="font-mono text-[12.5px] text-fg">Index</code> contract. Its{" "}
            <code className="font-mono text-[12.5px] text-fg">rebalance()</code> is permissionless, rate-limited to once an hour.{" "}
            <Src href={sources.index}>Index.sol</Src>
          </li>
          <li>
            <span className="text-fg">Prices</span> come through the <code className="font-mono text-[12.5px] text-fg">IndexComponentRegistry</code>,
            which wraps each Chainlink feed with staleness and deviation checks. <Src href={sources.componentRegistry}>IndexComponentRegistry.sol</Src>
          </li>
          <li>
            <span className="text-fg">Trades</span> run through the pooled <code className="font-mono text-[12.5px] text-fg">Rebalancer</code>: every Garden on an
            index is rebalanced in one batch. It quotes each registered pool (Uniswap V2 and V3, Camelot V2 and V3) and takes the best
            output, routing through USDC when there&apos;s no direct pool. Anyone can trigger it once the cooldown passes; the
            open-source keeper does it automatically. <Src href={sources.rebalancer}>Rebalancer.sol</Src> <Src href={sources.keeper}>worker-solver</Src>
          </li>
          <li>
            <span className="text-fg">New indices</span> are deployed through the <code className="font-mono text-[12.5px] text-fg">IndexFactory</code> and need
            DAO approval before a Garden can use them. <Src href={sources.docsIndexGarden}>Index Garden docs</Src>
          </li>
          <li className="text-caption text-fg-subtle">
            The docs describe the index architecture as preliminary: constants and routing may change before launch.{" "}
            <Src href={sources.docsGardenIndex}>Garden Indices docs</Src>
          </li>
        </ul>
      </Disclosure>
    </div>
  );
}

import Link from "next/link";
import { methodology, sources } from "@/lib/data/indices";
import { PlusIcon, ExternalIcon } from "@/components/ui/icons";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { IndexMachine } from "@/components/iso/IndexMachine";

const Disclosure = ({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) => (
  <details className="group rounded-card border border-subtle bg-card open:bg-card">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
      <span>
        <span className="block text-small font-medium text-fg">{label}</span>
        <span className="block text-caption text-fg-subtle">{hint}</span>
      </span>
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/15 text-fg-muted transition-transform duration-300 group-open:rotate-45 group-open:text-leaf">
        <PlusIcon />
      </span>
    </summary>
    <div className="border-t border-subtle px-5 pb-5 pt-4">{children}</div>
  </details>
);

const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-label text-fg-subtle transition-colors hover:text-leaf">
    {children}
    <ExternalIcon size={10} />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/**
 * The formula as a short block that wraps only at its operators (MOB-08,
 * A11Y-13): one line per equation ("·" in the data separates them), each
 * operand kept whole, so nothing scrolls sideways at any width.
 */
function Formula({ text }: { text: string }) {
  const lines = text.split("·").map((l) => l.trim());
  return (
    <p className="mt-1.5 space-y-1 font-mono text-caption text-fg">
      {lines.map((line, i) => (
        <span key={line} className="block">
          {i > 0 && <span className="sr-only">; </span>}
          {line.split(/ (?=[=÷×] )/).map((part, j) => (
            <span key={j}>
              {j > 0 && " "}
              <span className="whitespace-nowrap">{part}</span>
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}

/**
 * How every one of the BLOK Capital indices is weighted, in three depths:
 * four plain steps, then the guardrails with the contract that enforces
 * each, then the source files. All three indices share one method; only
 * the components differ.
 */
export function Methodology() {
  return (
    <div className="space-y-4">
      {/* Fig 2: the four steps below, as a working machine. */}
      <IndexMachine className="mb-6" />
      <Stagger as="ol" className="grid gap-px overflow-hidden rounded-card border border-subtle bg-line/8 sm:grid-cols-2 lg:grid-cols-4">
        {methodology.steps.map((s, i) => (
          <RevealItem as="li" key={s.title} className="bg-card p-5">
            <p className="font-mono text-label text-leaf">0{i + 1}</p>
            <p className="mt-3 text-h4 font-medium text-fg">{s.title}</p>
            <p className="mt-2 text-small text-fg-muted">{s.body}</p>
          </RevealItem>
        ))}
      </Stagger>

      <div className="rounded-card border border-subtle bg-canvas/60 px-5 py-4">
        <p className="text-caption text-fg-subtle">The formula, as the contract computes it</p>
        <Formula text={methodology.formula} />
      </div>

      <Disclosure label="Guardrails" hint="The limits the contracts enforce, and why each exists">
        <dl className="divide-y divide-subtle">
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
            <span className="text-fg">Weights</span> are computed by the <code className="font-mono text-caption text-fg">MarketCapWeighted</code>{" "}
            strategy and stored on each <code className="font-mono text-caption text-fg">Index</code> contract. Its{" "}
            <code className="font-mono text-caption text-fg">rebalance()</code> is permissionless, rate-limited to once an hour.{" "}
            <Src href={sources.index}>Index.sol</Src>
          </li>
          <li>
            <span className="text-fg">Prices</span> come through the <code className="font-mono text-caption text-fg">IndexComponentRegistry</code>,
            which wraps each Chainlink feed with staleness and deviation checks. <Src href={sources.componentRegistry}>IndexComponentRegistry.sol</Src>
          </li>
          <li>
            <span className="text-fg">Trades</span> run through the pooled <code className="font-mono text-caption text-fg">Rebalancer</code>: every Garden on an
            index is rebalanced in one batch. It quotes each registered pool (Uniswap V2 and V3, Camelot V2 and V3) and takes the best
            output, routing through USDC when there&apos;s no direct pool. Anyone can trigger it once the cooldown passes; the
            open-source keeper does it automatically. <Src href={sources.rebalancer}>Rebalancer.sol</Src> <Src href={sources.keeper}>worker-solver</Src>
          </li>
          <li>
            <span className="text-fg">New indices</span> are deployed through the <code className="font-mono text-caption text-fg">IndexFactory</code> and need{" "}
            <Link href="/governance" className="rounded-xs text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf">
              DAO approval
            </Link>{" "}
            before a Garden can use them. <Src href={sources.docsIndexGarden}>Index Garden docs</Src>
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

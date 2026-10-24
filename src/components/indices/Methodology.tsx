import { methodology, sources } from "@/lib/data/indices";
import { ExternalIcon } from "@/components/ui/icons";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { IndexMachine } from "@/components/iso/IndexMachine";

const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-leaf transition-colors can-hover:hover:text-fg">
    {children}
    <ExternalIcon size={12} />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/**
 * How every BLOK Capital index is weighted, as a first visit needs it: the
 * four steps as a working machine (Fig 2), the same four in plain words,
 * and where to read further. The formula, the guardrails and the contracts
 * behind them live in the docs (and in methodology.guardrails, which the
 * compare table and llms.txt read). All three indices share one method.
 */
export function Methodology() {
  return (
    <div className="space-y-4">
      {/* Fig 2: the four steps below, as a working machine. */}
      <IndexMachine className="mb-6" />
      <Stagger as="ol" className="grid gap-px overflow-hidden rounded-card border border-subtle bg-line/8 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {methodology.steps.map((s, i) => (
          <RevealItem as="li" key={s.title} className="bg-card p-5">
            <p className="font-mono text-label text-cobalt">0{i + 1}</p>
            <p className="mt-3 text-h4 font-bold tracking-tight text-fg">{s.title}</p>
            <p className="mt-2 text-small text-fg-muted">{s.body}</p>
          </RevealItem>
        ))}
      </Stagger>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-small text-fg-muted">
        The limits the contracts enforce, and the code behind them:
        <Src href={sources.docsIndexGarden}>Index Gardens, in the docs</Src>
        <Src href={sources.docsRebalancer}>Rebalancing, in the docs</Src>
      </p>
    </div>
  );
}

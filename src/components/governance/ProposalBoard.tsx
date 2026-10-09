import type { CSSProperties } from "react";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalIcon } from "@/components/ui/icons";
import { CountUp } from "@/components/motion/CountUp";
import type { GovernanceSnapshot, ProposalView } from "@/lib/data/proposals";
import { links } from "@/lib/data/socials";
import { protocolStatus } from "@/lib/data/status";
import { ARBISCAN } from "@/lib/live/rpc";
import { cn, shortAddress } from "@/lib/utils";

const two = (n: number) => String(n).padStart(2, "0");
const pctLabel = (n: number) => `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%`;

/** A labelled meter. The fill grows in when its card reveals (globals.css, "Meters"). */
function Meter({ label, value, tone = "leaf", large }: { label: string; value: number; tone?: "leaf" | "cobalt"; large?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{label}</span>
        <span className={cn("font-mono tabular text-fg", large ? "text-[22px]" : "text-[13px]")}>{pctLabel(value)}</span>
      </div>
      <div className={cn("mt-2 overflow-hidden rounded-full bg-line/[0.1]", large ? "h-2" : "h-1.5")} role="img" aria-label={`${label} ${pctLabel(value)}`}>
        <div
          className={cn("meter-fill h-full origin-left rounded-full", tone === "leaf" ? "bg-leaf" : "bg-cobalt")}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` } as CSSProperties}
        />
      </div>
    </div>
  );
}

function Status({ p }: { p: ProposalView }) {
  return <Badge tone={p.active ? "live" : p.passing ? "done" : "neutral"}>{p.active ? "Voting open" : p.statusLabel}</Badge>;
}

const window_ = (p: ProposalView) =>
  p.startLabel && p.endLabel ? `${p.startLabel} → ${p.endLabel}` : p.endLabel ? `${p.active ? "Ends" : "Ended"} ${p.endLabel}` : "";

/** The newest proposal, in full. */
function Featured({ p, n }: { p: ProposalView; n: number }) {
  return (
    <article className="theme-dark relative flex h-full flex-col overflow-hidden rounded-[28px] border border-leaf/20 bg-card p-6 sm:p-8">
      <div aria-hidden className="glow-leaf pointer-events-none absolute -right-28 -top-28 size-96 opacity-80" />
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_85%_0%,black,transparent_65%)]" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
          Latest · Proposal <span className="text-leaf">{two(n)}</span>
        </p>
        <Status p={p} />
      </div>

      <h3 className="display relative mt-5 text-[clamp(24px,1.6vw+16px,34px)] leading-tight text-fg">{p.title}</h3>
      {/* Summaries can hold raw addresses: let them wrap anywhere. */}
      {p.summary && (
        <p className="relative mt-3 line-clamp-3 max-w-2xl whitespace-pre-line text-small text-fg-muted [overflow-wrap:anywhere]">{p.summary}</p>
      )}

      <div className="relative mt-7 grid gap-5 sm:grid-cols-2">
        <Meter label="Support" value={p.forPct} large />
        <Meter label="Turnout" value={p.turnoutPct} tone="cobalt" large />
      </div>

      <dl className="relative mt-7 grid gap-4 border-t border-line/[0.08] pt-5 text-small sm:grid-cols-2">
        {window_(p) && (
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">Voting window</dt>
            <dd className="mt-1 text-fg">{window_(p)}</dd>
          </div>
        )}
        {p.creator && (
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">Proposed by</dt>
            <dd className="mt-1">
              <a
                href={`${ARBISCAN}/address/${p.creator}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-fg transition-colors hover:text-leaf"
              >
                {shortAddress(p.creator)} <ExternalIcon size={11} />
                <span className="sr-only"> (view on Arbiscan, opens in a new tab)</span>
              </a>
            </dd>
          </div>
        )}
      </dl>

      <div className="relative mt-auto pt-7">
        <Button href={links.aragon} size="md">
          Read it on Aragon <ExternalIcon />
        </Button>
      </div>
    </article>
  );
}

/** An earlier proposal: the whole card opens Aragon. */
function Compact({ p, n }: { p: ProposalView; n: number }) {
  return (
    <a
      href={links.aragon}
      target="_blank"
      rel="noopener noreferrer"
      className="group/p flex h-full flex-col rounded-[24px] border border-line/[0.08] bg-card p-5 transition-[border-color,transform,box-shadow] duration-base ease-expo hover:-translate-y-0.5 hover:border-leaf/30 hover:shadow-[0_18px_40px_-28px_rgb(var(--shadow))] sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Proposal {two(n)}</span>
        <Status p={p} />
      </div>
      <h3 className="mt-3 text-[16.5px] font-medium leading-snug text-fg [overflow-wrap:anywhere]">{p.title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Meter label="Support" value={p.forPct} />
        <Meter label="Turnout" value={p.turnoutPct} tone="cobalt" />
      </div>
      <p className="mt-auto flex items-center justify-between gap-3 pt-4 text-caption text-fg-subtle">
        <span>{window_(p)}</span>
        <span className="inline-flex items-center gap-1 font-medium text-leaf">
          Aragon <ExternalIcon size={11} className="transition-transform group-hover/p:-translate-y-0.5 group-hover/p:translate-x-0.5" />
        </span>
      </p>
      <span className="sr-only"> (opens on Aragon in a new tab)</span>
    </a>
  );
}

/**
 * The DAO's proposals, from the build-time governance snapshot: a summary
 * strip, the newest proposal in full (support, turnout, voting window, who
 * proposed it) and the earlier ones as compact cards. Everything opens the
 * DAO on Aragon, where the votes themselves live. No browser RPC, so it
 * never shows a failure state to visitors.
 */
export function ProposalBoard({ governance }: { governance: GovernanceSnapshot }) {
  const list = governance.proposals;
  const total = list.length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-[28px] border border-dashed border-line/15 p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-body text-fg-muted">
          Every proposal, vote and execution is public on Aragon, the DAO&apos;s on-chain home.
        </p>
        <Button href={links.aragon}>
          Open the DAO on Aragon <ExternalIcon />
        </Button>
      </div>
    );
  }

  const executed = list.filter((p) => p.statusLabel === "Executed").length;
  const avg = (k: "forPct" | "turnoutPct") => list.reduce((s, p) => s + p[k], 0) / total;
  const stats = [
    { k: "Proposals", v: <CountUp value={total} /> },
    { k: "Executed", v: <CountUp value={executed} /> },
    { k: "Avg. support", v: pctLabel(Math.round(avg("forPct") * 10) / 10) },
    { k: "Avg. turnout", v: pctLabel(Math.round(avg("turnoutPct") * 10) / 10) },
  ];
  const [latest, ...earlier] = list;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="flex flex-col gap-5 rounded-[24px] border border-line/[0.08] bg-card p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:gap-x-12">
          {stats.map((s) => (
            <div key={s.k}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{s.k}</dt>
              <dd className="display mt-1 text-[28px] leading-none text-fg tabular">{s.v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <Button href={links.aragon} variant="secondary">
            All proposals on Aragon <ExternalIcon />
          </Button>
          <p className="text-caption text-fg-subtle">Core members vote until $BLOKC launches ({protocolStatus.token}).</p>
        </div>
      </div>

      {/* Latest in full, earlier ones beside it */}
      <Stagger className="grid gap-5 lg:grid-cols-12">
        <RevealItem className={cn("min-w-0", earlier.length ? "lg:col-span-7" : "lg:col-span-12")}>
          <Featured p={latest} n={total} />
        </RevealItem>
        {earlier.length > 0 && (
          <div className="grid min-w-0 gap-5 lg:col-span-5">
            {earlier.map((p, i) => (
              <RevealItem key={p.id} className="min-w-0">
                <Compact p={p} n={total - 1 - i} />
              </RevealItem>
            ))}
          </div>
        )}
      </Stagger>
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { SplitText } from "@/components/motion/SplitText";
import type { GovernanceSnapshot, ProposalView } from "@/lib/data/proposals";

const pctLabel = (n: number) => `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%`;

/** One status per proposal, in the site's badge vocabulary (CRO-27). */
function Status({ p }: { p: ProposalView }) {
  if (p.active) return <Badge status="voting" />;
  return <Badge tone={p.passing ? "done" : "neutral"}>{p.statusLabel}</Badge>;
}

/**
 * Home: the DAO's record as a compact strip (D-08e, UX-07): the counts, the
 * latest proposal's title and status, and when the snapshot was read from
 * chain, then "All proposals" on /governance, where the full board lives.
 * Read at build time, so visitors never see a loading or failure state; if
 * the read failed, the strip still points to the record.
 */
export function HappeningNow({ governance }: { governance: GovernanceSnapshot }) {
  const list = governance.proposals;
  const total = list.length;
  const latest = list[0];
  const executed = list.filter((p) => p.statusLabel === "Executed").length;
  const avg = (k: "forPct" | "turnoutPct") => pctLabel(Math.round((list.reduce((s, p) => s + p[k], 0) / Math.max(total, 1)) * 10) / 10);
  const stats = [
    { k: "Proposals", v: String(total) },
    { k: "Executed", v: String(executed) },
    { k: "Avg. support", v: avg("forPct") },
    { k: "Avg. turnout", v: avg("turnoutPct") },
  ];

  return (
    <section id="now" className="relative border-y border-subtle bg-surface py-section-sm">
      <CornerMarks />
      <Container className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Governance on-chain</p>
          <SplitText className="display mt-4 text-h2 text-balance text-fg">
            Every change, <em className="text-sand">on the record.</em>
          </SplitText>
          <p className="mt-4 max-w-md text-ui text-fg-muted">
            Every change to the protocol is a proposal the DAO votes on with Aragon, on Arbitrum.
          </p>
          <Link
            href="/governance#proposals"
            prefetch={false}
            data-cta="now_all_proposals"
            className="group/now mt-5 inline-flex items-center gap-1.5 rounded-xs py-2 text-ui font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg"
          >
            All proposals
            <Icon name="arrow-right" size="sm" className="transition-transform duration-fast can-hover:group-hover/now:translate-x-0.5" />
          </Link>
        </div>

        <div className="rounded-panel border border-subtle bg-card p-pad-card lg:col-span-7">
          {latest ? (
            <>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.k}>
                    <dt className="label-caps">{s.k}</dt>
                    <dd className="display mt-1 text-display-sm leading-none text-fg tabular">{s.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 border-t border-subtle pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="label-caps">Latest proposal</p>
                  <Status p={latest} />
                </div>
                <p className="mt-2 text-h4 font-medium text-fg [overflow-wrap:anywhere]">{latest.title}</p>
                {governance.syncedLabel && (
                  <p className="mt-3 text-caption text-fg-subtle">As of {governance.syncedLabel}</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-body text-fg-muted">
              Every proposal, vote and execution is public on Aragon, the DAO&apos;s on-chain home.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

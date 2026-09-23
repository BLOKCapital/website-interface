"use client";

import { useRef } from "react";
import { useLive } from "@/lib/live/useLive";
import { readActivity, type ActivityEvent } from "@/lib/live/activity";
import { ARBISCAN } from "@/lib/live/rpc";
import { shortAddress, cn } from "@/lib/utils";
import { LiveStatus } from "./LiveStatus";
import { ExternalIcon } from "@/components/ui/icons";

const timeFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const clockFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" });
const options: Record<number, string> = { 1: "abstain", 2: "yes", 3: "no" };
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function describe(e: ActivityEvent, titles: Record<string, string>) {
  const title = e.proposal ? titles[e.proposal] : undefined;
  const which = title ? `“${title}”` : "a proposal";
  switch (e.kind) {
    case "proposal":
      return { verb: "Proposal opened", text: `${shortAddress(e.actor ?? "")} put ${which} to a vote.` };
    case "vote":
      return {
        verb: `Voted ${options[e.option ?? 0] ?? ""}`.trim(),
        text: `${shortAddress(e.actor ?? "")} voted ${options[e.option ?? 0] ?? ""} on ${which} with ${compact.format(e.power ?? 0)} $BLOKC of voting power.`,
      };
    case "passed":
      return { verb: "Proposal executed", text: `${title ? which : "The proposal"} passed and its actions ran on-chain.` };
    case "executed":
      return { verb: "DAO action", text: "The DAO contract executed an approved batch of actions." };
    case "settings":
      return { verb: "Rules changed", text: "Voting settings were updated by governance." };
    case "upgraded":
      return { verb: "Upgrade", text: "A DAO contract was upgraded to a new implementation." };
    case "granted":
      return { verb: "Permission granted", text: "The DAO granted a permission to a contract or member." };
    case "revoked":
      return { verb: "Permission revoked", text: "The DAO revoked a permission." };
    case "metadata":
      return { verb: "Profile updated", text: "The DAO's public metadata was updated." };
  }
}

const tone: Partial<Record<ActivityEvent["kind"], string>> = {
  proposal: "bg-cobalt",
  vote: "bg-leaf",
  passed: "bg-sand",
  executed: "bg-sand",
};

/**
 * What the DAO has actually done, newest first, read from Arbitrum logs in
 * the browser. Every row links to its transaction. Empty means empty: we
 * never pad the list with sample events.
 */
export function ActivityFeed({ titles, limit = 6, className }: { titles: Record<string, string>; limit?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(() => readActivity(limit + 4), { interval: 60000, staleAfter: 180000, ref });
  // A DAO "Executed" log always rides in the same tx as the plugin's
  // "ProposalExecuted"; keep the one that names the proposal.
  const rows = (live.data ?? [])
    .filter((e, _, all) => !(e.kind === "executed" && all.some((o) => o.kind === "passed" && o.tx === e.tx)))
    .slice(0, limit);

  return (
    <div ref={ref} className={cn("overflow-hidden rounded-2xl border border-line/[0.08] bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/[0.07] px-5 py-3.5">
        <div>
          <p className="text-small font-medium text-fg">DAO activity on Arbitrum</p>
          <p className="text-caption text-fg-subtle">Read from contract logs in your browser</p>
        </div>
        <LiveStatus state={live.state} updatedAt={live.updatedAt} source="Arbitrum logs" onRetry={live.retry} />
      </div>
      {live.data === null ? (
        <ul aria-hidden className="divide-y divide-line/[0.06]">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex gap-4 px-5 py-4">
              <span className="h-3 w-16 animate-pulse rounded bg-raised" />
              <span className="h-3 flex-1 animate-pulse rounded bg-raised" />
            </li>
          ))}
        </ul>
      ) : rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-small text-fg-muted">No DAO events yet. The first proposal will appear here.</p>
      ) : (
        <ol className="divide-y divide-line/[0.06]">
          {rows.map((e) => {
            const d = describe(e, titles);
            return (
              <li key={e.key}>
                <a
                  href={`${ARBISCAN}/tx/${e.tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/row grid grid-cols-[auto_1fr_auto] items-start gap-x-4 px-5 py-4 transition-colors hover:bg-raised/60"
                >
                  <span className="mt-1.5 flex flex-col items-center">
                    <span aria-hidden className={cn("size-2 rounded-full", tone[e.kind] ?? "bg-fg-subtle")} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-small font-medium text-fg">{d.verb}</span>
                      <time dateTime={new Date(e.at).toISOString()} className="font-mono text-[11.5px] text-fg-subtle tabular">
                        {timeFmt.format(e.at)} · {clockFmt.format(e.at)}
                      </time>
                    </span>
                    <span className="mt-1 block text-small text-fg-muted">{d.text}</span>
                  </span>
                  <span className="mt-1 flex items-center gap-1 font-mono text-[11px] text-fg-subtle group-hover/row:text-leaf">
                    <span className="hidden sm:inline">#{e.block.toLocaleString("en-US")}</span>
                    <ExternalIcon size={12} />
                    <span className="sr-only">View transaction on Arbiscan (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

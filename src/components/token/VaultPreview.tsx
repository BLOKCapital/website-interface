"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("en-US");

/** The contributor vaults' unlock, as the contributor terms state it. */
const UNLOCK = Date.UTC(2027, 4, 1);

type Phase = "locked" | "unlocked" | "claimed";

// Example figures for each state the vault can be in.
const phases: Record<Phase, { claimed: number; claimable: number; locked: number; provisional: number }> = {
  locked: { claimed: 0, claimable: 0, locked: 11_200, provisional: 1_280 },
  unlocked: { claimed: 0, claimable: 12_480, locked: 0, provisional: 0 },
  claimed: { claimed: 12_480, claimable: 0, locked: 0, provisional: 320 },
};

const parts = [
  { key: "claimed", label: "Claimed", hint: "Sent to your wallet", bar: "bg-fg-muted" },
  { key: "claimable", label: "Ready to claim", hint: "Unlocked, still in the vault", bar: "bg-leaf" },
  { key: "locked", label: "Locked", hint: "Settled, unlocks 1 May 2027", bar: "bg-line/12" },
  { key: "provisional", label: "Provisional", hint: "Confirmed after about 7 days", bar: "bg-progress/60" },
] as const;

/**
 * A contributor's own vault, in this site's look: a concept for the
 * contributor app to review, not a feature of this site (which never asks
 * for a wallet). The switch at the top steps through the states the vault
 * can be in, so each can be reviewed.
 */
export function VaultPreview() {
  const [phase, setPhase] = useState<Phase>("locked");
  // Local time and "in N days" need the visitor's clock: after mount only, so
  // the server HTML (UTC) and the first client render agree.
  const [local, setLocal] = useState<{ when: string; days: number } | null>(null);
  useEffect(() => {
    setLocal({
      when: new Date(UNLOCK).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
      days: Math.ceil((UNLOCK - Date.now()) / 86_400_000),
    });
  }, []);

  const n = phases[phase];
  const total = n.claimed + n.claimable + n.locked + n.provisional;
  const stage = phase === "locked" ? 1 : phase === "unlocked" ? 3 : 4;
  const stages = [
    { label: "Earned" },
    { label: "Locked", sub: "still voting" },
    { label: "Unlocks", sub: "1 May 2027" },
    { label: "Claim" },
  ];

  return (
    <div className="rounded-panel border border-subtle bg-card shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle px-5 py-3.5 sm:px-6">
        <p className="flex items-center gap-3 text-small font-medium text-fg">
          Your contributor vault <Badge status="example" />
        </p>
        <div role="group" aria-label="Preview state" className="flex rounded-full border border-line/15 bg-raised p-0.5">
          {(Object.keys(phases) as Phase[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={phase === p}
              onClick={() => setPhase(p)}
              className={cn(
                "h-8 rounded-full px-3 font-mono text-label uppercase tracking-wide transition-colors duration-fast",
                phase === p ? "bg-card text-fg shadow-e1" : "text-fg-muted can-hover:hover:text-fg",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-caps">In your vault</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="display text-display-md leading-none text-fg tabular">{fmt.format(total)}</span>
            <span className="font-mono text-small text-fg-subtle">BLOKC</span>
          </p>

          {/* Where it all stands, as one strip. */}
          <div aria-hidden className="mt-6 flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
            {parts.map((p) =>
              n[p.key] ? <span key={p.key} className={cn("h-full", p.bar)} style={{ flex: `${n[p.key]} 1 0%` }} /> : null,
            )}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {parts.map((p) => (
              <div key={p.key} className="flex gap-2.5">
                <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", p.bar === "bg-line/12" ? "bg-line/25" : p.bar)} />
                <div>
                  <dt className="text-caption text-fg-muted">{p.label}</dt>
                  <dd className="font-mono text-small text-fg tabular">{fmt.format(n[p.key])}</dd>
                  <dd className="text-caption text-fg-subtle">{p.hint}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button disabled={!n.claimable}>
              {phase === "locked" ? "Locked until 1 May 2027" : n.claimable ? `Claim ${fmt.format(n.claimable)} BLOKC` : "Nothing to claim"}
            </Button>
            <p className="text-caption text-fg-subtle">Sponsored: no gas to pay. Sends to your wallet; no approval asked.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* The journey, TokenTimeline's nodes laid flat. */}
          <ol className="relative grid grid-cols-4">
            <span aria-hidden className="absolute inset-x-[12.5%] top-[7px] h-px bg-line/12" />
            <span
              aria-hidden
              className="absolute left-[12.5%] top-[7px] h-px bg-leaf transition-[width] duration-base"
              style={{ width: `${(Math.min(stage, 3) / 3) * 75}%` }}
            />
            {stages.map((s, i) => {
              const done = i < stage;
              const now = i === stage;
              return (
                <li key={s.label} className="relative flex flex-col items-center text-center" aria-current={now ? "step" : undefined}>
                  <span
                    aria-hidden
                    className={cn(
                      "relative z-raised size-[15px] rounded-full border-2",
                      done ? "border-leaf bg-leaf" : now ? "border-leaf bg-card shadow-[0_0_0_5px_rgb(var(--leaf)/0.12)]" : "border-line/25 bg-card",
                    )}
                  />
                  <span className={cn("mt-2 text-caption", now ? "font-medium text-fg" : "text-fg-muted")}>{s.label}</span>
                  {s.sub && <span className="font-mono text-label text-fg-subtle">{s.sub}</span>}
                </li>
              );
            })}
          </ol>

          <div className="rounded-card bg-raised p-4">
            <p className="label-caps">Unlock</p>
            <p className="mt-1.5 font-mono text-small text-fg">1 May 2027 · 00:00 UTC</p>
            <p className="mt-0.5 text-caption text-fg-muted" suppressHydrationWarning>
              {local ? `${local.when} your time${local.days > 0 ? ` · in ${fmt.format(local.days)} days` : ""}` : " "}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-caption">
            {[
              ["Unlock", "Enforced by contract"],
              ["Revocable", "No"],
              ["Voting power", "Delegated to you"],
              ["Network", "Arbitrum One"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-fg-subtle">{k}</dt>
                <dd className="mt-0.5 font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-subtle px-5 py-4 sm:px-6">
        <p className="label-caps">Claim history</p>
        {phase === "claimed" ? (
          <ul className="mt-3">
            <li className="flex flex-wrap items-center justify-between gap-2 text-small">
              <span className="text-fg">Claimed {fmt.format(12_480)} BLOKC</span>
              <span className="font-mono text-caption text-fg-muted tabular">2 May 2027 · tx 0x3f9a…c21e ↗</span>
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-small text-fg-muted">No claims yet. Each claim will be listed here with its transaction.</p>
        )}
      </div>
    </div>
  );
}

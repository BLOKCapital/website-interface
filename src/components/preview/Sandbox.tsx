"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { SoulboundBadge } from "@/components/ui/SoulboundBadge";
import { Sparkline } from "@/components/ui/Sparkline";
import { presets } from "@/lib/data/sandbox";
import { managers } from "@/lib/data/managers";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title: string;
  body: string;
  tone: "primary" | "secondary";
};

export function Sandbox() {
  const [presetId, setPresetId] = useState<(typeof presets)[number]["id"]>(
    "balanced",
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const hireTriggerRef = useRef<HTMLButtonElement>(null);

  const preset = presets.find((p) => p.id === presetId)!;

  const pushToast = (t: Omit<Toast, "id">) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((x) => x.id !== id)),
      5000,
    );
  };

  const dismissToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <Section
      id="sandbox"
      eyebrow="Sandbox"
      title={
        <>
          Switch a preset.{" "}
          <em className="font-serif italic text-clay">
            Watch the Garden reshape.
          </em>
        </>
      }
      description="Hover the donut. Click rebalance. Hire a Gardener. Everything below is mocked, no wallet, no chain calls."
    >
      {/* Preset selector */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="radiogroup"
          aria-label="Preset Garden"
          className="inline-flex rounded-full border border-ink/10 bg-paper-deep/60 p-1"
        >
          {presets.map((p) => {
            const isActive = p.id === presetId;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setPresetId(p.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const idx = presets.findIndex((x) => x.id === presetId);
                    const dir = e.key === "ArrowRight" ? 1 : -1;
                    const next = (idx + dir + presets.length) % presets.length;
                    setPresetId(presets[next].id);
                  }
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-medium transition-colors active:scale-[0.97]",
                  isActive
                    ? "bg-moss text-paper"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-clay-deep">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
            <span className="relative inline-block size-1.5 rounded-full bg-clay" />
          </span>
          Sample · not real
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Donut + meta */}
        <div className="paper-card p-6 lg:col-span-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow text-moss">{preset.label} Garden</p>
              <p className="mono mt-1 text-[12px] tabular-nums text-ink-muted">
                Risk · {preset.riskBand} · APY {preset.expectedApy}
              </p>
            </div>
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
              {preset.label}
            </span>
          </div>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-ink-muted">
            {preset.blurb}
          </p>

          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
            <Donut
              slices={preset.allocations}
              hovered={hovered}
              onHover={setHovered}
            />
            <ul className="flex-1 space-y-2.5">
              {preset.allocations.map((a) => {
                const dim = hovered && hovered !== a.symbol;
                const pop = hovered === a.symbol;
                return (
                  <li
                    key={a.symbol}
                    onPointerEnter={() => setHovered(a.symbol)}
                    onPointerLeave={() => setHovered(null)}
                    className={cn(
                      "flex items-center gap-3 transition-opacity duration-150",
                      dim && "opacity-40",
                      pop && "opacity-100",
                    )}
                  >
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
                    <span className="mono w-10 text-right text-[12px] tabular-nums text-ink">
                      {a.pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div aria-hidden className="rule-hand mt-7" />

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() =>
                pushToast({
                  title: "Rebalancing simulated",
                  body: "Gas estimate ≈ 204k · 1 sig required",
                  tone: "primary",
                })
              }
            >
              Rebalance
            </Button>
            <Button
              ref={hireTriggerRef}
              variant="outline"
              size="md"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
            >
              Hire a Gardener
            </Button>
          </div>
        </div>

        {/* Tx history */}
        <div className="paper-card p-6 lg:col-span-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow text-moss">Recent activity</p>
            <span className="script text-[18px] leading-none text-clay">
              Ledger
            </span>
          </div>
          <ul className="mono mt-4 space-y-2 text-[12px]">
            {preset.txHistory.map((t) => (
              <li
                key={t.hash}
                className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 bg-paper-deep/40 px-3 py-2"
              >
                <span className="font-sans text-[12px] text-ink-muted">
                  {t.action}
                </span>
                <span className="tabular-nums text-ink">{t.value}</span>
                <span className="text-ink-subtle">{t.hash}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[11.5px] leading-relaxed text-ink-subtle">
            Real Gardens write each line to Arbiscan automatically.
          </p>
        </div>
      </div>

      {/* Toasts */}
      <section
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 top-20 z-30 flex w-[320px] flex-col gap-2"
      >
        {toasts.map((t) => (
          // role=status (not <output>): a toast contains flow content (div),
          // which <output> may not legally hold; this is the correct live region.
          // react-doctor-disable-next-line react-doctor/prefer-tag-over-role
          <div
            key={t.id}
            role="status"
            className="paper-card pointer-events-auto flex items-start gap-2 p-3 shadow-[0_22px_60px_-24px_rgba(31,26,20,0.30)]"
          >
            <div className="flex-1">
              <p className="text-[13px] font-medium text-moss-deep">
                {t.title}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                {t.body}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition hover:bg-paper-deep hover:text-ink"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
                <path
                  d="M2 2 L10 10 M10 2 L2 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </section>

      {/* Manager drawer */}
      <ManagerDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => hireTriggerRef.current?.focus(), 0);
        }}
        onHire={(name) => {
          setDrawerOpen(false);
          setTimeout(() => hireTriggerRef.current?.focus(), 0);
          pushToast({
            title: `Hired ${name}`,
            body: "Strategy mirrored · 1 sig required",
            tone: "secondary",
          });
        }}
      />
    </Section>
  );
}

/* ---------- Donut ---------------------------------------------------------- */

function Donut({
  slices,
  hovered,
  onHover,
}: {
  slices: { symbol: string; pct: number; color: string }[];
  hovered: string | null;
  onHover: (s: string | null) => void;
}) {
  const C = 2 * Math.PI * 50;
  const summaryId = useId();
  let acc = 0;
  return (
    <div className="relative">
      <svg
        viewBox="0 0 140 140"
        className="size-[180px]"
        role="img"
        aria-labelledby={`${summaryId}-label`}
        aria-describedby={summaryId}
      >
        <title id={`${summaryId}-label`}>Garden allocation</title>
        <circle
          cx="70"
          cy="70"
          r="50"
          fill="none"
          stroke="rgb(var(--ink) / 0.08)"
          strokeWidth="14"
        />
        {slices.map((s, i) => {
          const dash = (s.pct / 100) * C;
          const offset = -((acc / 100) * C);
          acc += s.pct;
          const isHovered = hovered === s.symbol;
          const dim = hovered && !isHovered;
          return (
            <g key={i}>
              <circle
                cx="70"
                cy="70"
                r={isHovered ? 53 : 50}
                fill="none"
                stroke={s.color}
                strokeWidth={isHovered ? 18 : 14}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
                opacity={dim ? 0.25 : 1}
                className="cursor-pointer transition-[stroke-width,r,opacity] duration-150"
                onPointerEnter={() => onHover(s.symbol)}
                onPointerLeave={() => onHover(null)}
                onClick={() => onHover(isHovered ? null : s.symbol)}
              >
                <title>{`${s.symbol} · ${s.pct}%`}</title>
              </circle>
            </g>
          );
        })}
        <text
          x="70"
          y="70"
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--font-display)"
          fill="rgb(var(--ink))"
        >
          {hovered ?? "Garden"}
        </text>
        <text
          x="70"
          y="84"
          textAnchor="middle"
          fontSize="10"
          fill="rgb(var(--ink) / 0.55)"
          fontFamily="var(--font-mono)"
        >
          {hovered
            ? `${slices.find((s) => s.symbol === hovered)?.pct}%`
            : "Balanced"}
        </text>
      </svg>
      <ul id={summaryId} className="sr-only">
        {slices.map((s) => (
          <li key={s.symbol}>
            {s.symbol}: {s.pct} percent
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Drawer --------------------------------------------------------- */

function ManagerDrawer({
  open,
  onClose,
  onHire,
}: {
  open: boolean;
  onClose: () => void;
  onHire: (name: string) => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // useEffectEvent (the rule's suggestion) is still experimental in React 19.0;
  // depending on the stable onClose prop is correct and re-subscribes harmlessly.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // react-doctor-disable-next-line react-doctor/prefer-use-effect-event
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const getFocusable = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select, textarea',
        ),
      ).filter((el) => !el.hasAttribute("data-focus-guard"));

    const initial = drawer.querySelector<HTMLElement>("[data-drawer-close]");
    (initial ?? getFocusable()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    drawer.addEventListener("keydown", onKey);
    return () => drawer.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm transition-opacity duration-400",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Manager marketplace"
        className={cn(
          "fixed right-0 top-0 z-40 flex size-full max-w-[400px] flex-col border-l border-ink/10 bg-paper shadow-[-22px_0_60px_-24px_rgba(31,26,20,0.25)] transition-transform duration-400 ease-in-soft",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="script text-[20px] leading-none text-clay">
              Hire
            </span>
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
              Gardener marketplace
            </span>
          </div>
          <button
            type="button"
            data-drawer-close
            onClick={onClose}
            aria-label="Close drawer"
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition hover:border-clay/40 hover:text-clay-deep active:scale-[0.97]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M2 2 L10 10 M10 2 L2 10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <ul className="flex-1 space-y-3 overflow-y-auto p-5">
          {managers.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-ink/10 bg-paper-deep/40 p-4 transition-colors hover:border-moss/30"
            >
              <div className="flex items-center gap-3">
                <Avatar initials={m.name.slice(0, 2).toUpperCase()} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-ink">{m.name}</p>
                  <p className="mono text-[11px] text-ink-muted">{m.handle}</p>
                </div>
                <SoulboundBadge score={m.reputation} />
              </div>
              <Sparkline
                values={m.spark}
                width={300}
                height={36}
                className="mt-3 w-full"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="mono text-[12px] tabular-nums text-ink-muted">
                  AUM ${(m.aum / 1_000_000).toFixed(2)}M · ROI{" "}
                  <span className="text-moss-deep">
                    +{m.roi24h.toFixed(2)}%
                  </span>
                </span>
                <Button size="sm" variant="primary" onClick={() => onHire(m.name)}>
                  Hire
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

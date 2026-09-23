"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowLink } from "@/components/ui/ArrowLink";

export type ExploreStep = {
  id: string;
  label: string;
  /** One line: what this layer is. */
  title: string;
  body: string;
  /** What actually happens on-chain at this layer. */
  behind: string;
  facts?: { k: string; v: string }[];
  link?: { label: string; href: string };
  /** Optional live or visual element for this layer. */
  extra?: ReactNode;
};

/**
 * "Explore the protocol": the layers from the protocol down to you, as a
 * path you can walk. A proper tablist (arrow keys, Home/End), so the map is
 * as usable by keyboard and screen reader as by pointer.
 */
export function ProtocolExplorer({ steps }: { steps: ExploreStep[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = steps[active];

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: steps.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + steps.length) % steps.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* The path */}
      <div role="tablist" aria-label="Protocol layers" aria-orientation="vertical" onKeyDown={onKey} className="relative min-w-0 lg:col-span-4">
        <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-line/10" />
        <span
          aria-hidden
          className="absolute left-[19px] top-6 w-px bg-leaf/70 transition-[height] duration-500 ease-out"
          style={{ height: `calc((100% - 48px) * ${steps.length > 1 ? active / (steps.length - 1) : 0})` }}
        />
        <ol className="relative space-y-1">
          {steps.map((st, i) => {
            const on = i === active;
            const passed = i < active;
            return (
              <li key={st.id}>
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${base}-tab-${st.id}`}
                  aria-selected={on}
                  aria-controls={`${base}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group/tab flex w-full items-center gap-4 rounded-xl px-2 py-2.5 text-left transition-colors",
                    on ? "bg-card" : "hover:bg-card/60",
                  )}
                >
                  <span
                    className={cn(
                      "relative grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10.5px] transition-all duration-300 ml-[7px]",
                      on
                        ? "scale-110 border-leaf bg-leaf text-canvas shadow-[0_0_0_5px_rgb(var(--leaf)/0.14)]"
                        : passed
                          ? "border-leaf/60 bg-canvas text-leaf"
                          : "border-line/20 bg-canvas text-fg-subtle group-hover/tab:border-line/40",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-small font-medium transition-colors", on ? "text-fg" : "text-fg-muted group-hover/tab:text-fg")}>
                      {st.label}
                    </span>
                    <span className="block truncate text-caption text-fg-subtle">{st.title}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The layer */}
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${s.id}`}
        tabIndex={0}
        className="relative min-w-0 overflow-hidden rounded-3xl border border-line/[0.08] bg-card lg:col-span-8"
      >
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_70%_at_80%_0%,black,transparent)]" />
        <div key={s.id} className="relative animate-enter-up p-6 sm:p-8 [animation-duration:450ms]">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-leaf">
            Layer {active + 1} of {steps.length} · {s.label}
          </p>
          <h3 className="display mt-3 text-h3 text-fg">{s.title}</h3>
          <p className="mt-4 max-w-2xl text-body text-fg-muted">{s.body}</p>

          <div className="mt-6 rounded-2xl border border-line/[0.07] bg-canvas/50 p-5">
            <p className="text-caption font-medium uppercase tracking-[0.1em] text-fg-subtle">Behind the scenes</p>
            <p className="mt-2 text-small text-fg-muted">{s.behind}</p>
          </div>

          {s.facts && s.facts.length > 0 && (
            <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line/[0.07] bg-line/[0.07] sm:grid-cols-3">
              {s.facts.map((f) => (
                <div key={f.k} className="bg-card px-4 py-3.5">
                  <dt className="text-caption text-fg-subtle">{f.k}</dt>
                  <dd className="mt-1 text-small text-fg">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}
          {s.extra && <div className="mt-6">{s.extra}</div>}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            {s.link ? <ArrowLink href={s.link.href}>{s.link.label}</ArrowLink> : <span />}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActive((active - 1 + steps.length) % steps.length)}
                className="rounded-full border border-line/12 px-3.5 py-1.5 text-caption text-fg-muted transition-colors hover:border-line/30 hover:text-fg"
              >
                <span aria-hidden>←</span> Previous
              </button>
              <button
                type="button"
                onClick={() => setActive((active + 1) % steps.length)}
                className="rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1.5 text-caption text-leaf transition-colors hover:bg-leaf/20"
              >
                {active === steps.length - 1 ? "Start over" : `Next: ${steps[active + 1].label}`} <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

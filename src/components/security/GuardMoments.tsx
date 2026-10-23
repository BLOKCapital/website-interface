"use client";

import { RULES_PICK, scenarios, type Verdict } from "@/lib/data/scenarios";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { moments } from "./controls";

/** The rules demo's verdict marks, so a link reads like the stamp it leads to. */
const mark: Record<Verdict, { glyph: string; cls: string }> = {
  allow: { glyph: "✓", cls: "text-leaf" },
  block: { glyph: "✕", cls: "text-negative" },
  hold: { glyph: "‖", cls: "text-caution" },
};

/**
 * Five moments a Garden guards (after Safe Shield's "every moment" story):
 * the matrix's five actions as one row, each with who can act and the rule
 * that limits it. The short version before the full table. "Watch it" links
 * scroll to the rules demo and run that scenario there (RULES_PICK). Data:
 * controls.ts (moments) and lib/data/scenarios.ts.
 */
export function GuardMoments() {
  return (
    <div>
      <h3 className="label-caps">Five moments, and what guards each</h3>
      {/* Phones: a sideways strip (five stacked cards would be ~1,250 px before the table); a grid from sm. */}
      <Stagger
        as="ol"
        className="focus-inset -mx-gutter mt-4 flex snap-x snap-mandatory scroll-pl-gutter gap-3 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5"
      >
        {moments.map((m, i) => {
          const watch = m.watch.map((id) => scenarios.find((s) => s.id === id)).filter((s) => !!s);
          return (
            <RevealItem as="li" key={m.id} className="flex w-[78%] shrink-0 snap-start flex-col rounded-card border border-subtle bg-card p-5 sm:w-auto">
              <p className="flex items-center gap-2 font-mono text-label text-fg-subtle">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="h-px flex-1 bg-leaf/30" />
              </p>
              <h4 className="mt-3 text-ui font-medium text-fg">{m.label}</h4>
              <p className="mt-3 label-caps">Who</p>
              <p className="mt-1 text-small text-fg">{m.who}</p>
              <p className="mt-3 text-caption text-fg-muted">{m.rule}</p>
              {watch.length > 0 && (
                <ul className="mt-auto flex flex-col gap-1 pt-4">
                  {watch.map((s) => (
                    <li key={s.id}>
                      <a
                        href="#rules"
                        onClick={() => window.dispatchEvent(new CustomEvent(RULES_PICK, { detail: s.id }))}
                        className="group/w inline-flex items-baseline gap-1.5 text-caption text-fg-muted transition-colors duration-fast can-hover:hover:text-fg"
                      >
                        <span aria-hidden className={cn("font-mono", mark[s.verdict.kind].cls)}>
                          {mark[s.verdict.kind].glyph}
                        </span>
                        <span className="underline decoration-line/20 underline-offset-[3px] can-hover:group-hover/w:decoration-leaf">
                          Watch: {s.label.toLowerCase()}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </RevealItem>
          );
        })}
      </Stagger>
    </div>
  );
}

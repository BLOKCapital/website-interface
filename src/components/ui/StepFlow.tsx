import { cn } from "@/lib/utils";
import { Stagger, RevealItem } from "@/components/ui/Reveal";

export type FlowStep = { label: string; detail?: string };

/**
 * A linear process: a vertical rail on phones, a horizontal track from md.
 * Real DOM text (never SVG <text> in a scaled viewBox), so it stays legible
 * at every width. Steps cascade in once via the CSS reveal.
 */
export function StepFlow({ steps, label, className }: { steps: FlowStep[]; label: string; className?: string }) {
  return (
    <Stagger as="ol" aria-label={label} className={cn("flex flex-col md:flex-row", className)}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <RevealItem
            as="li"
            key={s.label}
            className={cn("relative flex gap-4 md:flex-1 md:flex-col md:gap-0", !last && "pb-7 md:pb-0")}
          >
            {!last && (
              <>
                <span aria-hidden className="absolute bottom-0 left-[15px] top-9 w-px bg-line/15 md:hidden" />
                <span aria-hidden className="absolute left-10 right-3 top-[15px] hidden h-px bg-line/15 md:block" />
              </>
            )}
            <span className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-leaf/35 bg-leaf/10 font-mono text-[12px] text-leaf md:mb-4">
              {i + 1}
            </span>
            <div className="min-w-0 md:pr-5">
              <p className="text-[15px] font-medium text-fg">{s.label}</p>
              {s.detail && <p className="mt-1.5 text-small text-fg-muted">{s.detail}</p>}
            </div>
          </RevealItem>
        );
      })}
    </Stagger>
  );
}

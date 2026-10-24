import { Badge, type Tone } from "@/components/ui/Badge";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { milestones, quarterValue, ROADMAP_UPDATED, type Milestone } from "@/lib/data/milestones";
import { cn } from "@/lib/utils";

const byQuarter = (a: Milestone, b: Milestone) => quarterValue(a.quarter) - quarterValue(b.quarter);

export const roadmapUpdated = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(ROADMAP_UPDATED));

const STATUS: Record<Milestone["status"], { tone: Tone; label: string }> = {
  done: { tone: "done", label: "Done" },
  current: { tone: "current", label: "In progress" },
  future: { tone: "soon", label: "Planned" },
};

/** Now / Next / Later columns, derived from lib/data/milestones.ts. */
export function RoadmapNowNext() {
  const now = milestones.filter((m) => m.status === "current").sort(byQuarter);
  const future = milestones.filter((m) => m.status === "future").sort(byQuarter);
  const cols = [
    { title: "Now", tone: "current" as Tone, items: now, detail: true },
    { title: "Next", tone: "soon" as Tone, items: future.slice(0, 3), detail: true },
    { title: "Later", tone: "soon" as Tone, items: future.slice(3), detail: false },
  ];
  return (
    <Stagger className="grid gap-5 lg:grid-cols-3">
      {cols.map((c) => (
        <RevealItem key={c.title} className="rounded-2xl border border-line/[0.08] bg-card p-6">
          <div className="flex items-center justify-between border-b border-line/[0.08] pb-4">
            <h3 className="display text-h3 text-fg">{c.title}</h3>
            <Badge tone={c.tone}>{c.title === "Now" ? "In progress" : "Planned"}</Badge>
          </div>
          <ul className="mt-5 space-y-5">
            {c.items.map((m) => (
              <li key={m.id}>
                <p className="flex items-baseline justify-between gap-3">
                  <span className="text-[15px] font-medium text-fg">{m.label}</span>
                  <span className="shrink-0 font-mono text-[12px] text-fg-subtle">{m.quarter}</span>
                </p>
                {c.detail && <p className="mt-1 text-small text-fg-muted">{m.description}</p>}
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </Stagger>
  );
}

/** Every milestone as a year-by-year timeline (About page). */
export function RoadmapTimeline() {
  const years = new Map<string, Milestone[]>();
  for (const m of [...milestones].sort(byQuarter)) {
    const y = `20${m.quarter.match(/'(\d{2})/)?.[1] ?? "??"}`;
    years.set(y, [...(years.get(y) ?? []), m]);
  }
  return (
    <ol className="relative border-l border-line/[0.12] pl-8 sm:pl-10">
      {[...years.entries()].map(([year, items]) => (
        <li key={year} className="relative pb-12 last:pb-0">
          <span aria-hidden className="absolute -left-[41px] top-2 size-3 rounded-full border-2 border-leaf bg-canvas sm:-left-[49px]" />
          <h3 className="display text-h3 text-fg">{year}</h3>
          <Stagger as="ul" className="mt-5 grid gap-4 md:grid-cols-2">
            {items.map((m) => {
              const s = STATUS[m.status];
              return (
                <RevealItem
                  as="li"
                  key={m.id}
                  className={cn(
                    "rounded-2xl border bg-card p-5",
                    m.status === "current" ? "border-bloom/30" : m.status === "future" ? "border-dashed border-line/15" : "border-line/[0.08]",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[12px] text-fg-subtle">{m.quarter}</span>
                    <Badge tone={s.tone}>{s.label}</Badge>
                  </div>
                  <p className="mt-3 text-[16px] font-medium text-fg">{m.label}</p>
                  <p className="mt-1.5 text-small text-fg-muted">{m.description}</p>
                </RevealItem>
              );
            })}
          </Stagger>
        </li>
      ))}
    </ol>
  );
}

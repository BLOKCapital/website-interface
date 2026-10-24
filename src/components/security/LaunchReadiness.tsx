import { IntentLink } from "@/components/ui/IntentLink";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { readiness, type ReadinessStatus } from "./readiness";
import { cn } from "@/lib/utils";

/** Each status as a shape (here) and a word (the Badge), never colour alone. */
const ring: Record<ReadinessStatus, string> = {
  done: "border-success/40 bg-success/10 text-success",
  progress: "border-progress/40 bg-progress/10 text-progress-text",
  planned: "border-dashed border-line/30 text-fg-muted",
};

/** Done: a tick. In progress: a half-filled disc. Planned: an empty dashed ring. */
function StatusGlyph({ status }: { status: ReadinessStatus }) {
  return (
    <span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full border", ring[status])}>
      {status === "done" && <Icon name="check" size="sm" />}
      {status === "progress" && (
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 1a6 6 0 0 1 0 12Z" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

function Proof({ label, href, cta }: { label: string; href: string; cta?: string }) {
  const external = /^https?:\/\//.test(href);
  return (
    <IntentLink
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cta={cta}
      className="group/proof inline-flex min-h-6 items-center gap-1 whitespace-nowrap rounded-xs text-small font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg"
    >
      {label}
      <Icon
        name={external ? "external" : "arrow-right"}
        size="sm"
        className="transition-transform duration-fast can-hover:group-hover/proof:translate-x-0.5"
      />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </IntentLink>
  );
}

/**
 * "Launch readiness" (INS-03): a checklist under the /security hero, driven
 * by readiness.ts. Each row: a status shape and word, the criterion, a date
 * only when the site states one, and a link to the proof.
 */
export function LaunchReadiness() {
  const count = (s: ReadinessStatus) => readiness.filter((r) => r.status === s).length;
  const summary = `${count("done")} of ${readiness.length} done · ${count("progress")} in progress · ${count("planned")} planned`;
  return (
    <Section
      id="readiness"
      eyebrow="Launch readiness"
      title="What's done, and what isn't yet."
      description="The checks before the public launch. Each status is what this site already says, with the proof beside it; a date appears only where one is known."
    >
      <Reveal>
        <Card size="sm" radius="panel" className="p-0 sm:p-0">
          <p className="label-caps border-b border-subtle px-5 py-3.5 sm:px-7">{summary}</p>
          <ul className="divide-y divide-subtle">
            {readiness.map((r) => (
              // Phone: shape | text, then the status and the proof under the
              // text. sm: the proof moves to a right-hand column. lg: one row.
              <li
                key={r.id}
                className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 px-5 py-5 sm:grid-cols-[auto_1fr_auto] sm:gap-x-5 sm:px-7 lg:grid-cols-[auto_1fr_11rem_9rem] lg:items-center"
              >
                <StatusGlyph status={r.status} />
                <div className="min-w-0">
                  <h3 className="text-ui font-medium text-fg">{r.criterion}</h3>
                  <p className="mt-1 text-small text-fg-muted">{r.detail}</p>
                </div>
                <div className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 lg:col-start-3 lg:flex-col lg:items-start">
                  <Badge status={r.status} />
                  {r.date && <span className="text-caption text-fg-subtle">{r.date}</span>}
                </div>
                <div className="col-start-2 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:self-center lg:col-start-4 lg:row-span-1">
                  <Proof {...r.proof} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>
    </Section>
  );
}

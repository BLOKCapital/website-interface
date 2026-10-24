import { IntentLink } from "@/components/ui/IntentLink";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { actions, actors, custody, type Cell } from "./controls";
import { GuardMoments } from "./GuardMoments";
import { cn } from "@/lib/utils";

const draw = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1, className: "draw-path" } as const;

/** The padlock mark for "Your funds". */
function Lock() {
  return (
    <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-card border border-leaf/25 bg-leaf/7 text-leaf">
      <svg width="34" height="34" viewBox="0 0 48 48">
        <path d="M14 22h20v16H14z" {...draw} />
        <path d="M18 22v-5a6 6 0 0 1 12 0v5M24 29v3" {...draw} />
      </svg>
    </span>
  );
}

/** A source link: external ones open in a new tab and say so. */
function SourceLink({ href, children, label, className }: { href: string; children: React.ReactNode; label: string; className?: string }) {
  const external = /^https?:\/\//.test(href);
  return (
    <IntentLink
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn("group/src rounded-xs transition-colors duration-fast", className)}
    >
      {children}
      <span className="sr-only">
        {" "}
        (source: {label}
        {external ? ", opens in a new tab" : ""})
      </span>
    </IntentLink>
  );
}

const answerLook = {
  yes: { icon: "check", tone: "text-success" },
  no: { icon: "cross", tone: "text-danger" },
  limited: { icon: null, tone: "" },
} as const;

/** One cell: a shape and a word for yes / no, then the claim, linked to its source. */
function CellLink({ cell }: { cell: Cell }) {
  const look = answerLook[cell.answer];
  return (
    <SourceLink
      href={cell.source.href}
      label={cell.source.label}
      className="inline-flex items-start gap-1.5 text-fg underline decoration-line/30 underline-offset-[3px] can-hover:hover:decoration-leaf"
    >
      {look.icon && <Icon name={look.icon} size="sm" className={cn("mt-0.5", look.tone)} />}
      <span>{cell.text}</span>
    </SourceLink>
  );
}

function Unstated() {
  return (
    <span className="text-fg-subtle">
      <span aria-hidden>—</span>
      <span className="sr-only">Not stated yet</span>
    </span>
  );
}

/**
 * Who can do what (INS-05): the custody guarantee as a wide feature card,
 * then an actor × action matrix (a table from lg, one card per actor
 * below). Data and rules: controls.ts. Each filled cell links to the source
 * the site already cites; empty cells are "not stated yet", never a guess.
 */
export function ControlMap() {
  return (
    <div className="flex flex-col gap-5">
      {/* The headline guarantee, laid out wide so it isn't half empty (VIS-22). */}
      <Reveal>
        <article className="theme-dark relative grid gap-6 overflow-hidden rounded-panel border border-leaf/20 bg-card p-7 sm:p-9 lg:grid-cols-12 lg:items-center lg:gap-10 shadow-soft">
          <div aria-hidden className="glow-leaf pointer-events-none absolute -right-24 -top-24 size-80 opacity-80" />
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_80%_0%,black,transparent_70%)]" />
          <div className="relative flex items-center gap-5 lg:col-span-5">
            <Lock />
            <div>
              <p className="label-caps">
                Enforced by <span className="text-leaf">{custody.by}</span>
              </p>
              <h3 className="display mt-2 text-display-sm text-fg">{custody.label}</h3>
            </div>
          </div>
          <div className="relative lg:col-span-7">
            <p className="text-lead text-fg-muted">{custody.body}</p>
            <SourceLink
              href={custody.source.href}
              label={custody.label}
              className="mt-4 inline-flex items-center gap-1 text-small font-medium text-leaf can-hover:hover:text-fg"
            >
              Read the source
              <Icon name="external" size="sm" className="transition-transform duration-fast can-hover:group-hover/src:-translate-y-0.5" />
            </SourceLink>
          </div>
        </article>
      </Reveal>

      {/* The short version: each action as a moment, with its guard and a link to watch it run. */}
      <GuardMoments />

      {/* lg and up: the matrix as a table. */}
      <Reveal className="hidden overflow-hidden rounded-panel border border-subtle bg-card lg:block shadow-soft">
        <table className="w-full table-fixed border-collapse text-left text-small">
          <caption className="sr-only">Who can do what with a Garden: each actor against each action</caption>
          <colgroup>
            <col className="w-[22%]" />
            {actions.map((a) => (
              <col key={a.id} className="w-[15.6%]" />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-subtle">
              <th scope="col" className="label-caps px-5 py-3.5 align-bottom font-normal">
                Who
              </th>
              {actions.map((a) => (
                <th key={a.id} scope="col" className="label-caps px-4 py-3.5 align-bottom font-normal">
                  {a.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {actors.map((actor) => (
              <tr key={actor.id} className="align-top">
                <th scope="row" className="px-5 py-4 font-normal">
                  <span className="block font-medium text-fg">{actor.name}</span>
                  <span className="mt-1 block text-caption text-fg-subtle">{actor.note}</span>
                </th>
                {actions.map((a) => {
                  const cell = actor.cells[a.id];
                  return (
                    <td key={a.id} className="px-4 py-4">
                      {cell ? <CellLink cell={cell} /> : <Unstated />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* Below lg: one card per actor. */}
      <ul className="grid gap-4 md:grid-cols-2 lg:hidden">
        {actors.map((actor) => (
          <li key={actor.id} className="rounded-card border border-subtle bg-card p-5 shadow-soft">
            <h3 className="text-ui font-medium text-fg">{actor.name}</h3>
            <p className="mt-1 text-caption text-fg-subtle">{actor.note}</p>
            <dl className="mt-4 divide-y divide-subtle border-t border-subtle text-small">
              {actions.map((a) => {
                const cell = actor.cells[a.id];
                return (
                  <div key={a.id} className="grid grid-cols-[minmax(0,9rem)_1fr] gap-3 py-2.5">
                    <dt className="text-fg-muted">{a.label}</dt>
                    <dd>{cell ? <CellLink cell={cell} /> : <Unstated />}</dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>

      <p className="text-caption text-fg-subtle">
        The rules as the docs and contracts describe them; mainnet contracts aren&apos;t deployed yet. Each filled cell links
        to its source. <span aria-hidden>—</span> means this site doesn&apos;t state it yet. Delays and timelocks will be
        listed only once they&apos;re verified on-chain.
      </p>
    </div>
  );
}

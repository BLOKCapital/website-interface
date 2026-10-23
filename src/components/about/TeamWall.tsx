import type { CSSProperties } from "react";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { TeamPhoto } from "@/components/about/TeamPhoto";
import type { TeamMember } from "@/lib/data/team";

/** Each polaroid's tilt, in turn, so the wall looks pinned up by hand. */
const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1, 2];

/** Where a member's link goes, as a short handle: "@0xSheetal", or "LinkedIn". */
const handle = (href?: string) => {
  if (!href) return undefined;
  const x = /^https:\/\/x\.com\/([^/?#]+)/.exec(href);
  if (x) return `@${x[1]}`;
  if (/linkedin\.com/.test(href)) return "LinkedIn";
  return undefined;
};

/**
 * The team, as polaroids pinned to the page: a square photo in a white frame
 * (greyscale until hovered, TeamPhoto), the name written underneath, and the
 * profile it links to typed small. Each sits at a slight tilt and straightens
 * under the pointer. 2, then 3, then 5 to a row: ten divide evenly at 2 and 5.
 */
export function TeamWall({ team }: { team: TeamMember[] }) {
  return (
    <Stagger as="ul" step={0.05} className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
      {team.map((m, i) => {
        const h = handle(m.href);
        const polaroid = (
          <span
            className="block rotate-[var(--tilt)] rounded-tag bg-card p-2 pb-3 shadow-soft ring-1 ring-line/8 transition-[transform,box-shadow] duration-base ease-expo can-hover:group-hover:rotate-0 can-hover:group-hover:shadow-e2"
            style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
          >
            <span className="relative isolate block aspect-square overflow-hidden rounded-xs bg-raised">
              <TeamPhoto member={m} />
            </span>
            <span className="note mt-2.5 block truncate px-1 text-center text-[1.15rem]">{m.name}</span>
            {h && <span className="block truncate px-1 text-center font-mono text-label text-fg-subtle">{h}</span>}
            {m.role && <span className="block truncate px-1 text-center text-caption text-fg-subtle">{m.role}</span>}
          </span>
        );
        return (
          <RevealItem as="li" key={m.name}>
            {m.href ? (
              <a href={m.href} target="_blank" rel="noopener noreferrer" className="group block rounded-tag">
                {polaroid}
                <span className="sr-only"> profile (opens in a new tab)</span>
              </a>
            ) : (
              <div className="group">{polaroid}</div>
            )}
          </RevealItem>
        );
      })}
    </Stagger>
  );
}

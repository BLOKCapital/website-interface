import { Section } from "@/components/ui/Section";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { IntentLink } from "@/components/ui/IntentLink";
import { ArrowIcon } from "@/components/ui/icons";
import { navGroups } from "@/lib/nav";

const navLinks = navGroups.flatMap((g) => g.links);

/**
 * "Keep reading": three next pages above the closing band, for a visitor
 * who isn't ready for the app yet, as a table of contents (no boxes): each
 * a numbered headline, its one line, and a round arrow that fills on hover,
 * between thin rules. Titles and hints come from the nav (lib/nav.ts), so
 * each reads like the menu item it leads to. Pass hrefs that are in the nav.
 */
export function NextReads({ hrefs }: { hrefs: string[] }) {
  const items = hrefs.map((h) => navLinks.find((l) => l.href === h)).filter((l) => !!l);
  return (
    <Section
      eyebrow="Keep reading"
      title={
        <>
          Where to <em>next.</em>
        </>
      }
      className="py-section-sm"
    >
      <Stagger as="ol" className="border-t border-line/20">
        {items.map((l, i) => (
          <RevealItem as="li" key={l.href} className="border-b border-line/20">
            <IntentLink
              href={l.href}
              className="group/nr focus-inset grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-8"
            >
              <span aria-hidden className="font-mono text-label text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-h2 font-extrabold leading-none tracking-tight text-fg transition-colors duration-fast can-hover:group-hover/nr:text-leaf">
                  {l.label}
                </span>
                {l.hint && <span className="mt-2 block text-ui text-fg-muted">{l.hint}</span>}
              </span>
              <span
                aria-hidden
                className="grid size-12 place-items-center rounded-full border border-line/30 text-fg transition-[background-color,border-color,color] duration-fast can-hover:group-hover/nr:border-fg can-hover:group-hover/nr:bg-fg can-hover:group-hover/nr:text-canvas sm:size-14"
              >
                <ArrowIcon size={18} className="transition-transform duration-fast can-hover:group-hover/nr:translate-x-0.5" />
              </span>
            </IntentLink>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}

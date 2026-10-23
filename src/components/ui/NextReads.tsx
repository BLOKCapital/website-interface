import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { NavIcon } from "@/components/nav/NavIcons";
import { navGroups } from "@/lib/nav";

const navLinks = navGroups.flatMap((g) => g.links);

/**
 * "Keep reading" (after Safenet's "Learn more" cards): three next pages above
 * the closing band, for a visitor who isn't ready for the app yet. Titles,
 * hints and marks come from the nav (lib/nav.ts, NavIcons), so a card always
 * reads like the menu item it leads to. Pass hrefs that are in the nav.
 */
export function NextReads({ hrefs }: { hrefs: string[] }) {
  const items = hrefs.map((h) => navLinks.find((l) => l.href === h)).filter((l) => !!l);
  return (
    <Section eyebrow="Keep reading" className="py-section-sm">
      <Stagger as="ul" className="grid gap-4 sm:grid-cols-3">
        {items.map((l) => {
          const id = `next-${l.href.replace(/[^a-z]+/g, "-")}`;
          return (
            <RevealItem as="li" key={l.href}>
              <Card href={l.href} aria-labelledby={id} className="flex h-full items-start gap-4 p-5 sm:p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-control border border-subtle bg-raised text-fg-muted transition-colors duration-fast can-hover:group-hover/card:text-leaf">
                  <NavIcon href={l.href} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span id={id} className="flex items-center gap-1.5 text-ui font-medium text-fg">
                    {l.label}
                    <ArrowIcon size={12} className="text-fg-subtle transition-transform duration-fast can-hover:group-hover/card:translate-x-0.5 can-hover:group-hover/card:text-leaf" />
                  </span>
                  {l.hint && <span className="mt-1 block text-caption text-fg-subtle">{l.hint}</span>}
                </span>
              </Card>
            </RevealItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

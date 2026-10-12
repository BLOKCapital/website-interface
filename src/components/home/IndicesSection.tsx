import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stagger } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { TokenStack } from "@/components/indices/TokenLogo";
import { indices } from "@/lib/data/indices";

/**
 * Home: what BLOKC2 / BLOKC5 / BLOKC10 are, as three cards that open each
 * index's page (D-08c, UX-09). The explorer, live prices and methodology
 * live on /indices; IndexShowcase is no longer used here but is kept.
 */
export function IndicesSection() {
  return (
    <Section
      id="indices"
      tone="surface"
      eyebrow="The indices"
      title={
        <>
          BLOKC2, BLOKC5, BLOKC10. <em className="text-sand">Open them up.</em>
        </>
      }
      description="Three baskets with one rule: each token is weighted by its share of market cap, priced by Chainlink on Arbitrum."
      actions={
        <Button href="/indices" variant="secondary" data-cta="indices_compare">
          Compare the indices <ArrowIcon size={13} />
        </Button>
      }
    >
      <Stagger as="ul" className="grid gap-4 md:grid-cols-3">
        {indices.map((x) => {
          const titleId = `index-card-${x.id}`;
          return (
            // A RevealItem that also carries the analytics id for its card link.
            <li key={x.id} data-reveal-item="" data-cta={`indices_open_${x.id}`} suppressHydrationWarning>
              <Card
                href={`/indices/${x.id}`}
                aria-labelledby={`${titleId} ${titleId}-cta`}
                aria-describedby={`${titleId}-tagline`}
                className="flex h-full flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 id={titleId} className="font-mono text-h4 font-medium text-fg">
                    {x.name}
                  </h3>
                  <span className="label-caps pt-1">
                    {x.components.length} tokens
                  </span>
                </div>
                <p id={`${titleId}-tagline`} className="mt-1.5 text-ui text-fg-muted">
                  {x.tagline}
                </p>
                <TokenStack symbols={x.components} size={24} className="mt-5" />
                <span
                  id={`${titleId}-cta`}
                  className="mt-6 inline-flex items-center gap-1.5 pt-1 text-small font-medium text-leaf"
                >
                  Open {x.name}
                  <ArrowIcon size={13} className="transition-transform duration-fast can-hover:group-hover/card:translate-x-0.5" />
                </span>
              </Card>
            </li>
          );
        })}
      </Stagger>
    </Section>
  );
}

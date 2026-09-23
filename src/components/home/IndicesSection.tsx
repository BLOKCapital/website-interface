import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { IndexExplorer } from "@/components/indices/IndexExplorer";

/** Home: what BLOKC2 / BLOKC5 / BLOKC10 are, explorable in place. */
export function IndicesSection() {
  return (
    <Section
      id="indices"
      eyebrow="The indices"
      title={
        <>
          BLOKC2, BLOKC5, BLOKC10. <em className="text-sand">Open them up.</em>
        </>
      }
      description="Three baskets with one rule: each token is weighted by its share of market cap, priced by Chainlink on Arbitrum. Pick one, then pick a component."
      actions={
        <Button href="/indices" variant="secondary">
          Compare and methodology
        </Button>
      }
    >
      <Reveal>
        <IndexExplorer />
      </Reveal>
    </Section>
  );
}

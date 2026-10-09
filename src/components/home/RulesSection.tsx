import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RulesDemo } from "@/components/guard/RulesDemo";

/**
 * Proof you can touch: after the layers, the same rules run against
 * situations a Garden might face, ending in a verdict you can trace to the
 * contract that enforces it. A dark band: it reads as a console.
 */
export function RulesSection() {
  return (
    <Section
      id="rules"
      tone="dark"
      eyebrow="Simulation"
      title={
        <>
          Watch a Garden <em className="text-sand">say no.</em>
        </>
      }
      description="Five things that could happen to a Garden, run through the checks its contracts enforce. Each trace links to the rule it comes from."
    >
      <Reveal>
        <RulesDemo />
      </Reveal>
    </Section>
  );
}

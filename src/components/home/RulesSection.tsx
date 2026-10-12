import { Reveal } from "@/components/ui/Reveal";
import { RulesDemo } from "@/components/guard/RulesDemo";

/**
 * Proof you can touch, inside the "Don't trust us. Check." section (D-08d):
 * after the security properties, the same rules run against situations a
 * Garden might face, ending in a verdict you can trace to the contract that
 * enforces it. The console is a Night-garden panel on the light page.
 *
 * `id="rules"` keeps every old /#rules link landing here.
 */
export function RulesSection() {
  return (
    <div id="rules" className="mt-16 sm:mt-20">
      <div className="mb-8 max-w-2xl">
        <p className="label-caps">Simulation</p>
        <h3 className="display mt-3 text-display-sm text-balance text-fg">
          Watch a Garden <em className="text-sand">say no.</em>
        </h3>
        <p className="mt-3 text-ui text-fg-muted">
          Five things that could happen to a Garden, run through the checks its contracts enforce. Each trace links to
          the rule it comes from.
        </p>
      </div>
      <Reveal className="theme-dark rounded-panel border border-subtle bg-canvas p-5 sm:p-8">
        <RulesDemo />
      </Reveal>
    </div>
  );
}

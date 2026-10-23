import { Reveal } from "@/components/ui/Reveal";
import { GuardScanner } from "@/components/guard/GuardScanner";

/**
 * Proof at a glance, inside the "Don't trust us. Check." section (D-08d):
 * after the security properties, the five situations from the rules demo
 * pass through a Garden's checks and come out stamped (GuardScanner). The
 * full console, with every check traced to its contract, is on /security;
 * the strip links there, so the home page stays short and ships no demo JS.
 *
 * `id="rules"` keeps every old /#rules link landing here.
 */
export function RulesSection() {
  return (
    <div id="rules" className="mt-16 sm:mt-20">
      <div className="mb-8 max-w-2xl">
        <p className="label-caps">Simulation</p>
        <h3 className="display mt-3 text-display-sm text-balance text-fg">
          Watch a Garden say no.
        </h3>
        <p className="mt-3 text-ui text-fg-muted">
          Five things that could happen to a Garden, run through the checks its contracts enforce. Run any of them
          step by step, traced to the rule it comes from, on the security page.
        </p>
      </div>
      <Reveal>
        <GuardScanner />
      </Reveal>
    </div>
  );
}

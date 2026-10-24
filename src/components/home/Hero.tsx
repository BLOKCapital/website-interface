import { Button } from "@/components/ui/Button";
import { RiskNote } from "@/components/ui/RiskNote";
import { links } from "@/lib/data/socials";
import { SplitText } from "@/components/motion/SplitText";
import { HeroGarden } from "./HeroGarden";

/**
 * Home hero, clean and minimal: a label, the headline, one sentence, two
 * actions and the risk line; beside them, one line-art drawing that shows
 * the single thing an index Garden does (HeroGarden: prices drift, it
 * rebalances itself). Nothing else competes with them.
 *
 * Entrance (D-32, PERF-01, MOT-01): the LCP group (h1, lead, CTAs) is at
 * full opacity on the first frame and only rises 8px; the h1 words ink in
 * from a readable grey. The drawing settles in after it and loops only on
 * screen, with its own Pause.
 */
export function Hero() {
  return (
    <section data-placement="hero" className="paper-ruled relative overflow-hidden">
      <div aria-hidden className="glow-leaf pointer-events-none absolute right-[-12%] top-[10%] h-[560px] w-[720px] opacity-50" />
      <div className="relative mx-auto grid w-full max-w-page items-center gap-16 px-gutter pb-24 pt-28 sm:pt-36 lg:grid-cols-12 lg:gap-12 lg:pb-32 lg:pt-44">
        <div className="lg:col-span-7">
          <p className="eyebrow animate-fade-in">Non-custodial index Gardens · Arbitrum One</p>
          <SplitText as="h1" reveal="load" delay={0} className="display mt-6 text-h1 text-balance text-fg">
            Grow your crypto. <em className="text-sand">Keep the keys.</em>
          </SplitText>
          <p className="mt-8 max-w-md animate-rise text-lead text-fg-muted">
            A smart wallet at your own address that follows an on-chain index and rebalances itself.
          </p>
          <p className="mt-6 animate-rise">
            <span className="tag-lime">sign in with Google · no seed phrase</span>
          </p>
          <div className="mt-8 flex animate-rise flex-wrap items-center gap-3">
            <Button href={links.app} size="lg" data-cta="hero_launch_app">
              Launch your Fund
            </Button>
            <Button href="/indices" size="lg" variant="secondary" data-cta="hero_explore_indices">
              Explore the indices
            </Button>
          </div>
          <RiskNote className="mt-10 animate-fade-in [animation-delay:150ms]" />
        </div>

        <HeroGarden className="mx-auto w-full max-w-[520px] animate-rise lg:col-span-5" />
      </div>
    </section>
  );
}

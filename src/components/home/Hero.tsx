import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { CheckIcon } from "@/components/ui/icons";
import { protocolStatus } from "@/lib/data/status";
import { HeroLive } from "@/components/live/HeroLive";

const d = (ms: number) => ({ animationDelay: `${ms}ms` });

/** Three facts a first-time visitor should leave with. All sourced (facts.ts). */
const facts = ["Your assets never leave your wallet", "No seed phrase with Google sign-in", "Audited by CredShields"];

/** The three properties that make a Garden different, pinned around the render. */
const chips = [
  { label: "Assets stay at your address", pos: "left-0 top-[18%]", delay: 700 },
  { label: "Every move written on-chain", pos: "right-0 top-[46%]", delay: 820 },
  { label: "Upgrades approved by the DAO", pos: "left-[6%] bottom-[12%]", delay: 940 },
];

/**
 * Home hero: what BLOK is, in one line; its status; where to go next. Server
 * component; the entrance is pure CSS so the headline paints with the HTML.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_40%,black,transparent)]" />
      <div className="relative mx-auto grid w-full max-w-page items-center gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-44">
        <div className="lg:col-span-7">
          <div className="animate-enter-fade">
            <Badge tone="current">{protocolStatus.label} on Arbitrum</Badge>
          </div>
          <h1 className="display mt-7 animate-enter-up text-h1 text-balance text-fg" style={d(80)}>
            Grow your crypto. <em className="text-sand">Keep the keys.</em>
          </h1>
          <p className="mt-7 max-w-xl animate-enter-up text-lead text-fg-muted" style={d(180)}>
            An exchange holds your crypto for you. A wallet leaves you doing all the work. BLOK Capital is the third
            option: a smart wallet at your own address that follows an on-chain index and rebalances itself, with every
            trade a transaction you can read.
          </p>
          <div className="mt-10 flex animate-enter-up flex-wrap gap-3" style={d(260)}>
            <Button href="/indices" size="lg">
              Explore the indices
            </Button>
            <Button href="#explore" size="lg" variant="secondary">
              How it works
            </Button>
          </div>
          <ul className="mt-10 flex animate-enter-up flex-col gap-3 text-small text-fg-muted sm:flex-row sm:flex-wrap sm:gap-x-6" style={d(340)}>
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckIcon className="shrink-0 text-leaf" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 animate-enter-up" style={d(420)}>
            <HeroLive />
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px] lg:col-span-5">
          <div aria-hidden className="glow-leaf absolute inset-[-10%] opacity-90" />
          <div className="absolute inset-[6%] animate-enter-fade" style={d(200)}>
            <div className="absolute inset-0 animate-float">
              <GardenAsset n={11} priority quality={95} sizes="(max-width: 1024px) 90vw, 520px" />
            </div>
          </div>
          {chips.map((c) => (
            <p
              key={c.label}
              className={`absolute ${c.pos} hidden animate-enter-up items-center gap-2 rounded-full border border-line/12 bg-card/80 px-3.5 py-2 text-caption text-fg shadow-[0_12px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md sm:inline-flex`}
              style={d(c.delay)}
            >
              <span aria-hidden className="size-1.5 rounded-full bg-leaf" />
              {c.label}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

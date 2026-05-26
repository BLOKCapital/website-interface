import { Button } from "@/components/ui/Button";
import { GardenAsset } from "@/components/ui/GardenAsset";

/**
 * Final CTA — the back cover of the journal.
 *
 * One sentence, one drawing, two ways out. No outlined watermark. No
 * Roman-numeral "Volume X · Closing" badge. Just a clean closing page.
 */
export function FinalCta() {
  return (
    <section id="plant" className="paper relative isolate overflow-hidden">
      {/* Warm halo behind the garden, moss + clay, no neon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 110%, rgb(var(--moss) / 0.18), transparent 70%), radial-gradient(40% 50% at 50% 0%, rgb(var(--clay) / 0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-32 pt-24 text-center sm:px-8 sm:pb-40 sm:pt-32">
        {/* Closing salutation */}
        <p className="script text-[26px] leading-none text-clay">
          with love, the gardeners
        </p>

        {/* Closing Garden render */}
        <div className="relative mt-10 size-[380px] animate-sway sm:size-[480px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgb(var(--clay) / 0.16), transparent 70%), radial-gradient(60% 60% at 50% 80%, rgb(var(--moss) / 0.22), transparent 70%)",
            }}
          />
          <GardenAsset n={4} sizes="(max-width: 768px) 90vw, 480px" />
        </div>

        <h2 className="display mt-8 text-[44px] leading-[1.02] text-ink sm:text-[64px] lg:text-[88px]">
          <span className="text-ink-muted">Plant your</span>
          <br />
          <em className="font-serif italic text-moss">Garden</em> today
          <span className="text-moss">.</span>
        </h2>

        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-ink-muted">
          One transaction. No custody handoff. Withdraw any time.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="https://discord.com/invite/blokc" size="lg" variant="primary">
            Join Discord
          </Button>
          <Button href="https://docs.blokcapital.io" size="lg" variant="outline">
            Read Docs
          </Button>
        </div>
      </div>
    </section>
  );
}

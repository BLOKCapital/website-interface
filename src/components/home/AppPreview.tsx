import { Section } from "@/components/ui/Section";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { links } from "@/lib/data/socials";
import { Badge } from "@/components/ui/Badge";
import { GardenScreen } from "./GardenScreen";
import { ScaledScreen } from "./ScaledScreen";

/**
 * The app (`#app`): a dark band, right after the facts, showing the BLOKC
 * app's Index Gardens screen in a browser frame: a Garden following BLOKC5,
 * on its Index tab. It's rebuilt in HTML from the app's own components and
 * tokens (GardenScreen), with example data, and the caption badges it
 * "Example". What's inside the app is the Products section's job, so it
 * isn't listed again here; the status is said once, in the description.
 */
export function AppPreview() {
  return (
    <Section
      id="app"
      tone="dark"
      align="center"
      // Clips the glow behind the frame, so it never widens the page.
      className="overflow-hidden"
      eyebrow="The app"
      title="One workspace for your Garden."
      description="blokc.app is where you open your smart wallet, follow a strategy and vote on the DAO."
      actions={
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button href={links.app} size="lg" data-cta="home_app_launch" data-placement="app_preview">
            Launch your Fund
          </Button>
          <ArrowLink href="#how">How it works</ArrowLink>
        </div>
      }
    >
      <Reveal className="relative mx-auto max-w-5xl">
        <div aria-hidden className="glow-leaf pointer-events-none absolute inset-x-[-12%] -top-24 bottom-[-10%] opacity-70" />
        <figure className="relative">
          <BrowserFrame url="blokc.app/index-gardens">
            {/* The app's Index Garden screen, rebuilt with example data, laid out at a real
                window width and scaled to the frame like a screenshot (ScaledScreen). */}
            <div className="relative">
              <ScaledScreen className="aspect-[9/16] sm:aspect-[4/3]">
                <GardenScreen />
              </ScaledScreen>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F3EEE3] to-transparent" />
            </div>
          </BrowserFrame>
          <figcaption className="mt-4 flex items-center justify-center gap-2 text-center text-caption text-fg-subtle">
            <Badge status="example" />
            The BLOKC app&apos;s Index Gardens screen: a Garden following BLOKC5.
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}

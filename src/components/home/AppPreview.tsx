import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { links } from "@/lib/data/socials";
import { AppTour } from "./AppTour";

/**
 * The app (`#app`): a dark band, right after the facts, with a short tour of
 * the BLOKC app's Index Gardens screen (AppTour): three steps beside the
 * screen, each pointing at its part of it. The screen is rebuilt in HTML from
 * the app's own components and tokens (GardenScreen), with example data, and
 * the tour says so. What's inside the app is the Products section's job, so
 * it isn't listed again here.
 */
export function AppPreview() {
  return (
    <Section
      id="app"
      tone="dark"
      // Clips the glow behind the frame, so it never widens the page. Clip,
      // not hidden: a hidden box can still be scrolled, and focusing a step
      // tab on a phone would slide the whole section sideways.
      className="overflow-clip"
      eyebrow="The app"
      title={
        <>
          One workspace for <em>your Garden.</em>
        </>
      }
      description="blokc.app is where you open your smart wallet, follow a strategy and vote on the DAO. Here's one Garden, following BLOKC5."
      actions={
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href={links.app} size="lg" data-cta="home_app_launch" data-placement="app_preview">
            Launch your Fund
          </Button>
          <ArrowLink href="#how">How it works</ArrowLink>
        </div>
      }
    >
      <Reveal>
        <AppTour />
      </Reveal>
    </Section>
  );
}

import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { DiscordIcon } from "@/components/ui/icons";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { protocolStatus } from "@/lib/data/status";
import { links, social } from "@/lib/data/socials";

/** Closing call to action, shared by every page: join the community. */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-line/[0.07] bg-surface">
      <div aria-hidden className="glow-leaf pointer-events-none absolute -bottom-40 right-0 h-[520px] w-[720px] opacity-70" />
      <div className="relative mx-auto grid w-full max-w-page items-center gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">{protocolStatus.label}</p>
          <h2 className="display mt-4 text-h2 text-balance text-fg">
            Be first to plant a <em className="text-sand">Garden.</em>
          </h2>
          <p className="mt-5 max-w-xl text-lead text-fg-muted">
            Gardens open to the public after testing. The community hears first, and the team is in the Discord every day.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={social("discord").href} size="lg">
              <DiscordIcon /> Join the Discord
            </Button>
            <Button href={links.docs} size="lg" variant="secondary">
              Read the docs
            </Button>
          </div>
          <SocialLinks only={["x", "telegram", "farcaster", "github", "youtube"]} className="mt-8" />
        </div>
        <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] lg:col-span-5 lg:block">
          <div className="absolute inset-0 animate-float">
            <GardenAsset n={4} sizes="420px" />
          </div>
        </div>
      </div>
    </section>
  );
}

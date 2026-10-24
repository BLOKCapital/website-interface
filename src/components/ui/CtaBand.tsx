import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/icons";
import { DISCORD_LABEL } from "@/lib/nav";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Icon } from "@/components/ui/Icon";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { DotField } from "@/components/motion/DotField";
import { Handwrite } from "@/components/motion/Handwrite";
import { protocolStatus } from "@/lib/data/status";
import { links, social } from "@/lib/data/socials";

export type CtaContext = "default" | "index" | "protocol";

// Copy: docs/audit/findings/I-content-conversion.md §3.2. The space before
// each payoff word lives in the same text node as the words before it: a
// lone {" "} becomes its own text node after a React <!-- --> marker, and
// Chrome then drops it from the heading's accessible name (A11Y-21).
function copy(context: CtaContext, indexName?: string): { title: ReactNode; lead: string } {
  switch (context) {
    case "index":
      return {
        title: (
          <>
            {`${indexName ?? "This index"} opens with the `}
            <em className="text-sand">
              <Handwrite text="public launch." />
            </em>
          </>
        ),
        lead: "Follow it from your own Garden when Gardens open. Until then, ask the team anything in the Discord.",
      };
    case "protocol":
      return {
        title: (
          <>
            {"Be first to plant a "}
            <em className="text-sand">
              <Handwrite text="Garden." />
            </em>
          </>
        ),
        lead: "Read the code, then ask the people who wrote it in the Discord.",
      };
    default:
      return {
        title: (
          <>
            {"Be first to plant a "}
            <em className="text-sand">
              <Handwrite text="Garden." />
            </em>
          </>
        ),
        lead: `${protocolStatus.access} The community and the team are in the Discord every day.`,
      };
  }
}

/**
 * Closing call to action, shared by every page: the app and the community. The
 * payoff word writes itself in by hand, over a field of rising signal rings (a
 * canvas that runs at 12 fps and settles; see useFieldLoop). A Night-garden
 * band that closes the page, above the light footer.
 *
 * `context` tunes the copy to what the visitor just read: "index" (pass
 * `indexName`, e.g. BLOKC5) on index pages, "protocol" on the protocol and
 * security pages; the default everywhere else, including /token.
 */
export function CtaBand({ context = "default", indexName }: { context?: CtaContext; indexName?: string }) {
  const { title, lead } = copy(context, indexName);
  const x = social("x");
  return (
    <section id="cta_band" data-band="dark" className="theme-dark relative overflow-hidden bg-surface">
      <CornerMarks only="top" />
      <div aria-hidden className="glow-leaf pointer-events-none absolute -bottom-40 right-0 h-[520px] w-[720px] opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_70%_55%,black,transparent)] lg:block">
        <DotField variant="rings" tone="leaf" gap={11} />
      </div>
      <Container className="relative grid items-center gap-10 py-section-sm lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">Join in</p>
          <h2 className="display mt-4 text-h2 text-balance text-fg">{title}</h2>
          <p className="mt-5 max-w-xl text-lead text-fg-muted">{lead}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={links.app} size="lg" data-cta="cta_band_launch_app" data-placement="cta_band">
              Launch your Fund
            </Button>
            <Button href={social("discord").href} size="lg" variant="secondary" data-placement="cta_band">
              <DiscordIcon /> {DISCORD_LABEL}
            </Button>
          </div>
          <p className="mt-5 text-small text-fg-muted">
            {"Launch news goes out on X and in the Discord. "}
            <a
              href={x.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="cta_band_follow_x"
              data-placement="cta_band"
              className="inline-flex items-center gap-0.5 rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
            >
              Follow us on X
              <Icon name="external" size="sm" className="-mx-1" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
          <SocialLinks only={["x", "instagram", "telegram", "farcaster", "github", "youtube"]} placement="cta_band" className="mt-6" />
        </div>
        <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] lg:col-span-5 lg:block">
          <div className="absolute inset-0 animate-float">
            <GardenAsset n={4} sizes="420px" className="sticker" />
          </div>
        </div>
      </Container>
    </section>
  );
}

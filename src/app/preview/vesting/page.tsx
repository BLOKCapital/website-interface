import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { VestingExplorer } from "@/components/token/VestingExplorer";
import { VestingSummary, VestingTerms } from "@/components/token/VestingTerms";
import { VestingVerify } from "@/components/token/VestingVerify";
import { VaultPreview } from "@/components/token/VaultPreview";
import { vesting } from "@/lib/data/vesting";
import { pageMetadata } from "@/lib/seo/metadata";

// A design review page: not in the sitemap, not linked, not indexed.
export const metadata: Metadata = pageMetadata({
  title: "Vesting preview",
  description: "Design preview of the $BLOKC vesting section. Example terms only.",
  path: null,
  robots: { index: false, follow: false },
});

export default function VestingPreviewPage() {
  return (
    <>
      <div className="border-b border-warning/35 bg-warning/6">
        <p className="mx-auto max-w-6xl px-4 py-3 text-center text-small text-warning-text sm:px-6">
          Design preview, not linked from the site. Every vesting term and amount on this page is an example.
        </p>
      </div>

      {/* What would sit on /token, after #allocation. */}
      <Section
        id="vesting"
        eyebrow="Vesting & unlocks"
        title={
          <>
            When the 10B <em>unlocks.</em>
          </>
        }
        description="Each share of the supply unlocks on its own schedule, counted from the TGE. Move through the months to see how much is out."
      >
        <VestingSummary items={vesting} />
        <div className="mt-5">
          <VestingExplorer items={vesting} total={10_000_000_000} symbol="BLOKC" />
        </div>
        <div className="mt-5">
          <VestingTerms items={vesting} />
        </div>
      </Section>

      <Section
        id="verify"
        tone="surface"
        eyebrow="Verify it yourself"
        title="Every lock, on chain."
        description="The schedule is enforced by contracts anyone can read. Their addresses and balances go here once they deploy."
      >
        <VestingVerify />
      </Section>

      {/* A concept for the contributor app, drawn in this site's theme. */}
      <Section
        id="vault"
        eyebrow="Concept · contributor app"
        title="Your own vault."
        description="How a contributor's vault could read in the app: what's claimed, ready, locked and still provisional, and when it unlocks, in your time and in UTC."
      >
        <VaultPreview />
      </Section>
    </>
  );
}

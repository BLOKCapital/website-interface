import { Section } from "@/components/ui/Section";
import { HowItWorksScroller, type ScrollStep } from "@/components/home/HowItWorksScroller";

const steps: ScrollStep[] = [
  {
    title: "Open a Garden",
    tag: "Open",
    body: "Sign in with Google (no seed phrase) or your own wallet. You get a smart-contract wallet (ERC-4337) at your own address.",
    chain: "ERC-4337 account · ownership is an NFT",
    callout: "The Garden's ownership is an NFT in your wallet.",
  },
  {
    title: "Fund it",
    tag: "Fund",
    body: "Buy USDC by card or bank through an on-ramp such as Transak, or send crypto you already hold. Funds land in your Garden, not a pooled account.",
    chain: "USDC by card or bank · or send crypto",
    callout: "Card or bank through an on-ramp, or send crypto you hold.",
  },
  {
    title: "Choose a strategy",
    tag: "Strategy",
    body: "Follow BLOKC2, BLOKC5 or BLOKC10: market-cap-weighted indices that rebalance on-chain when they drift. From 2027, hire a Gardener: an on-chain manager you can revoke with one signature.",
    chain: "BLOKC2 · BLOKC5 · BLOKC10 · Gardeners 2027",
    callout: "Rebalances only when a holding drifts more than 2% off target.",
  },
];

/** Three steps told as a scroll story beside a Garden that changes with them. */
export function HowItWorks() {
  return (
    <Section
      id="how"
      tone="surface"
      eyebrow="How it works"
      title={
        <>
          Your wallet, <em className="text-sand">a strategy on top.</em>
        </>
      }
      description="A Garden is a smart wallet only you control. Strategies can rebalance inside it; they can never move funds out."
    >
      <HowItWorksScroller steps={steps} />
    </Section>
  );
}

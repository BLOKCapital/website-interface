import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
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

/**
 * Three steps told as a scroll story beside a Garden that changes with them,
 * then one line to the six-layer explorer, which now lives on /protocol
 * (D-08a). `id="explore"` keeps old /#explore links landing on that line.
 */
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
      <p id="explore" className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-subtle pt-6 text-ui text-fg-muted">
        {/* The space stays inside this text node (see CtaBand, A11Y-21). */}
        {"Six layers sit under every Garden, from your sign-in to the DAO. "}
        <Link
          href="/protocol#explore"
          prefetch={false}
          data-cta="how_explore_layers"
          className="group/x inline-flex items-center gap-1.5 rounded-xs py-2 font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg"
        >
          Explore all six layers
          <Icon name="arrow-right" size="sm" className="transition-transform duration-fast can-hover:group-hover/x:translate-x-0.5" />
        </Link>
      </p>
    </Section>
  );
}

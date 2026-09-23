import { Section } from "@/components/ui/Section";
import { Stagger, RevealItem, Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CustodyDiagram } from "@/components/home/CustodyDiagram";

const steps = [
  {
    title: "Open a Garden",
    body: "Sign in with Google (no seed phrase) or your own wallet. You get a smart-contract wallet (ERC-4337) at your own address.",
  },
  {
    title: "Fund it",
    body: "Buy USDC by card or bank through an on-ramp such as Transak, or send crypto you already hold. Funds land in your Garden, not a pooled account.",
  },
  {
    title: "Choose a strategy",
    body: "Follow a curated index that rebalances itself on a DAO-set cadence. From 2027, hire a Gardener: an on-chain manager you can revoke with one signature.",
  },
];

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
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <Stagger as="ol" className="space-y-8 lg:col-span-5">
          {steps.map((s, i) => (
            <RevealItem as="li" key={s.title} className="grid grid-cols-[40px_1fr] gap-4">
              <span className="inline-flex size-10 items-center justify-center rounded-full border border-leaf/35 bg-leaf/10 font-mono text-[13px] text-leaf">
                {i + 1}
              </span>
              <div>
                <h3 className="text-h4 font-medium text-fg">{s.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-fg-muted">{s.body}</p>
              </div>
            </RevealItem>
          ))}
          <RevealItem as="li" className="pl-14">
            <ArrowLink href="/protocol">The full protocol</ArrowLink>
          </RevealItem>
        </Stagger>
        <Reveal className="hidden rounded-3xl border border-line/[0.08] bg-canvas/60 p-6 sm:block sm:p-8 lg:col-span-7">
          <CustodyDiagram />
        </Reveal>
      </div>
    </Section>
  );
}

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

/** Only what the protocol commits to: where fees are set by DAO vote, say so. */
const fees = [
  { label: "Protocol fee", value: "None at launch", body: "Gasless and fee-free at launch. Any future protocol fee is set by DAO vote." },
  { label: "Gardener fees", value: "Set by each Gardener", body: "Written into the strategy, capped by DAO-set ceilings. Gardeners open in 2027." },
  { label: "Swaps", value: "Venue costs", body: "Trades pay the pool fees and price impact of the venue they route through." },
  { label: "Card and bank", value: "On-ramp's own fees", body: "Partners such as Transak charge their own fees and run their own KYC." },
];

const risks = [
  { label: "Smart-contract risk", body: "Audits reduce risk, they don't remove it. A bug could lose funds." },
  { label: "Market risk", body: "Crypto prices are volatile. An index or strategy can lose value quickly." },
  { label: "Stablecoin risk", body: "USDC aims to hold $1 but can lose its peg in extreme conditions." },
  { label: "Manager risk", body: "A Gardener can make losing trades within the permissions you grant." },
  { label: "Third-party risk", body: "Gardens route through outside DEXs, lending markets, oracles and on-ramps." },
  { label: "Access risk", body: "BLOK Capital can't recover accounts. Set up recovery guardians." },
];

export function FeesRisks() {
  return (
    <Section
      id="fees"
      tone="surface"
      eyebrow="Fees & risks"
      title={
        <>
          What it costs, <em className="text-sand">what can go wrong.</em>
        </>
      }
      description="Read this before you plant anything you can't afford to lose."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Card className="h-full">
            <h3 className="text-h4 font-medium text-fg">Fees</h3>
            <dl className="mt-4 divide-y divide-line/[0.08]">
              {fees.map((f) => (
                <div key={f.label} className="py-4 last:pb-0">
                  <dt className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-[15px] text-fg">{f.label}</span>
                    <span className="font-mono text-[12.5px] text-leaf">{f.value}</span>
                  </dt>
                  <dd className="mt-1 text-small text-fg-muted">{f.body}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7">
          <Card className="h-full">
            <h3 className="text-h4 font-medium text-fg">Risks</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {risks.map((r) => (
                <li key={r.label} className="border-l-2 border-negative/50 pl-4">
                  <p className="text-[15px] text-fg">{r.label}</p>
                  <p className="mt-1 text-small text-fg-muted">{r.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-7 border-t border-line/[0.08] pt-5 text-caption text-fg-subtle">
              Not investment advice. Full terms in the{" "}
              <Link href="/legal/user-agreement" className="text-fg-muted underline underline-offset-2 hover:text-fg">
                User Agreement
              </Link>
              .
            </p>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

import { Section } from "@/components/ui/Section";
import { FeatureBlock } from "@/components/features/FeatureBlock";
import { SoulboundBadge } from "@/components/ui/SoulboundBadge";

// Hoisted so these element objects aren't recreated on each render (the mock
// components are hoisted function declarations, so referencing them here is safe).
const onboardVisual = <OnboardMock />;
const publishVisual = <PublishMock />;
const feeVisual = <FeeMock />;
const repVisual = <RepMock />;

export function ForManagers() {
  return (
    <Section
      id="managers"
      eyebrow="For Managers"
      title={
        <>
          <em className="font-serif italic text-moss">Gardeners.</em>
        </>
      }
      description="Run strategies on-chain, settle fees automatically, build a reputation that travels with you."
    >
      <div className="space-y-20 lg:space-y-28">
        <FeatureBlock
          index={1}
          eyebrow="Onboard in one click"
          title={
            <>
              Send a link. They sign{" "}
              <em className="font-serif italic text-clay">once.</em> Done.
            </>
          }
          body={
            <p>
              No paperwork. No escrow. No third-party custodian. Investors
              authorize your strategy through their own wallet, and revoke it
              the same way.
            </p>
          }
          visual={onboardVisual}
        />

        <FeatureBlock
          reverse
          index={2}
          eyebrow="Publish on-chain"
          title={
            <>
              Your strategy is{" "}
              <em className="font-serif italic text-moss">a contract.</em>
            </>
          }
          body={
            <p>
              Deploy strategies as facets. Update parameters via DAO-approved
              upgrades. Every position you open writes to your soulbound badge.
            </p>
          }
          visual={publishVisual}
        />

        <FeatureBlock
          index={3}
          eyebrow="Auto-settled fees"
          title={
            <>
              No invoicing. No chasing.{" "}
              <em className="font-serif italic text-clay">No middle person.</em>
            </>
          }
          body={
            <p>
              Fee splits are encoded in the strategy. The protocol pays you on
              every settlement, in the asset of your choice. Capped by DAO-set
              ceilings.
            </p>
          }
          visual={feeVisual}
        />

        <FeatureBlock
          reverse
          index={4}
          eyebrow="Reputation that travels"
          title={
            <>
              An{" "}
              <em className="font-serif italic text-moss">ERC-5484</em>{" "}
              soulbound badge.
            </>
          }
          body={
            <p>
              Your reputation is yours alone, non-transferable, verifiable
              from any dapp. When you change the world&apos;s mind about you,
              no platform owns the proof.
            </p>
          }
          visual={repVisual}
        />
      </div>
    </Section>
  );
}

/* ---------- mocks ---------------------------------------------------------- */

function OnboardMock() {
  return (
    <div>
      <p className="eyebrow text-moss">Follow flow</p>
      <ol className="mt-4 space-y-3">
        {[
          "Investor opens the link",
          "Connects their wallet",
          "Signs follow(), one transaction",
          "Garden mirrors the strategy",
        ].map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-moss/40 bg-moss/[0.08] text-[11px] font-medium text-moss-deep">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[13.5px] text-ink-muted">{s}</span>
          </li>
        ))}
      </ol>

      <div aria-hidden className="rule-hand mt-7" />
      <p className="mt-3 text-[11.5px] leading-relaxed text-ink-subtle">
        Revocation is the same path, in reverse.
      </p>
    </div>
  );
}

function PublishMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="eyebrow text-moss">strategy.publish()</p>
        <span className="text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
          Solidity · 0.8.26
        </span>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-ink/10 bg-paper-deep/60 p-4 font-mono text-[12px] text-ink-muted">
        <code>
          <span className="text-moss-deep">strategy</span>.
          <span className="text-moss-deep">publish</span>({"{"}
          {"\n  "}name: <span className="text-clay-deep">&quot;momentum-v3&quot;</span>,
          {"\n  "}universe: [ETH, ARB, BLOKC],
          {"\n  "}rebalance: <span className="text-clay-deep">&quot;weekly&quot;</span>,
          {"\n  "}fee: {"{ perf: "}
          <span className="text-clay-deep">3</span>
          {", flat: "}
          <span className="text-clay-deep">0</span>
          {" }"}
          {"\n  "}upgradable: <span className="text-clay-deep">true</span>,
          {"\n"}
          {"}"})
          {"\n"}
          <span className="text-ink-subtle">
            {"// → tx 0x8a…f4c2 · gas $0.06"}
          </span>
        </code>
      </pre>
    </div>
  );
}

function FeeMock() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow text-moss">Last settlement</p>
        <p className="script text-[18px] leading-none text-clay">№ 1,284</p>
      </div>
      <ul className="mt-4 space-y-2 font-mono text-[12px]">
        {[
          { label: "Manager fee", val: "+182.40 USDC", c: "text-moss-deep" },
          { label: "Protocol fee", val: "+45.60 USDC", c: "text-ink" },
          {
            label: "Investor net",
            val: "+1,612.80 USDC",
            c: "text-clay-deep",
          },
        ].map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-ink/10 bg-paper-deep/40 px-3 py-2"
          >
            <span className="font-sans text-[12px] text-ink-muted">
              {r.label}
            </span>
            <span className={r.c}>{r.val}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11.5px] leading-relaxed text-ink-subtle">
        Illustrative · Protocol is gasless and fee-free at launch. Fee
        parameters will be set by DAO vote.
      </p>
    </div>
  );
}

function RepMock() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <SoulboundBadge score={94} className="scale-150" />
      <div>
        <p className="text-[15px] font-medium text-ink">
          Mango Grove · 94 / 100
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
          Earned across 1,284 trades. Verified by ERC-5484 soulbound token.
          Cannot be sold or transferred.
        </p>
      </div>
    </div>
  );
}

import { Section } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CopyButton } from "@/components/ui/CopyButton";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { BLOKC_TOKEN, TOKEN_DOCS } from "@/lib/data/token";
import { protocolStatus } from "@/lib/data/status";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

/**
 * "Before you get any $BLOKC" (after Safenet's "Where can you stake SAFE",
 * which says plainly what the foundation doesn't run): three checks, each a
 * claim the site already makes, never a new one. When it launches (the IDO
 * date in status.ts), which contract (the address the token docs publish),
 * and who to trust (the SafetyNotice rule, word for word). It says nothing
 * about sales before the IDO: the site doesn't, so neither does this.
 */
export function TokenChecks() {
  return (
    <Section
      id="checks"
      tone="surface"
      eyebrow="Before you get any $BLOKC"
      title="Three checks."
      description="Before you hold, buy or sign for any $BLOKC, check these. Each one is stated elsewhere on this site, with its source."
    >
      <Stagger as="ol" className="grid gap-5 md:grid-cols-3">
        <RevealItem as="li" className="flex flex-col rounded-card border border-subtle bg-card p-6">
          <p className="font-mono text-label text-leaf">01 · When</p>
          <h3 className="mt-3 text-h4 font-medium text-fg">At the IDO, planned for {protocolStatus.token}</h3>
          <p className="mt-2 text-small text-fg-muted">
            That&apos;s when $BLOKC launches and holders start to vote. Until then, the core members listed on Aragon vote.
          </p>
          <ArrowLink href="#allocation" className="mt-auto pt-5 text-small">
            The token timeline
          </ArrowLink>
        </RevealItem>
        <RevealItem as="li" className="flex flex-col rounded-card border border-subtle bg-card p-6">
          <p className="font-mono text-label text-leaf">02 · Which contract</p>
          <h3 className="mt-3 text-h4 font-medium text-fg">Only this address, on Arbitrum One</h3>
          <p className="mt-3 flex flex-wrap items-center gap-2">
            <code id="checks-address" title={BLOKC_TOKEN} className="font-mono text-small text-fg">
              {short(BLOKC_TOKEN)}
            </code>
            <CopyButton value={BLOKC_TOKEN} label="Copy address" selectTarget="checks-address" />
          </p>
          <p className="mt-3 text-small text-fg-muted">Check it against the token docs before you send anything.</p>
          <ArrowLink href={TOKEN_DOCS} className="mt-auto pt-5 text-small">
            Token docs
          </ArrowLink>
        </RevealItem>
        <RevealItem as="li" className="flex flex-col rounded-card border border-warning/35 bg-warning/6 p-6">
          <p className="font-mono text-label text-warning-text">03 · Who to trust</p>
          <h3 className="mt-3 text-h4 font-medium text-fg">Not a DM</h3>
          <p className="mt-2 text-small text-fg-muted">
            The BLOK Capital team will never DM you first, and never asks for your seed phrase, private keys or Google login, or
            for you to sign a transaction or &lsquo;verify&rsquo; a wallet.
          </p>
          <ArrowLink href="/security#official" className="mt-auto pt-5 text-small">
            Official links
          </ArrowLink>
        </RevealItem>
      </Stagger>
    </Section>
  );
}

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";

// Which contract holds which shares. No addresses yet: none are deployed on
// Arbitrum One, and the site never shows an address it can't source.
const contracts = [
  { name: "Team & advisors vesting", holds: "Team, Advisors" },
  { name: "Investor vesting", holds: "Seed, Presale, IDO" },
  { name: "Ecosystem vesting", holds: "Product development, Treasury, Marketing & PR, Bug bounty" },
  { name: "Contributor vaults (factory)", holds: "Community, Influencers" },
];

/**
 * "Verify it yourself": every vesting contract with its address and the
 * balance it holds, read from chain (TokenContract's pattern), plus the
 * one rule about claims. Until the contracts deploy, each row says so.
 */
export function VestingVerify() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="rounded-card border border-subtle bg-card shadow-soft lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle px-5 py-3.5">
          <p className="text-small font-medium text-fg">Vesting contracts on Arbitrum One</p>
          <Badge status="planned" />
        </div>
        <ul>
          {contracts.map((c) => (
            <li key={c.name} className="grid gap-x-6 gap-y-1 border-b border-subtle px-5 py-4 last:border-0 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="text-small font-medium text-fg">{c.name}</p>
                <p className="mt-0.5 text-caption text-fg-muted">Holds: {c.holds}</p>
              </div>
              <div className="sm:text-right">
                <p className="font-mono text-caption text-fg-subtle">Address published at deployment</p>
                <p className="mt-0.5 font-mono text-caption text-fg-subtle">Locked balance, read from chain: —</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="border-t border-subtle px-5 py-3 text-caption text-fg-subtle">
          Once deployed: each address with Arbiscan and copy, its live balance, and circulating supply as total supply minus what these
          contracts hold.
        </p>
      </div>

      <div className="flex flex-col rounded-card border border-warning/35 bg-warning/6 p-6 shadow-soft lg:col-span-4">
        <p className="font-mono text-label text-warning-text">04 · Claims</p>
        <h3 className="mt-3 text-h4 font-bold tracking-tight text-fg">A claim never asks for an approval</h3>
        <p className="mt-2 text-small text-fg-muted">
          You claim vested $BLOKC only in the official app, never on this site and never from a link in a DM. A real claim sends tokens to
          you: it never asks you to approve tokens, sign a permit or connect to &lsquo;verify&rsquo; a wallet.
        </p>
        <ArrowLink href="/security#official" className="mt-auto pt-5 text-small">
          Official links
        </ArrowLink>
      </div>
    </div>
  );
}

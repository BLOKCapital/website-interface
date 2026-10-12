import { audits } from "@/lib/data/audits";
import { CORE_REPO_URL, sources } from "@/lib/data/indices";
import { BLOKC_TOKEN, TOKEN_DOCS } from "@/lib/data/token";
import { ARBISCAN } from "@/lib/live/rpc";

/**
 * The contract registry (INS-04): every contract the site names, what it
 * does, and where to check it.
 *
 * Rules:
 * - An address appears only once it's published in the docs (today: the
 *   $BLOKC token). Every other row reads "Not deployed yet". Never put a
 *   placeholder or test address here.
 * - "Source verified" is never claimed: a deployed row links to Arbiscan's
 *   code tab so the reader checks it; an undeployed row has nothing to check.
 * - Audit coverage repeats only what /security#audits states. Where the site
 *   doesn't say, the cell is empty ("—"), not a guess.
 * When mainnet addresses are published, add `address` from the docs page
 * (links.docsAddresses) in EIP-55 form, and the rest of the row follows.
 */

export type RegistryRow = {
  id: string;
  name: string;
  /** What it does, in words already on the site. */
  what: string;
  /** Its source code, where the site already links it. */
  code?: { label: string; href: string };
  /** Only once published (EIP-55). */
  address?: string;
  /** Where the address is published. */
  publishedAt?: { label: string; href: string };
  audit?: { text: string; covered: boolean; href?: string };
};

const report = audits.find((a) => a.kind === "report")!;

/** Arbiscan's code tab for an address: where a reader checks verification. */
export const arbiscanCode = (address: string) => `${ARBISCAN}/address/${address}#code`;
export const arbiscanToken = (address: string) => `${ARBISCAN}/token/${address}`;

export const registry: RegistryRow[] = [
  {
    id: "blokc",
    name: "$BLOKC token",
    what: "The governance token (ERC-20), 10B supply, on Arbitrum One.",
    address: BLOKC_TOKEN,
    publishedAt: { label: "Token docs", href: TOKEN_DOCS },
    // The one published audit covers Garden contracts only (audits.ts).
    audit: { text: `Not in the published audit (${report.coverage?.covered ?? "Garden contracts"} only)`, covered: false },
  },
  {
    id: "garden",
    name: "Garden",
    what: "Your smart wallet: an EIP-2535 Diamond at your address, extended by facets.",
    code: { label: "src/garden", href: `${CORE_REPO_URL}/tree/main/src/garden` },
    audit: {
      text: `${report.coverage?.covered ?? "Garden contracts"}: ${report.partner}, ${report.auditedOn}`,
      covered: true,
      href: report.url,
    },
  },
  {
    id: "garden-factory",
    name: "Garden Factory",
    what: "Deploys each Garden at your address (CREATE2, up to 10 per user); refuses new Gardens while the protocol is paused.",
    // TODO(owner): audit coverage. The site doesn't say whether the factory is
    // inside "Garden contracts", so the cell stays empty.
  },
  {
    id: "facet-registry",
    name: "Facet Registry",
    what: "The facets the DAO has approved. A Garden's Upgrade facet checks new code against it.",
    // TODO(owner): audit coverage, as for the factory.
  },
  {
    id: "indices",
    name: "Index contracts",
    what: "Index, IndexFactory and IndexComponentRegistry: each index's components and weights, priced by Chainlink.",
    code: { label: "Index.sol", href: sources.index },
    audit: { text: "No published audit yet", covered: false },
  },
  {
    id: "rebalancer",
    name: "Rebalancer",
    what: "Brings every Garden on an index back to target in one pooled trade: past 2% drift, at most daily, ≤ 0.5% value loss.",
    code: { label: "Rebalancer.sol", href: sources.rebalancer },
    audit: { text: "No published audit yet", covered: false },
  },
];

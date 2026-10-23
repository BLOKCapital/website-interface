import { links, social } from "./socials";
import { protocolStatus } from "./status";
import { auditStatus } from "./audits";

/** The /contact FAQ's groups; the home page keeps the list order and ignores them. */
export const faqTopics = [
  { id: "basics", label: "Basics" },
  { id: "money", label: "Your money" },
  { id: "safety", label: "Safety" },
] as const;
export type FaqTopic = (typeof faqTopics)[number]["id"];

export type Faq = {
  question: string;
  /** Its group on /contact. */
  topic: FaqTopic;
  /** Plain text, no links: it also feeds the FAQPage JSON-LD and /llms-full.txt. */
  answer: string;
  /** Optional next step, shown under the answer. Not part of the JSON-LD. */
  cta?: { label: string; href: string };
};

const discord = social("discord").href;

/**
 * Every answer must agree with lib/seo/facts.ts, lib/data/status.ts and the
 * User Agreement. These also feed the FAQPage JSON-LD and /llms-full.txt.
 * Add a question only when its full answer is already stated on the site.
 *
 * The home page shows the first five (CRO-08): what it is, who holds the
 * funds, when it opens, the audit, and the cost.
 */
export const faqs: Faq[] = [
  {
    question: "What is BLOK Capital?",
    topic: "basics",
    answer:
      "A non-custodial wealth-management protocol on Arbitrum. You follow an on-chain index (components chosen by the team and approved by the DAO; weights set on-chain by market cap) or, from 2027, hire an on-chain manager, and your assets never leave your own smart-contract wallet.",
  },
  {
    question: "Who holds my funds?",
    topic: "money",
    answer:
      "You do. Your Garden is a smart-contract wallet at your own address. A strategy can rebalance inside it, but only you can move funds out: not BLOK Capital, and not a manager you follow.",
  },
  {
    // Same message as the CTA band (protocolStatus.access).
    question: "When can I use it?",
    topic: "basics",
    answer:
      `Not for everyone yet: ${protocolStatus.access} Launch news goes out on X and in the Discord.`,
    cta: { label: "Join the Discord", href: discord },
  },
  {
    question: "Is it audited?",
    topic: "safety",
    answer:
      `${auditStatus.detail} Audits reduce risk; they don't remove it. Only deposit what you can afford to lose.`,
  },
  {
    question: "What does it cost?",
    topic: "money",
    answer:
      "The protocol is gasless and fee-free at launch; any future protocol fee is set by DAO vote. Gardeners (from 2027) set their own fees within DAO ceilings. Swaps pay the venue's usual costs, and on-ramps like Transak charge their own fees.",
  },
  {
    // The steps are the home page's How it works, in order.
    question: "How do I get started?",
    topic: "basics",
    answer:
      "Once Gardens open: sign in with Google (no seed phrase) or your own wallet to open a Garden, fund it with USDC by card or bank or with crypto you already hold, then choose an index to follow.",
    cta: { label: "Launch your fund", href: links.app },
  },
  {
    question: "Do I need a seed phrase?",
    topic: "safety",
    answer:
      "Not if you sign in with Google: Web3Auth's MPC ties access to your login. You can also use your own wallet, in which case its seed phrase is your responsibility. Add recovery guardians either way; BLOK Capital can't restore an account.",
  },
  {
    question: "How do I add or withdraw funds?",
    topic: "money",
    answer:
      "Buy USDC by card or bank through an on-ramp such as Transak, which runs its own KYC, or send crypto you already hold. Withdraw the same way, any time.",
  },
  {
    question: "What are stablecoins?",
    topic: "basics",
    answer:
      "Crypto-assets designed to track a currency, usually the US dollar. BLOK Capital uses USDC, issued by Circle. Stablecoins aim to hold their peg but can lose it in extreme conditions.",
  },
  {
    question: "Is there a minimum deposit?",
    topic: "money",
    answer: "No. You can start a Garden with a small amount.",
  },
  {
    question: "Are there geographic restrictions?",
    topic: "money",
    answer:
      "Yes. The protocol can't be used from sanctioned jurisdictions (including Cuba, Iran, North Korea, Syria and sanctioned regions of Ukraine) or by sanctioned persons. The User Agreement has the full terms, and on-ramps set their own country availability.",
  },
  {
    question: "How do I report a security issue?",
    topic: "safety",
    answer:
      "Open a private ticket in the BLOK Capital Discord with steps to reproduce and impact. Please don't post it in a public channel or a public GitHub issue. We reply within 24 hours.",
    cta: { label: "Open a private ticket in Discord", href: discord },
  },
];

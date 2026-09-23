export type Faq = {
  question: string;
  answer: string;
};

/**
 * Every answer must agree with lib/seo/facts.ts, lib/data/status.ts and the
 * User Agreement. These also feed the FAQPage JSON-LD and /llms-full.txt.
 */
export const faqs: Faq[] = [
  {
    question: "What is BLOK Capital?",
    answer:
      "A non-custodial wealth-management protocol on Arbitrum. You follow a professionally curated on-chain index or, from 2027, hire an on-chain manager, and your assets never leave your own smart-contract wallet. It's currently in private testing.",
  },
  {
    question: "Who holds my funds?",
    answer:
      "You do. Your Garden is a smart-contract wallet at your own address. A strategy can rebalance inside it, but only you can move funds out: not BLOK Capital, and not a manager you follow.",
  },
  {
    question: "Do I need a seed phrase?",
    answer:
      "Not if you sign in with Google: Web3Auth's MPC ties access to your login. You can also use your own wallet, in which case its seed phrase is your responsibility. Add recovery guardians either way; BLOK Capital can't restore an account.",
  },
  {
    question: "How do I get started?",
    answer:
      "BLOK Capital is in private testing, so Gardens aren't open to the public yet. Join the Discord to hear first when they open.",
  },
  {
    question: "What does it cost?",
    answer:
      "The protocol is gasless and fee-free at launch; any future protocol fee is set by DAO vote. Gardeners (from 2027) set their own fees within DAO ceilings. Swaps pay the venue's usual costs, and on-ramps like Transak charge their own fees.",
  },
  {
    question: "Is it audited?",
    answer:
      "The v1.0 contracts were audited by CredShields in December 2024, and SolidityScan and Octane re-scan them on every release. Audits reduce risk; they don't remove it. Only deposit what you can afford to lose.",
  },
  {
    question: "How do I add or withdraw funds?",
    answer:
      "Buy USDC by card or bank through an on-ramp partner such as Transak, which runs its own KYC, or send crypto you already hold. Withdraw the same way, any time.",
  },
  {
    question: "What are stablecoins?",
    answer:
      "Crypto-assets designed to track a currency, usually the US dollar. BLOK Capital uses USDC, issued by Circle. Stablecoins aim to hold their peg but can lose it in extreme conditions.",
  },
  {
    question: "Is there a minimum deposit?",
    answer: "No. You can start a Garden with a small amount.",
  },
  {
    question: "Are there geographic restrictions?",
    answer:
      "Yes. The protocol can't be used from sanctioned jurisdictions (including Cuba, Iran, North Korea, Syria and sanctioned regions of Ukraine) or by sanctioned persons. The User Agreement has the full terms, and on-ramp partners set their own country availability.",
  },
  {
    question: "How do I report a security issue?",
    answer:
      "Open a private ticket in the BLOK Capital Discord with steps to reproduce and impact. Please don't post it in a public channel or a public GitHub issue. We reply within 24 hours.",
  },
];

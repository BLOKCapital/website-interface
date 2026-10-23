import { IntentLink } from "@/components/ui/IntentLink";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { FaqHash } from "@/components/ui/FaqHash";

/**
 * One question. Typed here rather than imported from lib/data/faqs.ts, so
 * the list accepts that data whatever optional fields it grows.
 */
export type FaqItem = {
  question: string;
  /**
   * Plain text, so the FAQPage JSON-LD stays clean. It may contain plain
   * links written `[text](/path)` (or a full https URL); they render as
   * links here and read as their text elsewhere.
   */
  answer: string;
  /** A next step under the answer, e.g. Launch App (CRO-11). */
  cta?: { label: string; href: string };
};

/** A stable id per question, so one answer can be linked: "Who holds my funds?" → faq-who-holds-my-funds. */
export const faqId = (question: string) =>
  `faq-${question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const linkCls =
  "rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf";

/** Answer text with its `[text](href)` links made real. */
function renderAnswer(answer: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of answer.matchAll(LINK)) {
    const [whole, text, href] = m;
    const at = m.index ?? 0;
    if (at > last) out.push(answer.slice(last, at));
    if (/^https?:\/\//.test(href)) {
      out.push(
        <a key={at} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {text}
          <Icon name="external" size="sm" className="ml-0.5 inline align-[-0.15em]" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>,
      );
    } else {
      out.push(
        <IntentLink key={at} href={href} className={linkCls}>
          {text}
        </IntentLink>,
      );
    }
    last = at + whole.length;
  }
  if (last < answer.length) out.push(answer.slice(last));
  return out;
}

/**
 * FAQ as native <details> disclosures: keyboard, screen-reader and no-JS
 * support for free, and every answer is in the static HTML for search.
 * Numbered rows (from `start`, so grouped lists can count on); answers
 * slide open where the browser supports it. An item can end on a call to
 * action (`cta`), and answers can link (`[text](/path)`). Every answer has
 * an id (faqId) and a "Link to this answer"; FaqHash opens the one the URL
 * names, so support can link a single answer.
 */
export function FaqList({ items, start = 0, className }: { items: FaqItem[]; start?: number; className?: string }) {
  return (
    <div className={className}>
      <FaqHash />
      <ul data-faq className="divide-y divide-subtle border-y border-subtle">
        {items.map((f, i) => (
          <li key={f.question}>
            <details id={faqId(f.question)} className="smooth group scroll-mt-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lead font-medium text-fg transition-colors duration-fast can-hover:hover:text-leaf [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4">
                  <span aria-hidden className="w-6 shrink-0 font-mono text-label text-fg-subtle tabular transition-colors group-open:text-leaf">
                    {String(start + i + 1).padStart(2, "0")}
                  </span>
                  {f.question}
                </span>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/15 text-fg-muted transition-[transform,color,border-color] duration-base ease-expo group-open:rotate-45 group-open:border-leaf/40 group-open:text-leaf">
                  <PlusIcon />
                </span>
              </summary>
              <div className="pb-6 pl-10 pr-12">
                <p className="max-w-prose text-body text-fg-muted">{renderAnswer(f.answer)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {f.cta && (
                    <Button href={f.cta.href} size="sm" variant="secondary" data-placement="faq">
                      {f.cta.label}
                    </Button>
                  )}
                  <a
                    href={`#${faqId(f.question)}`}
                    className="inline-flex items-center gap-1 text-caption text-fg-subtle transition-colors duration-fast can-hover:hover:text-fg"
                  >
                    <Icon name="link" size="sm" />
                    Link to this answer
                  </a>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

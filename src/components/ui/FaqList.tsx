import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

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
  /** A next step under the answer, e.g. Join the Discord (CRO-11). */
  cta?: { label: string; href: string };
};

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
        <Link key={at} href={href} prefetch={false} className={linkCls}>
          {text}
        </Link>,
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
 * Numbered rows; answers slide open where the browser supports it. An item
 * can end on a call to action (`cta`), and answers can link (`[text](/path)`).
 */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={className}>
      <ul data-faq className="divide-y divide-subtle border-y border-subtle">
        {items.map((f, i) => (
          <li key={f.question}>
            <details className="smooth group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-fg transition-colors duration-fast can-hover:hover:text-leaf [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4">
                  <span aria-hidden className="w-6 shrink-0 font-mono text-label text-fg-subtle tabular transition-colors group-open:text-leaf">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.question}
                </span>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/15 text-fg-muted transition-[transform,color,border-color] duration-base ease-expo group-open:rotate-45 group-open:border-leaf/40 group-open:text-leaf">
                  <PlusIcon />
                </span>
              </summary>
              <div className="pb-6 pl-10 pr-12">
                <p className="max-w-prose text-body text-fg-muted">{renderAnswer(f.answer)}</p>
                {f.cta && (
                  <Button href={f.cta.href} size="sm" variant="secondary" className="mt-4" data-placement="faq">
                    {f.cta.label}
                  </Button>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

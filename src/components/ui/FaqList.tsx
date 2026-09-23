import type { Faq } from "@/lib/data/faqs";
import { PlusIcon } from "@/components/ui/icons";

/**
 * FAQ as native <details> disclosures: keyboard, screen-reader and no-JS
 * support for free, and every answer is in the static HTML for search.
 */
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={className}>
      <ul className="divide-y divide-line/[0.08] border-y border-line/[0.08]">
        {items.map((f) => (
          <li key={f.question}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-fg transition-colors hover:text-leaf [&::-webkit-details-marker]:hidden">
                {f.question}
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/15 text-fg-muted transition-transform duration-300 group-open:rotate-45 group-open:text-leaf">
                  <PlusIcon />
                </span>
              </summary>
              <p className="max-w-prose pb-6 pr-12 text-body text-fg-muted">{f.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

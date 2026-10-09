import type { Faq } from "@/lib/data/faqs";
import { PlusIcon } from "@/components/ui/icons";

/**
 * FAQ as native <details> disclosures: keyboard, screen-reader and no-JS
 * support for free, and every answer is in the static HTML for search.
 * Numbered rows; answers slide open where the browser supports it.
 */
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={className}>
      <ul className="divide-y divide-line/[0.08] border-y border-line/[0.08]">
        {items.map((f, i) => (
          <li key={f.question}>
            <details className="smooth group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-fg transition-colors duration-fast hover:text-leaf [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4">
                  <span aria-hidden className="w-6 shrink-0 font-mono text-[12px] text-fg-subtle tabular transition-colors group-open:text-leaf">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.question}
                </span>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line/15 text-fg-muted transition-[transform,color,border-color] duration-base ease-expo group-open:rotate-45 group-open:border-leaf/40 group-open:text-leaf">
                  <PlusIcon />
                </span>
              </summary>
              <p className="max-w-prose pb-6 pl-10 pr-12 text-body text-fg-muted">{f.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

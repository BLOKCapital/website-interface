import { cn } from "@/lib/utils";

/**
 * Hover/focus explanation for a term. The trigger is a real button so it's
 * reachable by keyboard; the text is also its accessible description, so
 * screen readers get it without the visual bubble. CSS only. The bubble is
 * display:none until shown (so it never widens the page), and a bottom sheet
 * on phones, where there's no room beside the term.
 */
export function Hint({ children, text, className }: { children: React.ReactNode; text: string; className?: string }) {
  return (
    <span className={cn("group/hint relative inline-flex", className)}>
      <button
        type="button"
        className="cursor-help underline decoration-fg-subtle/60 decoration-dotted underline-offset-4 focus-visible:outline-offset-2"
      >
        {children}
        <span className="sr-only">: {text}</span>
      </button>
      <span
        aria-hidden
        role="presentation"
        className="pointer-events-none z-30 hidden animate-enter-fade rounded-xl border border-line/12 bg-raised px-3.5 py-2.5 text-left text-caption font-normal normal-case tracking-normal text-fg-muted shadow-[0_16px_40px_-16px_rgb(0_0_0/0.7)] [animation-duration:150ms] group-focus-within/hint:block group-hover/hint:block max-sm:fixed max-sm:inset-x-4 max-sm:bottom-4 sm:absolute sm:bottom-full sm:left-0 sm:mb-2 sm:w-64"
      >
        {text}
      </span>
    </span>
  );
}

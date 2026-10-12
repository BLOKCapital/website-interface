"use client";

import { useEffect, useState, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Target = string | RefObject<HTMLElement | null>;

/** Select the text of `target` (an element id or a ref), so it can be copied by hand. */
function selectText(target: Target | undefined) {
  if (!target) return;
  const el = typeof target === "string" ? document.getElementById(target) : target.current;
  if (!el) return;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.focus();
    el.select();
    return;
  }
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Copies `value`, and confirms with a short, announced "Copied". If the
 * clipboard is refused (common in in-app browsers and webviews), it says
 * so in words that work on any device, and selects the text on the page
 * (`selectTarget`: the id of, or a ref to, the element showing the value),
 * ready for a long-press or a copy shortcut (A11Y-37, MOB-23).
 */
export function CopyButton({
  value,
  label = "Copy",
  selectTarget,
  className,
}: {
  value: string;
  label?: string;
  /** The element that shows `value`, selected if copying fails. */
  selectTarget?: Target;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    // Long enough to read and act on a failure; a success just ticks.
    const t = setTimeout(() => setState("idle"), state === "failed" ? 8000 : 1800);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setState("copied");
        } catch {
          selectText(selectTarget);
          setState("failed");
        }
      }}
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-tag border px-2.5 py-1 font-sans text-label text-fg-muted",
        "transition-[border-color,color,transform] duration-fast ease-out active:scale-[var(--scale-press)] active:duration-instant",
        "can-hover:hover:border-leaf/40 can-hover:hover:text-fg",
        state === "copied" && "border-leaf/40 text-leaf",
        state === "failed" && "border-warning/40 text-warning-text",
        className,
      )}
    >
      <Icon name={state === "copied" ? "check" : "copy"} size="sm" />
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed. Select the address to copy" : label}
      </span>
    </button>
  );
}

"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A toggletip that explains a term (A11Y-11, MOB-06). The term is a real
 * button with `aria-expanded`:
 *   - click or tap pins the explanation open, and a second click closes it
 *     (Enter or Space toggle it);
 *   - with a mouse or pen, it also shows while the pointer is over the term
 *     or over the bubble itself (no pointer-events-none, and a bridge across
 *     the gap), so it can be read with a magnifier (WCAG 1.4.13);
 *   - keyboard focus shows it too, and Escape closes it from anywhere;
 *   - a tap elsewhere, or focus leaving, closes it.
 * Touch never "hovers", so nothing sticks open after a tap. The text is also
 * part of the button's accessible name, so screen readers get it without the
 * bubble (which is aria-hidden). On phones the bubble is a bottom sheet,
 * where there's no room beside the term. It's display:none while closed, so
 * it never widens the page.
 */
export function Hint({ children, text, className }: { children: ReactNode; text: string; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  // Escape (or a second click) hides it until the pointer or focus leaves.
  const [dismissed, setDismissed] = useState(false);
  const open = !dismissed && (pinned || hover || focus);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPinned(false);
      setDismissed(true);
    };
    const onDown = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setPinned(false);
        setHover(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const fine = (e: PointerEvent) => e.pointerType !== "touch";

  return (
    <span
      ref={root}
      className={cn("relative inline-flex", className)}
      onPointerEnter={(e) => fine(e) && setHover(true)}
      onPointerLeave={(e) => {
        if (!fine(e)) return;
        setHover(false);
        if (!focus) setDismissed(false);
      }}
      onBlur={(e) => {
        if (root.current?.contains(e.relatedTarget as Node | null)) return;
        setFocus(false);
        setPinned(false);
        setDismissed(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && setFocus(true)}
        onClick={(e) => {
          // A pointer click pins a hover-opened bubble; Enter or Space
          // (detail 0) toggles what's on screen; a pinned bubble closes.
          if (open && (pinned || e.detail === 0)) {
            setPinned(false);
            setDismissed(true);
          } else {
            setPinned(true);
            setDismissed(false);
          }
        }}
        // The ::after pad grows the hit area to a comfortable tap size without moving the text.
        className="relative cursor-help underline decoration-fg-subtle/60 decoration-dotted underline-offset-4 after:absolute after:-inset-x-1 after:-inset-y-2 after:content-[''] focus-visible:outline-offset-2"
      >
        {children}
        <span className="sr-only">: {text}</span>
      </button>
      <span
        aria-hidden
        className={cn(
          open ? "block" : "hidden",
          "z-tooltip animate-fade-in rounded-control border bg-raised px-3.5 py-2.5 text-left text-caption font-normal normal-case tracking-normal text-fg-muted shadow-e1 [animation-duration:var(--dur-fast)]",
          "max-sm:fixed max-sm:inset-x-4 max-sm:bottom-4",
          // Above the term on wider screens; the ::before bridges the 8px gap,
          // so the pointer can travel onto the bubble without closing it.
          "sm:absolute sm:bottom-full sm:left-0 sm:mb-2 sm:w-64 sm:before:absolute sm:before:inset-x-0 sm:before:top-full sm:before:h-2 sm:before:content-['']",
        )}
      >
        {text}
      </span>
    </span>
  );
}

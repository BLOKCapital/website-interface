"use client";

import { useEffect, useRef } from "react";

/**
 * Opens the FAQ answer the URL names (/contact#faq-who-holds-my-funds), on
 * load and on every hash change, so one answer can be linked on its own.
 * Only within its own list, so several lists on a page never fight over it.
 *
 * Also keeps one answer open at a time where the browser doesn't support
 * exclusive <details name> yet: opening one closes the others that share
 * its name (a no-op where the browser already did it). And when the answer
 * that closes sat above the one you opened, it holds the question you
 * clicked where it was while the other folds away, instead of letting it
 * jump up the page (up to ~800px on a phone).
 */
export function FaqHash() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const list = ref.current?.parentElement;
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el instanceof HTMLDetailsElement && list?.contains(el) && !el.open) el.open = true;
    };
    // Where the question being opened sat when it was clicked (click also
    // fires for Enter and Space on a summary), before anything above it closed.
    let anchor: { summary: Element; top: number } | null = null;
    const onClick = (e: MouseEvent) => {
      const summary = e.target instanceof Element ? e.target.closest("summary") : null;
      const d = summary?.parentElement;
      if (!summary || !(d instanceof HTMLDetailsElement) || d.open || !list?.contains(d)) return;
      anchor = { summary, top: summary.getBoundingClientRect().top };
    };
    // Scroll with the page as the other answer folds (it animates), so the question stays put.
    const hold = (summary: Element, top: number) => {
      const until = performance.now() + 500;
      const step = () => {
        const dy = summary.getBoundingClientRect().top - top;
        if (Math.abs(dy) > 0.5) window.scrollBy({ top: dy, behavior: "instant" });
        if (performance.now() < until) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const onToggle = (e: Event) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.open || !list?.contains(d)) return;
      const name = d.getAttribute("name");
      if (name) {
        for (const other of document.querySelectorAll<HTMLDetailsElement>(`details[name="${CSS.escape(name)}"][open]`)) {
          if (other !== d) other.open = false;
        }
      }
      if (anchor && anchor.summary.parentElement === d) hold(anchor.summary, anchor.top);
      anchor = null;
    };
    open();
    window.addEventListener("hashchange", open);
    // toggle doesn't bubble, so listen in the capture phase.
    document.addEventListener("toggle", onToggle, true);
    list?.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", open);
      document.removeEventListener("toggle", onToggle, true);
      list?.removeEventListener("click", onClick, true);
    };
  }, []);
  return <span ref={ref} hidden />;
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Opens the FAQ answer the URL names (/contact#faq-who-holds-my-funds), on
 * load and on every hash change, so one answer can be linked on its own.
 * Only within its own list, so several lists on a page never fight over it.
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
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return <span ref={ref} hidden />;
}

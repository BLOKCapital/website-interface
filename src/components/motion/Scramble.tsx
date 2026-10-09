"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

const GLYPHS = "0123456789abcdefx#/$";

/**
 * Text that decodes from random hex-ish glyphs into the real words, left to
 * right, the first time it scrolls into view. The server HTML and screen
 * readers always get the real text; the decoding copy is aria-hidden, and an
 * invisible copy of the final text holds the layout so nothing reflows.
 */
export function Scramble({ text, className, duration = 1100 }: { text: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, rootMargin: "0px 0px -15% 0px" });
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!seen || prefersReducedMotion()) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      // How many characters have locked in; the rest keep churning.
      const locked = Math.floor(k * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out += i < locked || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setShown(out);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, text, duration]);

  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0">
        {shown}
      </span>
    </span>
  );
}

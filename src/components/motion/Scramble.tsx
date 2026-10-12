"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInView, useMotionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";

const GLYPHS = "0123456789abcdefx#/$";
/** Glyph changes per second: a JS effect runs on a ≤ 15 fps timer (E R4). */
const FPS = 15;

/**
 * Text that decodes from random hex-ish glyphs into the real words, left to
 * right, the first time it scrolls into view.
 *
 * The real text is the only copy in the DOM, so screen readers, crawlers and
 * text extraction all read it once ("plant a Garden.", not "aGarden." or
 * "Garden.Garden.Garden."). While decoding, that text turns transparent in
 * place (so it still holds the layout) and an aria-hidden overlay paints the
 * glyphs from a data attribute through CSS `content: attr()`. The wrapper is
 * inline, so the space before it stays in the accessible name. Server HTML,
 * no JS and motion off (reduced motion or Pause motion, followed live) show
 * the real text.
 */
export function Scramble({ text, className, duration = 1100 }: { text: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const allowed = useMotionAllowed();
  const seen = useInView(ref, { once: true, rootMargin: "0px 0px -15% 0px" });
  const played = useRef(false);
  // The glyphs on screen while decoding; null once settled.
  const [glyphs, setGlyphs] = useState<string | null>(null);

  useEffect(() => {
    if (!seen || !allowed || played.current) return;
    let timer = 0;
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / duration);
      if (k >= 1) {
        played.current = true;
        setGlyphs(null);
        return;
      }
      // How many characters have locked in; the rest keep churning.
      const locked = Math.floor(k * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out += i < locked || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setGlyphs(out);
      timer = window.setTimeout(step, 1000 / FPS);
    };
    timer = window.setTimeout(step, 0);
    return () => {
      window.clearTimeout(timer);
      // Motion switched off mid-decode: settle on the real text for good.
      if (prefersReducedMotion()) played.current = true;
      setGlyphs(null);
    };
  }, [seen, allowed, text, duration]);

  return (
    <span ref={ref} className={cn("relative whitespace-nowrap", className)}>
      <span className={glyphs === null ? undefined : "text-transparent"}>{text}</span>
      {glyphs !== null && (
        <span
          aria-hidden
          data-text={glyphs}
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap [line-height:normal] before:content-[attr(data-text)]"
        />
      )}
    </span>
  );
}

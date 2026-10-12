"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionAllowed } from "@/lib/motion";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const SPELL = "wagmi";
const STICKER = "we're all gonna make it.";

/**
 * Two easter eggs (loaded after idle by EasterEggs.tsx):
 *   1. Konami code → a small Garden bloom follows the cursor for 6s. With
 *      motion off (reduced motion or Pause motion) it blooms in place,
 *      centred, and doesn't follow.
 *   2. Type "wagmi" anywhere → flash a sticker bottom-right, announced
 *      through a status region that is always mounted (MISS-16).
 */
export function Eggs() {
  // konami progress and the spell buffer are only read inside the key handler,
  // never during render — refs keep them out of state so keypresses don't
  // re-render the component and the listener subscribes exactly once.
  const konamiRef = useRef(0);
  const spellBufRef = useRef("");
  const stickerRef = useRef<HTMLDivElement>(null);
  const [showBloom, setShowBloom] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const motion = useMotionAllowed();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const expected = KONAMI[konamiRef.current];
      if (expected && (e.key === expected || e.key.toLowerCase() === expected)) {
        konamiRef.current += 1;
        if (konamiRef.current === KONAMI.length) {
          konamiRef.current = 0;
          setShowBloom(true);
          timers.push(setTimeout(() => setShowBloom(false), 6000));
        }
      } else if (e.key.length === 1) {
        konamiRef.current = 0;
      }

      spellBufRef.current = (spellBufRef.current + e.key.toLowerCase()).slice(
        -SPELL.length,
      );
      if (spellBufRef.current === SPELL) {
        setShowSticker(true);
        timers.push(setTimeout(() => setShowSticker(false), 3500));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      timers.forEach(clearTimeout);
    };
  }, []);

  // The bloom follows the pointer only while motion is allowed.
  useEffect(() => {
    if (!showBloom || !motion) return;
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [showBloom, motion]);

  // The sticker pops in (Web Animations, so no <style> element); with motion
  // off it simply appears.
  useEffect(() => {
    if (!showSticker || !motion) return;
    stickerRef.current?.animate(
      [
        { transform: "rotate(-12deg) scale(0.5)", opacity: 0 },
        { transform: "rotate(-6deg) scale(1)", opacity: 1 },
      ],
      { duration: 300, easing: "cubic-bezier(0.22,1,0.36,1)" },
    );
  }, [showSticker, motion]);

  return (
    <>
      {showBloom && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-base"
          style={motion ? { left: pos.x, top: pos.y } : { left: "50%", top: "50%" }}
        >
          {/* Halo */}
          <div
            className="absolute inset-0 -z-10 blur-xl"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgb(var(--leaf) / 0.35), transparent 70%)",
            }}
          />
          {/* Bonus Garden render, Garden #6 */}
          <div className="relative size-[110px]">
            <Image
              src="/gardens/garden-06-480.webp"
              alt=""
              fill
              unoptimized
              className="object-contain [mix-blend-mode:lighten]"
              draggable={false}
            />
          </div>
        </div>
      )}

      {showSticker && (
        <div
          ref={stickerRef}
          aria-hidden
          className="pointer-events-none fixed bottom-6 right-6 z-[60] rotate-[-6deg] rounded-2xl border border-leaf/40 bg-card/90 px-4 py-2 backdrop-blur"
          style={{ boxShadow: "0 20px 40px -15px rgb(var(--leaf) / 0.35)" }}
        >
          <p className="display text-[18px] text-leaf">{STICKER}</p>
          <p className="font-mono text-[10px] text-fg-subtle">a sticker, just for you</p>
        </div>
      )}

      {/* Always mounted, so the sticker's text is announced when it appears. */}
      <p role="status" className="sr-only">
        {showSticker ? STICKER : ""}
      </p>
    </>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

/**
 * Two easter eggs:
 *   1. Konami code → a small Garden bloom follows the cursor for 6s
 *   2. Type "wagmi" anywhere → flash a sticker bottom-right
 *
 * Hidden source-comment tip:
 *   👋 Curious developer — try ↑ ↑ ↓ ↓ ← → ← → B A in the page.
 *   Also: type "wagmi" anywhere (no input focus needed).
 */
export function EasterEggs() {
  // konami progress and the spell buffer are only read inside the key handler,
  // never during render — refs keep them out of state so keypresses don't
  // re-render the component and the listener subscribes exactly once.
  const konamiRef = useRef(0);
  const spellBufRef = useRef("");
  const [showBloom, setShowBloom] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
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
          setTimeout(() => setShowBloom(false), 6000);
        }
      } else if (e.key.length === 1) {
        konamiRef.current = 0;
      }

      spellBufRef.current = (spellBufRef.current + e.key.toLowerCase()).slice(
        -SPELL.length,
      );
      if (spellBufRef.current === SPELL) {
        setShowSticker(true);
        setTimeout(() => setShowSticker(false), 3500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!showBloom) return;
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [showBloom]);

  return (
    <>
      {showBloom && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-400"
          style={{ left: pos.x, top: pos.y }}
        >
          {/* Halo */}
          <div
            className="absolute inset-0 -z-10 blur-xl"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgb(var(--clay) / 0.45), transparent 70%)",
            }}
          />
          {/* Bonus Garden render, Garden #6 */}
          <div className="relative size-[110px]">
            <Image
              src="/gardens/garden-06.png"
              alt=""
              fill
              sizes="110px"
              className="object-contain [mix-blend-mode:lighten]"
              draggable={false}
            />
          </div>
        </div>
      )}

      {showSticker && (
        // role=status (not <output>): the sticker holds flow content (<p>, <style>),
        // which <output> may not legally contain; this is the correct live region.
        // react-doctor-disable-next-line react-doctor/prefer-tag-over-role
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 right-6 z-[60] rotate-[-6deg] rounded-2xl border border-moss/40 bg-moss/15 px-4 py-2 backdrop-blur"
          style={{
            animation: "stickerIn 300ms cubic-bezier(0.22,1,0.36,1) both",
            boxShadow: "0 20px 40px -15px rgba(87,167,115,0.55)",
          }}
        >
          <p className="display text-[18px] text-moss">we&apos;re all gonna make it.</p>
          <p className="mono text-[10px] text-ink-subtle">a sticker, just for you</p>
          <style>{`
            @keyframes stickerIn {
              from { transform: rotate(-12deg) scale(0.5); opacity: 0; }
              to   { transform: rotate(-6deg) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

/**
 * 👋 Curious developer — try ↑ ↑ ↓ ↓ ← → ← → B A in the page.
 * Also: type "wagmi" anywhere (no input focus needed).
 */

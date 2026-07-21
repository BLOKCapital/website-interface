"use client";

import { useRef, type ReactNode } from "react";
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { stiffness: 180, damping: 22, mass: 0.6 };

/**
 * 3D paper tilt — the card leans away from the pointer like a sheet of
 * paper picked up by its corner, with a soft window-light sheen that
 * follows the cursor. Pure CSS perspective transforms; no WebGL weight.
 *
 * Wrap a single card. The wrapper owns the perspective, so the child can
 * keep its own background, border and shadow untouched. Pointer-only by
 * nature and inert under prefers-reduced-motion.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 5,
  sheen = true,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card edges. Keep small — paper, not a hologram. */
  maxTilt?: number;
  /** Soft light patch that follows the pointer across the surface. */
  sheen?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Pointer position across the card, 0..1 on both axes; 0.5 is resting.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
  const sheenOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 30 });

  const sheenX = useTransform(px, (v) => `${v * 100}%`);
  const sheenY = useTransform(py, (v) => `${v * 100}%`);
  const sheenBackground = useMotionTemplate`radial-gradient(320px circle at ${sheenX} ${sheenY}, rgb(255 255 255 / 0.28), transparent 65%)`;

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    sheenOpacity.set(1);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
    sheenOpacity.set(0);
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ transformPerspective: 900, rotateX, rotateY }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {sheen && (
        <m.div
          aria-hidden
          style={{ background: sheenBackground, opacity: sheenOpacity }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
        />
      )}
    </m.div>
  );
}

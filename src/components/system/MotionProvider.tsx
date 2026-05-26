"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { type ReactNode } from "react";

// LazyMotion ships only the DOM animation feature bundle (enough for our use:
// variants, gestures, exit, viewport) and lets components import the lightweight
// `m` instead of `motion`, trimming ~30kb from the shared bundle. `strict` makes
// any stray `motion.*` usage throw in dev so we don't silently load the full set.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

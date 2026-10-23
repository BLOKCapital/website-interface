"use client";

import { useEffect, useRef, useState } from "react";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import { useMotionAllowed } from "@/lib/motion";

/**
 * The guard scanner's Pause / Resume (WCAG 2.2.2: it loops). Sets
 * data-paused on the scanner ([data-scan]); CSS holds the chips where they
 * are. Not rendered when motion is off, since nothing moves then.
 */
export function ScanToggle() {
  const motion = useMotionAllowed();
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    ref.current?.closest("[data-scan]")?.toggleAttribute("data-paused", paused);
  }, [paused]);
  if (!motion) return null;
  return (
    <span ref={ref}>
      <AutoplayToggle on={!paused} ended={false} onClick={() => setPaused((p) => !p)} what="the checks" />
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Copies `value`; confirms with a short, announced "Copied". */
export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 1800);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setState("copied");
        } catch {
          setState("failed");
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line/12 px-2 py-1 font-sans text-[11.5px] text-fg-muted transition-colors hover:border-leaf/40 hover:text-fg",
        state === "copied" && "border-leaf/40 text-leaf",
        className,
      )}
    >
      <svg aria-hidden width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        {state === "copied" ? <path d="M3 8.5l3 3 7-7" /> : <><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" /><path d="M10.5 5V3.5A1 1 0 009.5 2.5h-6a1 1 0 00-1 1v6a1 1 0 001 1H5" /></>}
      </svg>
      <span aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Press ⌘C" : label}</span>
    </button>
  );
}

"use client";

import { m, type HTMLMotionProps, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const variants = {
  "fade-up": {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  } as Variants,
  "fade-in": {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease } },
  } as Variants,
  "scale-up": {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
  } as Variants,
  "slide-right": {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
  } as Variants,
  "slide-left": {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
  } as Variants,
};

type Variant = keyof typeof variants;

interface RevealProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport"> {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  /** Viewport intersection threshold to trigger reveal. Default 0.2. */
  amount?: number;
  /** Replay every time it enters the viewport. Default false (single-shot). */
  replay?: boolean;
}

/**
 * Drop-in viewport reveal wrapper. Single-shot by default.
 * Honors prefers-reduced-motion via the global <MotionProvider> in layout.tsx
 * (reducedMotion="user").
 */
export function Reveal({
  children,
  delay = 0,
  variant = "fade-up",
  amount = 0.2,
  replay = false,
  ...rest
}: RevealProps) {
  const v = variants[variant];
  const showTransition = (v.show as { transition?: object }).transition ?? {};
  return (
    <m.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: !replay, amount }}
      variants={{
        ...v,
        show: { ...(v.show as object), transition: { ...showTransition, delay } },
      }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

interface StaggerProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport"> {
  children: ReactNode;
  /** Delay before the first child starts. Default 0. */
  delayChildren?: number;
  /** Time between each child. Default 0.1. */
  staggerChildren?: number;
  amount?: number;
  replay?: boolean;
}

/**
 * Wrap children in this and use `<RevealItem>` for each child to get a
 * cascading reveal. Container itself doesn't animate — it orchestrates.
 */
// Reveal/Stagger/RevealItem are one cohesive scroll-reveal primitive set sharing
// the same easing + variants; co-locating them is intentional.
// react-doctor-disable-next-line react-doctor/no-multi-comp
export function Stagger({
  children,
  delayChildren = 0,
  staggerChildren = 0.1,
  amount = 0.2,
  replay = false,
  ...rest
}: StaggerProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: !replay, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren, delayChildren } },
      }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

/**
 * Item inside a <Stagger>. Pass `variant` to control its motion (defaults to fade-up).
 */
interface RevealItemProps
  extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  variant?: Variant;
}

// react-doctor-disable-next-line react-doctor/no-multi-comp
export function RevealItem({
  children,
  variant = "fade-up",
  ...rest
}: RevealItemProps) {
  return (
    <m.div variants={variants[variant]} {...rest}>
      {children}
    </m.div>
  );
}

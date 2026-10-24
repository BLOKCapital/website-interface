import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  // The site's one content width (1240), gutters inside it.
  page: "w-full max-w-page",
  // Dense data consoles that earn more room on very wide screens (1360).
  wide: "w-full max-w-wide",
  // A readable text column: 58ch of text, with the gutters outside it.
  measure: "box-content max-w-measure",
} as const;

export type ContainerSize = keyof typeof sizes;

/**
 * The centred page container: `mx-auto`, a max width and the fluid page
 * gutter (`px-gutter`, 20 → 32px). Replaces the hand-written
 * `mx-auto w-full max-w-page px-5 sm:px-8`. Server-safe.
 */
export function Container({
  size = "page",
  as: El = "div",
  className,
  ...rest
}: {
  size?: ContainerSize;
  as?: ElementType;
} & ComponentPropsWithoutRef<"div">) {
  return <El className={cn("mx-auto px-gutter", sizes[size], className)} {...rest} />;
}

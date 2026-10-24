"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "prefetch">;

/**
 * A next/link that prefetches on intent, not on sight: when a pointer rests
 * on it, a finger touches it, or it takes keyboard focus. For the footer and
 * inline text links, which would otherwise prefetch every route they point
 * at as they scroll into view. `prefetch={false}` alone made each of those
 * clicks wait for the network (about 0.75s on slow 4G); this starts the
 * fetch 100–300ms before the click instead. Production only, like Next's
 * own prefetch; the router dedupes repeat calls.
 */
export function IntentLink({ href, onMouseEnter, onTouchStart, onFocus, ...rest }: Props) {
  const router = useRouter();
  const warm = () => {
    const path = typeof href === "string" ? href : href.pathname;
    // Same-site pages only, without the #fragment.
    if (path?.startsWith("/")) router.prefetch(path.split("#")[0] || "/");
  };
  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        warm();
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
}

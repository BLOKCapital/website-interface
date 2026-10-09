import { Fragment, cloneElement, isValidElement, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Splits text into per-word spans, keeping inline markup such as the
 * <em className="text-sand"> payoff in two-tone headlines. Each word gets
 * `className` and its position as --w, which globals.css uses to stagger.
 * Whitespace stays as plain text between spans, so wrapping and
 * text-balance behave exactly as before. Server-safe: no hooks.
 */
export function splitWords(node: ReactNode, className = "split-word"): { nodes: ReactNode; count: number } {
  let i = 0;
  const walk = (n: ReactNode): ReactNode => {
    if (typeof n === "number") return walk(String(n));
    if (typeof n === "string") {
      return n.split(/(\s+)/).map((part) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return part;
        const w = i++;
        return (
          <span key={w} className={className} style={{ "--w": w } as CSSProperties}>
            {part}
          </span>
        );
      });
    }
    if (Array.isArray(n)) return n.map((c, k) => <Fragment key={k}>{walk(c)}</Fragment>);
    if (isValidElement<{ children?: ReactNode }>(n) && n.props.children !== undefined) {
      return cloneElement(n, undefined, walk(n.props.children));
    }
    return n;
  };
  const nodes = walk(node);
  return { nodes, count: i };
}

type Tag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * A heading whose words rise out of a slight blur, in sequence.
 *   reveal="scroll" (default): when it scrolls into view, via RevealScript.
 *   reveal="load": on page load, for above-the-fold heroes; `delay` in ms.
 */
export function SplitText({
  as = "h2",
  reveal = "scroll",
  delay,
  className,
  children,
}: {
  as?: Tag;
  reveal?: "scroll" | "load";
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const El = as;
  const { nodes } = splitWords(children);
  return (
    <El
      data-split={reveal === "scroll" ? "" : undefined}
      className={cn(reveal === "load" && "split-load", className)}
      style={delay !== undefined ? ({ "--split-delay": `${delay}ms` } as CSSProperties) : undefined}
      // RevealScript adds data-revealed before React hydrates.
      suppressHydrationWarning
    >
      {nodes}
    </El>
  );
}

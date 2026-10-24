"use client";

import { useRef, type KeyboardEvent, type RefObject } from "react";
import { useMediaQuery } from "./explainers";

type Orientation = "horizontal" | "vertical";

/**
 * One keyboard model for every tablist (WAI-ARIA tabs, automatic
 * activation): only the selected tab is in the Tab order; the arrow keys of
 * the strip's orientation move and select, wrapping at the ends; Home and
 * End jump to the first and last tab.
 *
 * Strips that are horizontal on phones and become a column from a
 * breakpoint pass `verticalFrom` (a media query), and aria-orientation
 * follows the layout. Before hydration the strip reports horizontal.
 *
 *   const rt = useRovingTabs({ count, selected, onSelect, verticalFrom: LG_QUERY });
 *   <div {...rt.tablist} aria-label="…">
 *     {items.map((x, i) => <button {...rt.tab(i)} aria-controls="…" onClick={…} />)}
 *   </div>
 *
 * `onSelect` receives the new index for arrow/Home/End (it's user input, so
 * explainers stop autoplay there); clicks stay with the caller. Pass `refs`
 * to read the tab elements yourself (e.g. to scroll the active one into view).
 */
export function useRovingTabs({
  count,
  selected,
  onSelect,
  orientation = "horizontal",
  verticalFrom,
  refs: external,
}: {
  count: number;
  selected: number;
  onSelect: (i: number) => void;
  /** The strip's orientation (below `verticalFrom`, when given). */
  orientation?: Orientation;
  /** A media query from which the strip is a vertical column, e.g. LG_QUERY. */
  verticalFrom?: string;
  /** Where the tab elements are kept, in order. */
  refs?: RefObject<(HTMLElement | null)[]>;
}) {
  const own = useRef<(HTMLElement | null)[]>([]);
  const refs = external ?? own;
  const column = useMediaQuery(verticalFrom ?? "not all");
  const o: Orientation = verticalFrom ? (column ? "vertical" : "horizontal") : orientation;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const [prev, next] = o === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    let to: number;
    if (e.key === next) to = selected + 1;
    else if (e.key === prev) to = selected - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = count - 1;
    else return;
    e.preventDefault();
    to = (to + count) % count;
    if (to !== selected) onSelect(to);
    refs.current[to]?.focus();
  };

  return {
    orientation: o,
    tablist: { role: "tablist" as const, "aria-orientation": o, onKeyDown },
    tab: (i: number) => ({
      role: "tab" as const,
      ref: (el: HTMLElement | null) => {
        refs.current[i] = el;
      },
      tabIndex: i === selected ? 0 : -1,
      "aria-selected": i === selected,
    }),
  };
}

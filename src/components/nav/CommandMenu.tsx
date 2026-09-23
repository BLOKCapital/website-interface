"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchItems, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/utils";
import { ExternalIcon, ArrowIcon } from "@/components/ui/icons";

const SearchIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </svg>
);

function score(item: SearchItem, q: string) {
  const hay = `${item.label} ${item.hint} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.every((w) => hay.includes(w))) return -1;
  return item.label.toLowerCase().startsWith(words[0] ?? "") ? 2 : 1;
}

/**
 * Quick jump (⌘K / Ctrl K, or "/"): pages, indices, components, contracts
 * and resources. A native <dialog>, so focus trapping and Escape come free.
 * Arrow keys move, Enter opens.
 */
export function CommandMenu() {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    if (!q.trim()) return searchItems.filter((x) => x.group === "Pages" || x.group === "Indices");
    return searchItems
      .map((x) => ({ x, s: score(x, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.x)
      .slice(0, 12);
  }, [q]);

  const open = () => {
    setQ("");
    setI(0);
    ref.current?.showModal();
    requestAnimationFrame(() => input.current?.focus());
  };
  const close = () => ref.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (ref.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (item: SearchItem) => {
    close();
    if (/^https?:\/\//.test(item.href)) window.open(item.href, "_blank", "noopener,noreferrer");
    else router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = (i + (e.key === "ArrowDown" ? 1 : -1) + results.length) % Math.max(results.length, 1);
      setI(n);
      list.current?.children[n]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && results[i]) {
      e.preventDefault();
      go(results[i]);
    }
  };

  let lastGroup = "";
  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search the site (Command K)"
        aria-keyshortcuts="Meta+K Control+K /"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-line/12 px-3 text-caption text-fg-muted transition-colors hover:border-line/25 hover:text-fg"
      >
        <SearchIcon />
        <kbd className="hidden font-sans text-[11px] text-fg-subtle xl:inline">⌘K</kbd>
      </button>
      <dialog
        ref={ref}
        aria-label="Search"
        onClick={(e) => e.target === ref.current && close()}
        className="m-0 mx-auto mt-[12vh] w-[min(640px,calc(100vw-32px))] rounded-2xl border border-line/12 bg-raised p-0 text-fg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] backdrop:bg-canvas/70 backdrop:backdrop-blur-sm open:animate-enter-up [animation-duration:250ms]"
      >
        <div className="flex items-center gap-3 border-b border-line/10 px-4">
          <span className="text-fg-subtle">
            <SearchIcon />
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setI(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Jump to a page, index, token or contract…"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-results"
            aria-activedescendant={results[i] ? `cmd-${i}` : undefined}
            className="h-14 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-fg-subtle focus-visible:outline-none"
          />
          <kbd className="rounded border border-line/15 px-1.5 py-0.5 text-[11px] text-fg-subtle">Esc</kbd>
        </div>
        <ul ref={list} id="cmd-results" role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-small text-fg-muted">Nothing matches “{q}”. Try an index name or a token symbol.</li>}
          {results.map((r, n) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            const external = /^https?:\/\//.test(r.href);
            return (
              <li key={`${r.group}-${r.label}`} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-fg-subtle">{header}</p>}
                <div
                  id={`cmd-${n}`}
                  role="option"
                  aria-selected={n === i}
                  onMouseMove={() => setI(n)}
                  onClick={() => go(r)}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5", n === i ? "bg-line/[0.07]" : "")}
                >
                  {r.logo && (
                    // eslint-disable-next-line @next/next/no-img-element -- 4 KB static logo inside a dialog
                    <img src={r.logo} alt="" width={24} height={24} loading="lazy" className="size-6 shrink-0 rounded-full bg-white" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-small text-fg">{r.label}</span>
                    <span className="block truncate text-caption text-fg-subtle">{r.hint}</span>
                  </span>
                  {external ? <ExternalIcon className="text-fg-subtle" /> : <ArrowIcon size={13} className={n === i ? "text-leaf" : "text-fg-subtle"} />}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line/10 px-4 py-2.5 text-[11px] text-fg-subtle">↑↓ to move · Enter to open · Esc to close</p>
      </dialog>
    </>
  );
}

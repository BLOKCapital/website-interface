"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { navGroups, docsLink, isCurrent } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { DiscordIcon, ExternalIcon } from "@/components/ui/icons";
import { NavIcon } from "./NavIcons";
import { social } from "@/lib/data/socials";
import { cn } from "@/lib/utils";

/**
 * The phone menu: a full-screen sheet that opens as a circle growing from the
 * menu button (globals.css, "Mobile menu"), with each group easing in after
 * it. `inert` while closed, so nothing in it can be focused or read.
 */
export function MobileMenu({ open, pathname }: { open: boolean; pathname: string | null }) {
  return (
    <div id="mobile-menu" inert={!open} className={cn("mobile-sheet fixed inset-0 overflow-y-auto bg-canvas lg:hidden", open && "is-open")}>
      <nav aria-label="Mobile" className="mx-auto max-w-page px-5 pb-10 pt-28 sm:px-8">
        {navGroups.map((g, gi) => (
          <div key={g.id} className="sheet-item border-t border-line/[0.08] py-5" style={{ "--d": `${gi * 70}ms` } as CSSProperties}>
            <p className="eyebrow">{g.label}</p>
            <ul className="mt-3">
              {g.links.map((l) => {
                const current = !l.href.includes("#") && isCurrent(l.href, pathname);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      aria-current={current ? "page" : undefined}
                      className="group/m flex items-center gap-4 py-2.5"
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl border",
                          current ? "border-leaf/40 bg-leaf/10 text-leaf" : "border-line/10 bg-card text-fg-muted",
                        )}
                      >
                        <NavIcon href={l.href} />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("display flex items-center gap-2 text-[24px] leading-tight", current ? "text-leaf" : "text-fg")}>
                          {l.label}
                          {l.external && <ExternalIcon size={13} className="text-fg-subtle" />}
                        </span>
                        <span className="block text-caption text-fg-subtle">{l.hint}</span>
                      </span>
                      {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="sheet-item border-y border-line/[0.08] py-4" style={{ "--d": `${navGroups.length * 70}ms` } as CSSProperties}>
          <a href={docsLink.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
            <span className="display text-[24px] text-fg">{docsLink.label}</span>
            <ExternalIcon size={14} className="text-fg-subtle" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="sheet-item" style={{ "--d": `${(navGroups.length + 1) * 70}ms` } as CSSProperties}>
          <Button href={social("discord").href} size="lg" className="mt-7 w-full">
            <DiscordIcon /> Join the Discord
          </Button>
          <SocialLinks only={["x", "telegram", "farcaster", "github", "youtube"]} className="mt-6 justify-center" />
        </div>
      </nav>
    </div>
  );
}

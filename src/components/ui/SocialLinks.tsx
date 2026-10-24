import { SOCIAL_ICONS } from "@/components/ui/icons";
import { socials, type SocialId } from "@/lib/data/socials";
import { cn } from "@/lib/utils";

/**
 * Row of icon links to the official channels (or a subset, in order).
 * `placement` tags every link with data-placement for the consent-gated
 * click events (e.g. "footer", "cta_band").
 */
export function SocialLinks({ only, placement, className }: { only?: SocialId[]; placement?: string; className?: string }) {
  const list = only ? only.map((id) => socials.find((s) => s.id === id)!) : socials;
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {list.map((s) => {
        const Icon = SOCIAL_ICONS[s.id];
        return (
          <li key={s.id}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.label} (opens in a new tab)`}
              data-placement={placement}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line/12 text-fg-muted transition-[border-color,color,transform] duration-fast ease-out active:scale-[var(--scale-press)] can-hover:hover:border-leaf/40 can-hover:hover:text-leaf"
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

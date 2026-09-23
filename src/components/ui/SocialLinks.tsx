import { SOCIAL_ICONS } from "@/components/ui/icons";
import { socials, type SocialId } from "@/lib/data/socials";
import { cn } from "@/lib/utils";

/** Row of icon links to the official channels (or a subset, in order). */
export function SocialLinks({ only, className }: { only?: SocialId[]; className?: string }) {
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
              className="inline-flex size-10 items-center justify-center rounded-full border border-line/12 text-fg-muted transition-colors hover:border-leaf/40 hover:text-leaf"
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

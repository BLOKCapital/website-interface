/**
 * Inline icons. Decorative by default (aria-hidden): give the parent link or
 * button its accessible name. Colour is currentColor; `size` is in px.
 */
type P = { size?: number; className?: string };

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowIcon = ({ size = 14, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className={className}>
    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" {...line} />
  </svg>
);
export const ExternalIcon = ({ size = 12, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className={className}>
    <path d="M5 11 11 5M6 5h5v5" {...line} />
  </svg>
);
export const CheckIcon = ({ size = 14, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className={className}>
    <path d="m3.5 8.5 3 3 6-7" {...line} />
  </svg>
);
export const CrossIcon = ({ size = 14, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className={className}>
    <path d="m4 4 8 8M12 4l-8 8" {...line} />
  </svg>
);
export const MenuIcon = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden className={className}>
    <path d="M3 6h12M3 12h12" {...line} />
  </svg>
);
export const PlusIcon = ({ size = 14, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className={className}>
    <path d="M8 3v10M3 8h10" {...line} />
  </svg>
);

const fill = (d: string, size: number, className?: string) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d={d} />
  </svg>
);

export const DiscordIcon = ({ size = 16, className }: P) =>
  fill("M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.197.373.291a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z", size, className);
export const XIcon = ({ size = 15, className }: P) =>
  fill("M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", size, className);
export const TelegramIcon = ({ size = 16, className }: P) =>
  fill("M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.94c-.88-.25-.89-.86.2-1.3l15.97-6.15c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z", size, className);
export const FarcasterIcon = ({ size = 16, className }: P) =>
  fill("M4.5 2.5h15v3h-1.5l-1 7.5 1 8.5h.75v.5h-6.25v-.5h1.5l-1-7.5h-2l-1 7.5h1.5v.5H4.5v-.5h.75l1-8.5-1-7.5H3.75v-3z", size, className);
export const GitHubIcon = ({ size = 16, className }: P) =>
  fill("M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-.99-.02-1.94-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.66.8.55 4.56-1.52 7.84-5.83 7.84-10.91C23.5 5.65 18.35.5 12 .5z", size, className);
export const YouTubeIcon = ({ size = 16, className }: P) =>
  fill("M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.46 3.5 12 3.5 12 3.5s-7.46 0-9.37.56A3.02 3.02 0 0 0 .5 6.2C0 8.13 0 12 0 12s0 3.87.5 5.8c.27 1.05 1.08 1.86 2.13 2.14 1.91.56 9.37.56 9.37.56s7.46 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14C24 15.87 24 12 24 12s0-3.87-.5-5.8ZM9.6 15.6V8.4l6.24 3.6L9.6 15.6Z", size, className);

export const SOCIAL_ICONS = {
  discord: DiscordIcon,
  x: XIcon,
  telegram: TelegramIcon,
  farcaster: FarcasterIcon,
  github: GitHubIcon,
  youtube: YouTubeIcon,
} as const;

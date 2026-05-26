import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FooterBanner } from "@/components/footer/FooterBanner";

// Footer is a server component, so this resolves once at build/render time and
// is baked into the HTML — kept out of JSX so it can't drift at hydration.
const COPYRIGHT_YEAR = new Date().getFullYear();

const cols = [
  {
    label: "Product",
    items: [
      { href: "/features", label: "Features" },
      { href: "https://docs.blokcapital.io", label: "Documentation", external: true },
    ],
  },
  {
    label: "Protocol",
    items: [
      { href: "/features#token", label: "$BLOKC" },
      { href: "/about#dao", label: "DAO governance" },
      { href: "/features#audits", label: "Audits" },
      { href: "https://docsend.com/view/4j6qvvrudyr6izyb", label: "Whitepaper", external: true },
      { href: "https://github.com/BLOKCapital", label: "GitHub", external: true },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/about#team", label: "Team" },
      { href: "/about#press", label: "Press kit" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const socials = [
  { href: "https://t.me/BLOKCapital",   label: "Telegram",  icon: <TelegramIcon /> },
  { href: "https://x.com/blok_cap",     label: "X",         icon: <XIcon /> },
  { href: "https://discord.com/invite/blokc", label: "Discord", icon: <DiscordIcon /> },
  { href: "https://warpcast.com/blokc", label: "Farcaster", icon: <FarcasterIcon /> },
  { href: "https://github.com/BLOKCapital", label: "GitHub",  icon: <GitHubIcon /> },
];

export function Footer() {
  return (
    <footer className="paper relative border-t border-ink/10 bg-paper">
      {/* Brand banner, full-bleed promise. Hidden on /legal/* by the banner
          itself; the border lives on its outer wrapper so when it returns
          null no empty bordered space is left behind. */}
      <FooterBanner />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: brand */}
          <div className="lg:col-span-5">
            <Logo />
            <p className="script mt-3 text-[22px] leading-none text-clay">
              It&apos;s crypto, but different.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
              A decentralized wealth management protocol on Arbitrum. Plant a
              Garden, follow a curated index, or hire an on-chain manager. Your
              keys, always.
            </p>
          </div>

          {/* Right: 3-column sitemap */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-6 lg:col-start-7 lg:grid-cols-3">
            {cols.map((c) => (
              <div key={c.label}>
                <p className="eyebrow text-moss">{c.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.items.map((i) => {
                    const external = "external" in i && i.external;
                    return (
                      <li key={i.href}>
                        <Link
                          href={i.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="group/l inline-flex items-baseline gap-1 text-[13.5px] text-ink-muted transition-colors hover:text-ink"
                        >
                          {i.label}
                          {external && (
                            <>
                              <svg
                                width="9"
                                height="9"
                                viewBox="0 0 10 10"
                                aria-hidden
                                className="opacity-60 transition-transform duration-200 group-hover/l:translate-x-0.5 group-hover/l:opacity-100"
                              >
                                <path
                                  d="M2 8 L8 2 M3.5 2 L8 2 L8 6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.1"
                                  fill="none"
                                />
                              </svg>
                              <span className="sr-only"> (opens in a new tab)</span>
                            </>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Hand-drawn divider */}
        <div aria-hidden className="rule-hand mt-14 sm:mt-16" />

        {/* Bottom bar, legal + socials */}
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-ink-subtle">
            <span className="font-mono">
              © {COPYRIGHT_YEAR} BLOK Capital DAO LLC
            </span>
            <span aria-hidden className="text-ink/20">·</span>
            <Link
              href="/legal/user-agreement"
              className="transition-colors hover:text-ink"
            >
              User Agreement
            </Link>
            <Link
              href="/legal/acceptable-use"
              className="transition-colors hover:text-ink"
            >
              Acceptable Use
            </Link>
            <Link
              href="/legal/cookie-policy"
              className="transition-colors hover:text-ink"
            >
              Cookies
            </Link>
            <span aria-hidden className="text-ink/20">·</span>
            <span className="inline-flex items-center gap-1.5">
              <SeedDot />
              <span className="font-mono">Arbitrum One</span>
            </span>
          </div>

          {/* Social row, icon + label, hover glides label in */}
          <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group/s inline-flex h-9 items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 text-[12.5px] font-medium text-ink-muted transition-[color,border-color,background-color] duration-200 hover:border-moss/35 hover:bg-moss/[0.06] hover:text-ink"
                >
                  <span aria-hidden className="text-clay-deep/80 transition-colors duration-200 group-hover/s:text-clay">
                    {s.icon}
                  </span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ---------- tiny inline icons --------------------------------------------- */

function SeedDot() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 14 C 4 14 2 11 2 7.5 C 5 7.5 7.6 9 8 14 Z"
        fill="rgb(var(--moss) / 0.55)"
      />
      <path d="M8 14 C 12 14 14 11 14 7.5 C 11 7.5 8.4 9 8 14 Z" fill="rgb(var(--moss))" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.94c-.88-.25-.89-.86.2-1.3l15.97-6.15c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.197.373.291a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function FarcasterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 2.5h15v3h-1.5l-1 7.5 1 8.5h.75v.5h-6.25v-.5h1.5l-1-7.5h-2l-1 7.5h1.5v.5H4.5v-.5h.75l1-8.5-1-7.5H3.75v-3z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-.99-.02-1.94-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.66.8.55 4.56-1.52 7.84-5.83 7.84-10.91C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

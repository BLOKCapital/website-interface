import { IntentLink } from "@/components/ui/IntentLink";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CookieSettingsButton } from "@/components/system/CookieConsent";
import { MotionToggle } from "@/components/system/MotionToggle";
import { GlyphField } from "@/components/motion/GlyphField";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { links, social } from "@/lib/data/socials";
import { siteConfig } from "@/lib/seo/site";
import { navGroups, type NavGroup } from "@/lib/nav";

// Server component: resolved at build time and baked into the HTML.
const YEAR = new Date().getFullYear();

/** Country names for siteConfig.legal.addressCountry (ISO 3166-1 alpha-2). */
const JURISDICTION: Record<string, string> = { MH: "Republic of the Marshall Islands" };

type Item = {
  href: string;
  label: string;
  /** A static file rather than a page: a plain link, never a client-side navigation. */
  file?: boolean;
};

/** Footer-only links, after a nav group's own: pages too small for the menus. */
const extra: Partial<Record<NavGroup["id"], Item[]>> = {
  company: [
    { href: "/about#press", label: "Press kit" },
    { href: "/contact#faq", label: "FAQ" },
  ],
  trust: [{ href: links.auditsRepo, label: "Audit reports" }],
};

// The nav's own groups (lib/nav.ts), so the two can't drift apart, then
// Resources and Legal (UX-13).
const columns: { title: string; items: Item[] }[] = [
  ...navGroups.map((g) => ({
    title: g.label,
    items: [...g.links.map(({ href, label }) => ({ href, label })), ...(extra[g.id] ?? [])],
  })),
  {
    title: "Resources",
    items: [
      { href: links.docs, label: "Documentation" },
      { href: social("github").href, label: "GitHub" },
      { href: "/llms.txt", label: "llms.txt", file: true },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/legal/user-agreement", label: "User Agreement" },
      { href: "/legal/acceptable-use", label: "Acceptable Use" },
      { href: "/legal/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

// Inline text, so a label that wraps keeps its arrow after the last word.
const itemCls = "inline-block py-1.5 text-small text-fg-muted transition-colors duration-fast can-hover:hover:text-fg";

function FooterLink({ href, label, file }: Item) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={itemCls}>
        {label}
        <Icon name="external" size="sm" className="-mr-1 ml-0.5 inline-block align-[-0.2em] text-fg-subtle" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (file) {
    return (
      <a href={href} className={itemCls}>
        {label}
      </a>
    );
  }
  // No viewport prefetch: the footer links every route, and prefetching all
  // of them cost ~165 kB per page view (PERF-07).
  return (
    <IntentLink href={href} className={itemCls}>
      {label}
    </IntentLink>
  );
}

/**
 * Site footer, on the light Day-garden canvas (D-21): a closing line over a
 * field of settling glyphs, then the brand, the status and the channels, the
 * site map in the nav's groups, and the operator's legal line with the
 * Pause-motion switch.
 */
export function Footer() {
  const country = JURISDICTION[siteConfig.legal.addressCountry] ?? siteConfig.legal.addressCountry;
  return (
    <footer className="border-t border-subtle bg-canvas">
      {/* Closing line over a field of settling glyphs (kept to the right, clear of the type). */}
      <div className="relative overflow-hidden border-b border-subtle">
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(ellipse_65%_120%_at_88%_50%,black,transparent)]">
          <GlyphField />
        </div>
        <CornerMarks only="bottom" />
        <Container className="relative py-section-sm">
          {/* A sign-off, not a second hero: smaller than the CTA band above it, so the band reads as the page's one ending. */}
          <p className="display max-w-3xl text-display-md text-fg">
            It&apos;s crypto, <em className="text-sand">but different.</em>
          </p>
          <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 label-caps">
            {["Your keys", "Your address", "Every move on-chain"].map((t, i) => (
              <span key={t} className="whitespace-nowrap">
                {i > 0 && <span aria-hidden className="mr-3 text-leaf/60">·</span>}
                {t}
              </span>
            ))}
          </p>
        </Container>
      </div>
      <Container className="py-16">
        <h2 className="sr-only">Site footer</h2>
        <div className="grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-small text-fg-muted">
              Non-custodial wealth management on Arbitrum. Your assets never leave your own wallet.
            </p>
            <Badge status="testing" className="mt-5" />
            <SocialLinks placement="footer" className="mt-6" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-6 xl:gap-x-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-label font-semibold uppercase tracking-caps text-fg-subtle">{col.title}</h3>
                <ul className="mt-4 space-y-1">
                  {col.items.map((i) => (
                    <li key={i.href}>
                      <FooterLink {...i} />
                    </li>
                  ))}
                  {col.title === "Legal" && (
                    <li>
                      <CookieSettingsButton className={itemCls} />
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-subtle pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-fg-subtle">
            © {YEAR} {siteConfig.legalName} · {country} · Reg. {siteConfig.legal.registration} · Built on Arbitrum One
          </p>
          <MotionToggle className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-full border px-3.5 text-caption text-fg-muted transition-[border-color,color,transform] duration-fast ease-out before:size-2 before:rounded-full before:border before:border-current before:content-[''] active:scale-[var(--scale-press)] can-hover:hover:border-leaf/40 can-hover:hover:text-fg aria-pressed:border-leaf/40 aria-pressed:text-leaf aria-pressed:before:bg-current sm:self-auto" />
        </div>
      </Container>
    </footer>
  );
}

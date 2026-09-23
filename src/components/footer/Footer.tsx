import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CookieSettingsButton } from "@/components/system/CookieConsent";
import { protocolStatus } from "@/lib/data/status";
import { links } from "@/lib/data/socials";

// Server component: resolved at build time and baked into the HTML.
const YEAR = new Date().getFullYear();

const columns = [
  {
    title: "Protocol",
    items: [
      { href: "/protocol", label: "How it works" },
      { href: "/security", label: "Security" },
      { href: "/token", label: "$BLOKC token" },
      { href: "/governance", label: "Governance" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/about#roadmap", label: "Roadmap" },
      { href: "/about#press", label: "Press kit" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: links.docs, label: "Documentation" },
      { href: links.whitepaper, label: "Whitepaper" },
      { href: "https://github.com/BLOKCapital", label: "GitHub" },
      { href: links.auditsRepo, label: "Audit reports" },
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

export function Footer() {
  return (
    <footer className="border-t border-line/[0.07] bg-canvas">
      <div className="mx-auto w-full max-w-page px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-small text-fg-muted">
              Non-custodial wealth management on Arbitrum. Your assets never leave your own wallet.
            </p>
            <Badge tone="current" className="mt-5">
              {protocolStatus.label}
            </Badge>
            <SocialLinks className="mt-6" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle">{col.title}</h2>
                <ul className="mt-4 space-y-1">
                  {col.items.map((i) => {
                    const external = /^https?:\/\//.test(i.href);
                    return (
                      <li key={i.href}>
                        <Link
                          href={i.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="inline-flex py-1.5 text-small text-fg-muted transition-colors hover:text-fg"
                        >
                          {i.label}
                          {external && <span className="sr-only"> (opens in a new tab)</span>}
                        </Link>
                      </li>
                    );
                  })}
                  {col.title === "Legal" && (
                    <li>
                      <CookieSettingsButton className="inline-flex py-1.5 text-small text-fg-muted" />
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 border-t border-line/[0.07] pt-8">
          <p className="max-w-4xl text-caption text-fg-subtle">
            BLOK Capital DAO LLC publishes open-source software. It does not custody assets, act as a broker, or provide
            investment advice. Crypto-assets are volatile and smart contracts carry risk; you can lose money. Read the{" "}
            <Link href="/legal/user-agreement" className="text-fg-muted underline underline-offset-2 hover:text-fg">
              User Agreement
            </Link>{" "}
            before using the protocol.
          </p>
          <p className="mt-4 text-caption text-fg-subtle">© {YEAR} BLOK Capital DAO LLC · Built on Arbitrum One</p>
        </div>
      </div>
    </footer>
  );
}

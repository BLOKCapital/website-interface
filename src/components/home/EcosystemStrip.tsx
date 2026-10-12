import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SplitText } from "@/components/motion/SplitText";
import { ecosystem } from "@/lib/data/ecosystem";

const projects = ecosystem.flatMap((g) => g.items);

/**
 * Home: the ecosystem as one strip of names (D-08b, UX-04). Every project
 * here is integrated in the code, and /protocol#ecosystem shows the code or
 * docs behind each one, so the strip only names them and links there.
 * Logos render monochrome (--logo-filter) so mixed brand colours read as one
 * calm row; projects without a logo file are set as wordmarks.
 */
export function EcosystemStrip() {
  return (
    <section id="ecosystem" className="relative py-section-sm">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Ecosystem</p>
            <SplitText className="display mt-4 text-h3 text-balance text-fg">
              Composed from projects <em className="text-sand">you already know.</em>
            </SplitText>
            <p className="mt-3 text-ui text-fg-muted">Integrations in our code, not endorsements.</p>
          </div>
          <Link
            href="/protocol#ecosystem"
            prefetch={false}
            data-cta="ecosystem_see_all"
            className="group/eco inline-flex shrink-0 items-center gap-1.5 self-start rounded-xs py-2 text-ui font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg lg:self-auto"
          >
            See every integration
            <Icon name="arrow-right" size="sm" className="transition-transform duration-fast can-hover:group-hover/eco:translate-x-0.5" />
          </Link>
        </div>
        <ul
          aria-label="Projects integrated in the code"
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-subtle pt-8 sm:grid-cols-3 lg:grid-cols-6"
        >
          {projects.map((p) => (
            <li key={p.name} className="flex h-8 items-center">
              {p.logo ? (
                <span className="relative block h-6 w-28">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    fill
                    sizes="112px"
                    unoptimized
                    className="object-contain object-left opacity-80 [filter:var(--logo-filter)]"
                    style={{ transform: `scale(${p.scale ?? 1})`, transformOrigin: "left center" }}
                  />
                </span>
              ) : (
                <span className="text-[17px] font-semibold tracking-tight text-fg/80">{p.name}</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

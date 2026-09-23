import { links } from "@/lib/data/socials";

/** Primary navigation: shared by the header, the mobile sheet and the footer. */
export const primaryNav = [
  { href: "/protocol", label: "Protocol" },
  { href: "/indices", label: "Indices" },
  { href: "/security", label: "Security" },
  { href: "/token", label: "Token" },
  { href: "/governance", label: "Governance" },
  { href: "/about", label: "About" },
  { href: links.docs, label: "Docs", external: true },
] as const;

import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/seo/og";
import { protocolStatus } from "@/lib/data/status";

// The /token card: the page's own headline and the facts its hero states.
export const dynamic = "force-static";
export const alt = "$BLOKC, BLOK Capital's governance token on Arbitrum One";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TokenOpengraphImage() {
  return ogCard({
    eyebrow: "$BLOKC token",
    title: "The token that",
    italic: "governs the protocol.",
    footer: `ERC-20 on Arbitrum One · 10B supply · IDO planned for ${protocolStatus.token}`,
  });
}

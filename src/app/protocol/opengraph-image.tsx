import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/seo/og";
import { protocolStatus } from "@/lib/data/status";

// The /protocol card: the page's own headline and its one rule.
export const dynamic = "force-static";
export const alt = "How BLOK Capital works: one smart wallet, three ways to steer it";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ProtocolOpengraphImage() {
  return ogCard({
    eyebrow: "Protocol",
    title: "One wallet.",
    italic: "Three ways to steer it.",
    badge: protocolStatus.label,
    footer: "Every Garden is a smart wallet at your own address",
  });
}

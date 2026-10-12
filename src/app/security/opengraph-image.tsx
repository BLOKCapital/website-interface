import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/seo/og";

// The /security card: the page's own headline and what it covers.
export const dynamic = "force-static";
export const alt = "BLOK Capital security: audits, contracts and controls";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function SecurityOpengraphImage() {
  return ogCard({
    eyebrow: "Security",
    title: "Check the work,",
    italic: "not our word.",
    footer: "Audits · Contracts · Who can change what · Disclosure",
  });
}

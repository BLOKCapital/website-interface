import { buildLlmsFullTxt } from "@/lib/seo/llms";

// Served at /llms-full.txt — the full inlined reference (facts, architecture,
// audits, roadmap, FAQ) so an agent can answer questions from one fetch.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

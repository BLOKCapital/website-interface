import { buildLlmsFullTxt } from "@/lib/seo/llms";

// Served at /llms-full.txt — the full inlined reference (identity, facts,
// indices, token, fees, governance, architecture, audits, roadmap, FAQ) so an
// agent can answer questions from one fetch. Built once at build time.
export const dynamic = "force-static";

export async function GET() {
  return new Response(await buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

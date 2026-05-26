import { buildLlmsTxt } from "@/lib/seo/llms";

// Served at /llms.txt — a curated, agent-readable map of the site
// (see llmstxt.org). Static: the content only changes when site data changes,
// so it's generated once at build time and cached aggressively.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

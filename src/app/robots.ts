import type { MetadataRoute } from "next";
import { BASE } from "@/lib/seo/site";

// Required by `output: "export"` — metadata routes must opt in to being
// rendered once at build time rather than per request.
export const dynamic = "force-static";

// Major AI / answer-engine crawlers. Listing them with an explicit allow is a
// clear signal that we *want* to be read and cited by these agents (many sites
// block them; we opt in). The catch-all "*" rule already permits them, so this
// is intent-documentation as much as configuration. Current user agents only
// (SEO-18): Anthropic's retired anthropic-ai and Claude-Web are gone.
const AI_AGENTS = [
  "GPTBot", // OpenAI (training)
  "OAI-SearchBot", // OpenAI (search/citations)
  "ChatGPT-User", // ChatGPT browsing
  "ClaudeBot", // Anthropic (training)
  "Claude-SearchBot", // Anthropic (search/citations)
  "Claude-User", // Claude fetching a page for a user
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (feeds many LLMs)
];

// No `host` line: it was Yandex-only, deprecated, and wants a host, not a URL.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

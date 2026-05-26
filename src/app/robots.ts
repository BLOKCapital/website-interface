import type { MetadataRoute } from "next";
import { BASE } from "@/lib/seo/site";

// Major AI / answer-engine crawlers. Listing them with an explicit allow is a
// clear signal that we *want* to be read and cited by these agents (many sites
// block them; we opt in). The catch-all "*" rule already permits them, so this
// is intent-documentation as much as configuration.
const AI_AGENTS = [
  "GPTBot", // OpenAI (training)
  "OAI-SearchBot", // OpenAI (search/citations)
  "ChatGPT-User", // ChatGPT browsing
  "ClaudeBot", // Anthropic
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (feeds many LLMs)
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

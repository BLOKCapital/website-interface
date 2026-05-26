import type { MetadataRoute } from "next";
import { getAllPolicies } from "@/lib/data/policies";
import { BASE } from "@/lib/seo/site";

/**
 * Static marketing routes plus the legal pages generated from policy data.
 * Keep this in sync with the App Router segments under src/app.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: `${BASE}/about`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/features`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/preview`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/contact`, priority: 0.6, changeFrequency: "monthly", lastModified: now },
  ];

  // Use each policy's authored `date` so crawlers see real revision times
  // instead of the build timestamp.
  const legalRoutes: MetadataRoute.Sitemap = getAllPolicies().map((policy) => ({
    url: `${BASE}/legal/${policy.slug}`,
    lastModified: new Date(policy.date),
    priority: 0.3,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...legalRoutes];
}

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * No `incrementalCache` override on purpose: every route here is statically
 * prerendered (no `export const revalidate`, no on-demand revalidation, both
 * route handlers are `force-static`), so there is no incremental cache to
 * persist. The default template wires an R2 bucket for it, which would need
 * provisioning before every deploy and then sit empty.
 *
 * If ISR is ever introduced, add:
 *   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
 *   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
 * and restore the `r2_buckets` + `WORKER_SELF_REFERENCE` blocks in wrangler.jsonc.
 */
export default defineCloudflareConfig();

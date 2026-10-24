/**
 * Every route the static export serves, in the order used by the audit
 * capture script (docs/audit/tools/capture.mjs). The first 11 are the
 * primary pages; the legal pages and the 404 follow.
 */
export const ROUTES = [
  "/",
  "/about",
  "/protocol",
  "/indices",
  "/indices/blokc2",
  "/indices/blokc5",
  "/indices/blokc10",
  "/security",
  "/token",
  "/governance",
  "/contact",
  "/legal/cookie-policy",
  "/legal/acceptable-use",
  "/legal/user-agreement",
  "/this-page-does-not-exist",
] as const;

export type Route = (typeof ROUTES)[number];

export const NOT_FOUND_ROUTE: Route = "/this-page-does-not-exist";

/** The 11 primary pages (BASELINE §6 reduced-motion check). */
export const PRIMARY_ROUTES = ROUTES.slice(0, 11);

#!/usr/bin/env node
// Internal link check for the static export (T-02, MISS-06). No network.
//
// Reads every HTML page in out/ and verifies:
//   - internal links resolve to a page or file in the export (or to a
//     redirect source in _redirects);
//   - hash links point at an id that exists on the target page;
//   - src, href, srcset and CSS url() assets exist;
//   - no relative hrefs (the site uses root-relative links only).
// External links are counted, not fetched; links that open a new tab
// without rel="noopener" are reported as warnings.
//
// Usage: node scripts/check-links.mjs [outDir]

import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "out");
if (!fs.existsSync(path.join(OUT, "index.html"))) {
  console.error(`check:links: no export in ${path.relative(process.cwd(), OUT) || "."}. Run \`npm run build\` first.`);
  process.exit(2);
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function walk(dir, skip = new Set()) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skip.has(entry.name)) files.push(...walk(p, skip));
    } else files.push(p);
  }
  return files;
}

const routeOf = (file) => {
  const r = "/" + path.relative(OUT, file).split(path.sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  return r === "/" ? "/" : r.replace(/\/$/, "");
};

/** Does a root-relative path exist in the export (as a file, page or folder index)? */
function exists(p) {
  const clean = decodeURIComponent(p.split("#")[0].split("?")[0]);
  return [clean, `${clean}.html`, path.posix.join(clean, "index.html")].some((c) => {
    const fp = path.join(OUT, c);
    return fs.existsSync(fp) && fs.statSync(fp).isFile();
  });
}

// Redirect sources (Cloudflare Pages reads out/_redirects).
const redirects = new Set();
const redirectsFile = path.join(OUT, "_redirects");
if (fs.existsSync(redirectsFile)) {
  for (const line of fs.readFileSync(redirectsFile, "utf8").split("\n")) {
    const src = line.trim().split(/\s+/)[0];
    if (src && !src.startsWith("#")) redirects.add(src.replace(/\/$/, "") || "/");
  }
}

// Pages: ids, links and asset references. RSC payload scripts are stripped so
// each link is counted once, from the rendered HTML.
const pages = new Map();
for (const file of walk(OUT, new Set(["_next"])).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8").replace(/<script[^>]*>self\.__next_f[\s\S]*?<\/script>/g, "");
  pages.set(routeOf(file), {
    ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1]))),
    links: [...html.matchAll(/<a\b[^>]*?\shref="([^"]*)"[^>]*>/g)].map((m) => ({ href: decode(m[1]), tag: m[0] })),
    assets: [
      ...[...html.matchAll(/\s(?:src|poster)="(\/[^"/][^"]*)"/g)].map((m) => decode(m[1])),
      ...[...html.matchAll(/<(?:link|meta)\b[^>]*?\s(?:href|content)="(\/[^"/][^"]*)"/g)].map((m) => decode(m[1])),
      ...[...html.matchAll(/\s(?:srcset|srcSet|imagesrcset|imageSrcSet)="([^"]*)"/g)].flatMap((m) =>
        decode(m[1])
          .split(",")
          .map((part) => part.trim().split(/\s+/)[0])
          .filter((u) => u.startsWith("/") && !u.startsWith("//")),
      ),
    ],
  });
}

const errors = { link: new Set(), anchor: new Set(), asset: new Set(), relative: new Set() };
const warnings = new Set();
const external = new Set();

for (const [route, page] of pages) {
  for (const { href, tag } of page.links) {
    if (/^https?:\/\//.test(href) || href.startsWith("//")) {
      external.add(href);
      if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener/.test(tag)) warnings.add(`${route}: target=_blank without rel=noopener → ${href}`);
      continue;
    }
    if (/^(mailto|tel|javascript|data):/.test(href)) continue;
    let [target, hash] = href.split("#");
    if (target === "") target = route;
    if (!target.startsWith("/")) {
      errors.relative.add(`${route}: relative href "${href}"`);
      continue;
    }
    const clean = decodeURIComponent(target.split("?")[0]).replace(/\/$/, "") || "/";
    const known = pages.has(clean) || exists(clean) || redirects.has(clean);
    if (!known) errors.link.add(`${route}: ${href}`);
    else if (hash && pages.has(clean) && !pages.get(clean).ids.has(decodeURIComponent(hash))) errors.anchor.add(`${route}: ${href}`);
  }
  for (const asset of page.assets) if (!exists(asset)) errors.asset.add(`${route}: ${asset}`);
}

// Fonts and images referenced from the CSS bundles.
const cssDir = path.join(OUT, "_next/static/css");
if (fs.existsSync(cssDir)) {
  for (const file of fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(cssDir, file), "utf8");
    for (const m of css.matchAll(/url\(\s*["']?(\/[^"')]+)["']?\s*\)/g)) if (!exists(m[1])) errors.asset.add(`css/${file}: ${m[1]}`);
  }
}

const labels = { link: "broken internal links", anchor: "missing anchor targets", asset: "missing assets", relative: "relative hrefs" };
const total = Object.values(errors).reduce((n, s) => n + s.size, 0);
const linkCount = [...pages.values()].reduce((n, p) => n + p.links.length, 0);
const assetCount = new Set([...pages.values()].flatMap((p) => p.assets)).size;
console.log(
  `check:links: ${pages.size} pages, ${linkCount} links, ${assetCount} unique assets, ${external.size} unique external URLs (not fetched).`,
);
for (const w of warnings) console.log(`  warning: ${w}`);
for (const [kind, set] of Object.entries(errors)) {
  if (!set.size) continue;
  console.error(`\n${labels[kind]} (${set.size}):`);
  for (const e of set) console.error(`  ${e}`);
}
if (total) process.exit(1);
console.log("check:links: OK");

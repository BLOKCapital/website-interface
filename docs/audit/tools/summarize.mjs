// Summarise capture.json + lighthouse/*.json into markdown tables.
// Usage: node summarize.mjs <dir containing capture.json and lighthouse/>
import fs from "node:fs";
import path from "node:path";

const DIR = process.argv[2];
const cap = JSON.parse(fs.readFileSync(path.join(DIR, "capture.json"), "utf8"));
const out = [];
const p = (s) => out.push(s);

// Lighthouse
const lhDir = path.join(DIR, "lighthouse");
if (fs.existsSync(lhDir)) {
  const rows = {};
  for (const f of fs.readdirSync(lhDir).filter((f) => f.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(path.join(lhDir, f), "utf8"));
    const [slug, preset] = f.replace(".json", "").split(/_(?=mobile|desktop)/);
    const a = j.audits ?? {};
    const sc = (k) => (j.categories?.[k]?.score == null ? "–" : Math.round(j.categories[k].score * 100));
    const ms = (k) => (a[k]?.numericValue == null ? "–" : (a[k].numericValue / 1000).toFixed(2) + "s");
    (rows[slug] ??= {})[preset] = {
      perf: sc("performance"), a11y: sc("accessibility"), bp: sc("best-practices"), seo: sc("seo"),
      fcp: ms("first-contentful-paint"), lcp: ms("largest-contentful-paint"),
      tbt: a["total-blocking-time"]?.numericValue == null ? "–" : Math.round(a["total-blocking-time"].numericValue) + "ms",
      cls: a["cumulative-layout-shift"]?.numericValue?.toFixed(3) ?? "–",
      si: ms("speed-index"),
      bytes: a["total-byte-weight"]?.numericValue ? Math.round(a["total-byte-weight"].numericValue / 1024) + "KB" : "–",
      lcpEl: (a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? "").slice(0, 90),
      fails: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "notApplicable" && x.scoreDisplayMode !== "manual").map((x) => x.id),
      runtimeError: j.runtimeError?.code,
    };
  }
  for (const preset of ["mobile", "desktop"]) {
    p(`\n### Lighthouse ${preset}\n`);
    p("| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Weight |");
    p("|---|---|---|---|---|---|---|---|---|---|---|");
    for (const [slug, r] of Object.entries(rows)) {
      const x = r[preset];
      if (!x) continue;
      p(`| ${slug} | ${x.perf} | ${x.a11y} | ${x.bp} | ${x.seo} | ${x.fcp} | ${x.lcp} | ${x.tbt} | ${x.cls} | ${x.si} | ${x.bytes} |${x.runtimeError ? " ERR " + x.runtimeError : ""}`);
    }
  }
  p(`\n### Lighthouse failing audits (score < 0.9), mobile\n`);
  const counts = {};
  for (const r of Object.values(rows)) for (const id of r.mobile?.fails ?? []) counts[id] = (counts[id] ?? 0) + 1;
  p(Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id, n]) => `\`${id}\` ×${n}`).join(" · "));
  p(`\n### LCP element (mobile)\n`);
  for (const [slug, r] of Object.entries(rows)) p(`- **${slug}**: \`${r.mobile?.lcpEl?.replace(/\|/g, "\\|") || "–"}\``);
}

// Capture
p(`\n### Axe violations (WCAG 2.0/2.1/2.2 A+AA + best-practice), 375 / 1280\n`);
p("| Page | 375 violations | 1280 violations |");
p("|---|---|---|");
const ruleTotals = {};
for (const [route, r] of Object.entries(cap.routes)) {
  const fmt = (w) => (r.widths[w]?.axe ?? []).map((v) => { (ruleTotals[v.id] ??= { impact: v.impact, pages: new Set(), nodes: 0, help: v.help, targets: v.targets }).pages.add(route); ruleTotals[v.id].nodes += v.nodes; return `${v.id} (${v.impact}, ${v.nodes})`; }).join("; ") || "none";
  p(`| ${route} | ${fmt(375)} | ${fmt(1280)} |`);
}
p(`\n**Axe rules hit:**\n`);
for (const [id, t] of Object.entries(ruleTotals)) p(`- \`${id}\` (${t.impact}): ${t.help}. ${t.pages.size} page(s), ${t.nodes} node-instances. e.g. \`${(t.targets[0] ?? "").replace(/\|/g, "\\|")}\``);

p(`\n### Per-page capture metrics\n`);
p("| Page | Status | CLS 375 | CLS 1280 | Height 375 / 1280 (px) | DOM nodes | Images (no alt) | Console errors | Failed requests |");
p("|---|---|---|---|---|---|---|---|---|");
for (const [route, r] of Object.entries(cap.routes)) {
  const w = r.widths;
  const errs = new Set(Object.values(w).flatMap((x) => x.consoleErrors));
  const fails = new Set(Object.values(w).flatMap((x) => x.failedRequests));
  p(`| ${route} | ${r.status} | ${w[375]?.cls} | ${w[1280]?.cls} | ${w[375]?.pageHeight} / ${w[1280]?.pageHeight} | ${w[1280]?.domNodes} | ${w[1280]?.images} (${w[1280]?.imagesNoAlt}) | ${errs.size} | ${fails.size} |`);
}
const allErr = new Set(Object.values(cap.routes).flatMap((r) => Object.values(r.widths).flatMap((x) => x.consoleErrors)));
const allFail = new Set(Object.values(cap.routes).flatMap((r) => Object.values(r.widths).flatMap((x) => x.failedRequests)));
p(`\n**Console errors (unique):** ${allErr.size ? "\n" + [...allErr].map((e) => "- `" + e.replace(/\|/g, "\\|").slice(0, 200) + "`").join("\n") : "none"}`);
p(`\n**Failed requests (unique):** ${allFail.size ? "\n" + [...allFail].map((e) => "- `" + e.slice(0, 200) + "`").join("\n") : "none"}`);

p(`\n### SEO surface (from rendered DOM, 1280)\n`);
p("| Page | <title> | H1 count | Meta description | Canonical |");
p("|---|---|---|---|---|");
for (const [route, r] of Object.entries(cap.routes)) {
  const x = r.widths[1280];
  p(`| ${route} | ${x.title} | ${x.h1.length} | ${x.metaDescription ? x.metaDescription.length + " chars" : "MISSING"} | ${x.canonical?.replace("https://blokcapital.io", "") ?? "MISSING"} |`);
}

p(`\n### Horizontal overflow sweep (320–1920)\n`);
const ov = cap.overflow ?? {};
if (!Object.keys(ov).length) p("No page overflows horizontally at 320 / 375 / 414 / 768 / 1024 / 1280 / 1440 / 1920.");
for (const [route, ws] of Object.entries(ov)) for (const [w, o] of Object.entries(ws)) p(`- ${route} @${w}: scrollWidth ${o.scrollWidth} > ${o.clientWidth}. Offenders: ${o.offenders.join(", ")}`);

p(`\n### Reduced motion (1280, prefers-reduced-motion: reduce, no scroll)\n`);
p("| Page | Reveal targets still hidden | Infinite animations running |");
p("|---|---|---|");
for (const [route, x] of Object.entries(cap.reducedMotion ?? {})) p(`| ${route} | ${x.hiddenRevealTargets} | ${x.infiniteAnimationsRunning} |`);

console.log(out.join("\n"));

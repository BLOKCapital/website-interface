// Median-of-N Lighthouse table. Usage: node lh-median.mjs <dir with run-*/ subfolders> <preset>
import fs from "node:fs";
import path from "node:path";

const DIR = process.argv[2];
const PRESET = process.argv[3] ?? "mobile";
const runs = fs.readdirSync(DIR).filter((d) => d.startsWith("run-")).sort();
const med = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
const byPage = {};
for (const r of runs) {
  for (const f of fs.readdirSync(path.join(DIR, r)).filter((f) => f.endsWith(`_${PRESET}.json`))) {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, r, f), "utf8"));
    const a = j.audits;
    const page = f.replace(`_${PRESET}.json`, "");
    (byPage[page] ??= []).push({
      perf: j.categories.performance?.score * 100,
      a11y: j.categories.accessibility?.score * 100,
      fcp: a["first-contentful-paint"]?.numericValue,
      lcp: a["largest-contentful-paint"]?.numericValue,
      tbt: a["total-blocking-time"]?.numericValue,
      cls: a["cumulative-layout-shift"]?.numericValue,
      si: a["speed-index"]?.numericValue,
    });
  }
}
console.log(`| Page | Perf | A11y | FCP | LCP | TBT | CLS | SI | runs (perf / TBT) |`);
console.log(`|---|---|---|---|---|---|---|---|---|`);
for (const [page, xs] of Object.entries(byPage).sort()) {
  const m = (k) => med(xs.map((x) => x[k]));
  const s = (v) => (v / 1000).toFixed(2) + "s";
  console.log(`| ${page} | ${Math.round(m("perf"))} | ${Math.round(m("a11y"))} | ${s(m("fcp"))} | ${s(m("lcp"))} | ${Math.round(m("tbt"))}ms | ${m("cls").toFixed(3)} | ${s(m("si"))} | ${xs.map((x) => Math.round(x.perf) + "/" + Math.round(x.tbt)).join(", ")} |`);
}

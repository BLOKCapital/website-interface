#!/usr/bin/env node
// Dead Tailwind class check (T-02, MISS-06).
//
// Every class token written in src/**/*.{ts,tsx} must produce at least one
// rule in the built CSS (out/_next/static/css). Tailwind silently ignores
// classes it can't generate, such as `border-line/12` when 12 isn't on the
// opacity scale, so a typo or an off-scale value ships as a no-op. This
// script catches that after `npm run build`.
//
// Which strings count as class lists:
//   - always: className/class attributes and props ending in "ClassName";
//     arguments to cn(), clsx(), twMerge() (through ternaries, && and ||);
//     values of variables or properties named …class, …classes, …className;
//   - never: other JSX attributes (style, sizes, tone="…"), arguments to
//     other functions, comparison operands, object keys, types, imports;
//   - otherwise only if the string clearly reads as a class list: every word
//     is class-shaped and either 60%+ of 2+ words are known to the CSS, or it
//     is a single utility-prefixed word (`bg-…`, `border-…`). That covers
//     style maps such as Button's `variants` and Badge's `tones`.
// Template literals are scanned too; tokens glued to a ${…} are skipped.
//
// Usage: node scripts/check-classes.mjs [srcDir] [cssDir]

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const SRC = path.resolve(ROOT, process.argv[2] ?? "src");
const CSS_DIR = path.resolve(ROOT, process.argv[3] ?? "out/_next/static/css");

/**
 * Tokens that are known to generate nothing today. Each one names the finding
 * that fixes it; delete the entry in the same change as the fix.
 */
const KNOWN_DEAD = {};

/**
 * Class names that are not meant to produce CSS of their own: Tailwind's
 * group/peer markers, and hooks read by JS or by attribute/state selectors.
 */
const ALLOW = [
  /^(group|peer)(\/[\w-]+)?$/, // group, group/nl, peer/x
  /^js-/, // JS hooks
  /^is-[\w-]+$/, // state classes toggled by JS (is-open, …)
  /^has-[\w-]+$/,
  /^data-[\w-]+$/,
];

/** Variables/props whose string values are class lists: class, classes, className, iconClass, … */
const CLASSY_NAME = /^(class|classes|className|cls)$|[a-z0-9](Class|Classes|ClassName)$/;
const CLASS_FUNCS = new Set(["cn", "clsx", "twMerge", "cx"]);
const CLASS_ATTR = /^(class|className|[a-z]\w*ClassName)$/;
/** Operators a class string can flow through (`cond && "…"`, `a ?? "…"`, `"a " + b`). */
const PASS_THROUGH = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.PlusToken,
]);

/** Shape of a Tailwind-ish token: lower-case utility, variants, arbitrary values. */
const TOKEN = /^!?-?[a-z0-9@[][^\s]*$/;
const TOKEN_CHARS = /^[!a-zA-Z0-9\-:[\]/.()_%,#&>*+@'"=~<?$^|]+$/;
/** A single loose word is only checked if it starts like a Tailwind utility. */
const UTILITY = /^(?:[\w-]+(?:\/[\w-]+)?:)*!?-?(text|bg|border|divide|ring|from|to|via|fill|stroke|decoration|outline|shadow|rounded|ease|duration|delay|animate|font|tracking|leading|max-w|min-w|min-h|max-h|w|h|size|p[xytrbls]?|m[xytrbls]?|gap|space-[xy]|z|top|left|right|bottom|inset|opacity|blur|backdrop|grid-cols|grid-rows|col-span|row-span|order|translate-[xy]|scale|rotate|origin|underline-offset|aspect|basis|grow|shrink|line-clamp|items|justify|self|place|content|object|overflow|cursor|select|pointer-events|transition|whitespace|break|list|columns)-/;

/* ---------- CSS: every class name any selector mentions ---------------------- */

function cssClasses(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`check:classes: ${path.relative(ROOT, dir)} not found. Run \`npm run build\` first.`);
    process.exit(2);
  }
  const names = new Set();
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".css")) continue;
    const css = fs.readFileSync(path.join(dir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (let i = 0; i < css.length; i++) {
      if (css[i] !== ".") continue;
      // Read one CSS identifier, decoding escapes (\: \/ \[ and hex like \32 ).
      let name = "";
      let j = i + 1;
      while (j < css.length) {
        const c = css[j];
        if (c === "\\") {
          const hex = /^[0-9a-fA-F]{1,6}/.exec(css.slice(j + 1, j + 7));
          if (hex) {
            name += String.fromCodePoint(parseInt(hex[0], 16));
            j += 1 + hex[0].length;
            if (/\s/.test(css[j] ?? "")) j++; // one optional space ends a hex escape
          } else {
            name += css[j + 1] ?? "";
            j += 2;
          }
        } else if (/[A-Za-z0-9_-]/.test(c) || c.charCodeAt(0) > 127) {
          name += c;
          j++;
        } else break;
      }
      if (name) names.add(name);
      i = j - 1;
    }
  }
  return names;
}

/* ---------- source: string literals in class-list positions ------------------ */

function sourceFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(p));
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) out.push(p);
  }
  return out;
}

const nameOf = (node) => (node && (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isPrivateIdentifier(node)) ? node.text : "");

/** Is this literal a class list? "yes", "no", or "maybe" (decided by its content). */
function classContext(node) {
  let child = node;
  for (let p = node.parent; p; child = p, p = p.parent) {
    if (ts.isJsxAttribute(p)) return CLASS_ATTR.test(nameOf(p.name)) ? "yes" : "no";
    if (ts.isCallExpression(p)) {
      if (!p.arguments.includes(child)) return "no";
      const callee = ts.isIdentifier(p.expression) ? p.expression.text : "";
      return CLASS_FUNCS.has(callee) ? "yes" : "no";
    }
    if (ts.isBinaryExpression(p)) {
      if (PASS_THROUGH.has(p.operatorToken.kind)) continue;
      return "no"; // a comparison operand such as `size === "lg"`
    }
    if (ts.isConditionalExpression(p)) {
      if (p.condition === child) return "no";
      continue;
    }
    if (ts.isPropertyAssignment(p)) {
      if (p.name === child) return "no"; // an object key, not a value
      if (CLASSY_NAME.test(nameOf(p.name))) return "yes";
      continue; // keep climbing: { primary: "…" } inside a style map
    }
    if (ts.isVariableDeclaration(p) || ts.isPropertyDeclaration(p) || ts.isParameter(p) || ts.isBindingElement(p)) {
      return CLASSY_NAME.test(nameOf(p.name)) ? "yes" : "maybe";
    }
    if (ts.isCaseClause(p) || ts.isElementAccessExpression(p) || ts.isComputedPropertyName(p)) return "no";
    if (
      ts.isParenthesizedExpression(p) ||
      ts.isTemplateSpan(p) ||
      ts.isTemplateExpression(p) ||
      ts.isArrayLiteralExpression(p) ||
      ts.isObjectLiteralExpression(p) ||
      ts.isJsxExpression(p) ||
      ts.isAsExpression(p) ||
      ts.isSatisfiesExpression(p)
    ) {
      continue;
    }
    return "maybe";
  }
  return "maybe";
}

/** Split a literal's text into complete tokens (drop ones glued to ${…}). */
function tokens(text, gluedStart, gluedEnd) {
  const parts = text.split(/\s+/);
  if (gluedStart && !/^\s/.test(text)) parts.shift();
  if (gluedEnd && !/\s$/.test(text)) parts.pop();
  return parts.filter(Boolean);
}

function literalsOf(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (!ts.isLiteralTypeNode(node.parent)) found.push({ node, words: tokens(node.text, false, false) });
    } else if (ts.isTemplateExpression(node)) {
      found.push({ node, words: tokens(node.head.text, false, node.templateSpans.length > 0) });
      node.templateSpans.forEach((span, i) => {
        const last = i === node.templateSpans.length - 1;
        found.push({ node, words: tokens(span.literal.text, true, !last) });
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found.map(({ node, words }) => ({
    words,
    classy: classContext(node),
    line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
  }));
}

/* ---------- check ------------------------------------------------------------ */

const css = cssClasses(CSS_DIR);
const allowed = (t) => ALLOW.some((re) => re.test(t));
const dead = new Map(); // token -> Set("file:line")
let scanned = 0;

for (const file of sourceFiles(SRC)) {
  const rel = path.relative(ROOT, file);
  for (const { words, classy, line } of literalsOf(file)) {
    if (classy === "no") continue;
    const candidates = words.filter((w) => TOKEN.test(w) && TOKEN_CHARS.test(w));
    if (candidates.length === 0) continue;
    if (classy === "maybe") {
      // A loose string counts only if it clearly reads as a class list.
      if (candidates.length !== words.length) continue;
      if (candidates.length === 1 ? !UTILITY.test(candidates[0]) : candidates.filter((w) => css.has(w)).length / candidates.length < 0.6) continue;
    }
    for (const w of candidates) {
      scanned++;
      if (css.has(w) || allowed(w)) continue;
      if (!dead.has(w)) dead.set(w, new Set());
      dead.get(w).add(`${rel}:${line}`);
    }
  }
}

const unexpected = [...dead].filter(([t]) => !(t in KNOWN_DEAD));
const stillDead = [...dead].filter(([t]) => t in KNOWN_DEAD);
const stale = Object.keys(KNOWN_DEAD).filter((t) => !dead.has(t));

console.log(`check:classes: ${scanned} class tokens checked against ${css.size} CSS class names.`);
for (const [t, where] of stillDead) {
  console.log(`  known dead (${KNOWN_DEAD[t]}): ${t}  ${[...where].slice(0, 4).join(", ")}${where.size > 4 ? ` +${where.size - 4} more` : ""}`);
}
for (const t of stale) {
  console.log(`  ! KNOWN_DEAD entry "${t}" (${KNOWN_DEAD[t]}) now resolves or is unused: remove it from scripts/check-classes.mjs.`);
}
if (unexpected.length) {
  console.error(`\n${unexpected.length} class token(s) produce no CSS rule:`);
  for (const [t, where] of unexpected) console.error(`  ${t}\n      ${[...where].join("\n      ")}`);
  console.error("\nFix the class (or the Tailwind config), or add it to ALLOW if it is a JS/state hook.");
  process.exit(1);
}
console.log("check:classes: OK");

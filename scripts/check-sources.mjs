#!/usr/bin/env node
/**
 * check-sources.mjs — coverage check for citable numerics in JSX render output.
 *
 * Goal: every user-visible data number on the site should sit within ~3 lines
 * of a `<SourceMark`, `sourceId={`, `data-source`, or `source={` reference.
 *
 * What this script counts as a "user-visible numeric":
 *   - decimals like `36.8` or `0.943` appearing inside a JSX text node
 *     (i.e. between a `>` and a `<`), e.g. `>36.8% prevalence<`
 *   - bare integers ≥ 100 inside JSX text (e.g. `>4,875<`, `>1,283<`)
 *   - decimals adjacent to a `%` sign in JSX text
 *
 * Excluded (not data values):
 *   - anything inside a `style={…}` block (CSS magic numbers — px, opacity, etc.)
 *   - SVG geometry attributes (cx, cy, r, x, y, width, height, strokeWidth)
 *   - hex colours and rgba()
 *   - default param values in function signatures
 *   - integers ≤ 99 (axis ticks, indices, padding multipliers)
 *   - lines inside /* … *​/ comments or // line comments
 *   - import/export lines
 *
 * Usage: node scripts/check-sources.mjs
 *        npm run check:sources
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

const FILE_EXT = /\.jsx$/;

const SOURCE_MARKERS = [
  /<SourceMark\b/,
  /\bsourceId\s*=\s*[{"']/,
  /\bdata-source\s*=\s*[{"']/,
  /\bsource\s*=\s*\{/,
];

// JSX-text matcher: capture content between `>` and `<` on a single line.
// e.g. `<span>36.8%</span>` -> text is "36.8%"
//       `<dt>Total: 4,875 children</dt>` -> "Total: 4,875 children"
const JSX_TEXT_RE = />([^<>{}]*?)</g;
// Hardcoded numeric inside JSX string-literal attributes: `value="0.608"` or
// `value='86.1%'`. We require the attribute name to suggest a data value.
// We accept value, label, sublabel, formula, content, message, title, text,
// detail, caption — anything that becomes user-visible.
const ATTR_RE = /\b(value|label|sublabel|formula|content|message|title|text|detail|caption|primary)\s*=\s*"([^"]*)"/g;

const NUMERIC_IN_TEXT = /\b(\d{1,3}(?:,\d{3})+|\d+\.\d+|\d{3,})\s*%?\b/g;

function listFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist') continue;
    const full = join(dir, e);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...listFiles(full));
    else if (FILE_EXT.test(e)) out.push(full);
  }
  return out;
}

function hasSourceNearby(lines, idx, radius = 3) {
  const lo = Math.max(0, idx - radius);
  const hi = Math.min(lines.length, idx + radius + 1);
  for (let i = lo; i < hi; i++) {
    for (const re of SOURCE_MARKERS) if (re.test(lines[i])) return true;
  }
  return false;
}

// Strip JSX expressions (`{…}`) — they may contain D3 / format calls; we only
// want literal numerics that appear as visible JSX text.
function stripExpressions(line) {
  // Crude — drops everything between { and } on the same line.
  return line.replace(/\{[^{}]*\}/g, '');
}

function isNoiseLine(line) {
  if (/^\s*(\/\/|\*|\/\*)/.test(line)) return true;
  if (/^\s*(import|export)\b/.test(line)) return true;
  // D3 / method-chain calls — start with a dot or contain `=>` arrow inside .attr/.style/.filter etc.
  if (/^\s*\.\w+\s*\(/.test(line)) return true;
  return false;
}

const files = listFiles(SRC);
let totalNumerics = 0;
let wrappedNumerics = 0;
const gaps = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (isNoiseLine(raw)) continue;
    const visible = stripExpressions(raw);
    const candidates = [];
    JSX_TEXT_RE.lastIndex = 0;
    let textMatch;
    while ((textMatch = JSX_TEXT_RE.exec(visible)) != null) {
      if (textMatch[1] && textMatch[1].trim()) candidates.push(textMatch[1]);
    }
    // Also scan named-attribute string literals on the original line (don't
    // strip expressions — we read them directly).
    ATTR_RE.lastIndex = 0;
    let attrMatch;
    while ((attrMatch = ATTR_RE.exec(raw)) != null) {
      candidates.push(attrMatch[2]);
    }
    for (const text of candidates) {
      NUMERIC_IN_TEXT.lastIndex = 0;
      let nm;
      while ((nm = NUMERIC_IN_TEXT.exec(text)) != null) {
        const val = nm[0];
        // Filter integers < 100 (likely UI scaffolding values like padding labels).
        const numeric = Number(val.replace(/[%,]/g, ''));
        if (Number.isInteger(numeric) && numeric < 100) continue;
        // Filter four-digit "year" integers that aren't data (e.g. NDHS 2024).
        if (Number.isInteger(numeric) && numeric >= 1900 && numeric <= 2100) continue;
        totalNumerics += 1;
        if (hasSourceNearby(lines, i)) wrappedNumerics += 1;
        else gaps.push({ file: relative(ROOT, file), line: i + 1, value: val, src: raw.trim().slice(0, 110) });
      }
    }
  }
}

const coverage = totalNumerics === 0 ? 100 : (wrappedNumerics / totalNumerics) * 100;

if (gaps.length) {
  console.log(`Found ${gaps.length} unwrapped numeric literal(s) in JSX text:\n`);
  for (const g of gaps.slice(0, 25)) {
    console.log(`  ${g.file}:${g.line}  [${g.value}]  ${g.src}`);
  }
  if (gaps.length > 25) console.log(`  … and ${gaps.length - 25} more.`);
  console.log('');
}

console.log(`Numeric literals scanned : ${totalNumerics}`);
console.log(`Wrapped near a source    : ${wrappedNumerics}`);
console.log(`Coverage                 : ${coverage.toFixed(1)}%`);

const TARGET = 95;
if (coverage < TARGET) {
  console.log(`\nBelow ${TARGET}% target — flag for /polish review.`);
}
process.exit(0);

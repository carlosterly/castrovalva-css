/**
 * API-docs drift check — verifies that what the demo pages document actually
 * exists in the component source. The demo pages are the only API reference
 * (CLAUDE.md), so nothing else would catch a documented-but-missing name.
 *
 * Checks, for every `api-table` in docs/components/*.html:
 *   - CSS custom properties (`--ds-*`) appear somewhere in src/
 *   - custom events (`ds-{component}:{action}`) appear somewhere in src/
 *   - CSS parts (tables headed "Part…") are exposed via part="…" in src/
 *
 * Attributes aren't checked: they're read through several patterns
 * (`dataset.fooBar`, class names, getters) that a text search can't resolve
 * without false positives.
 *
 * Exits 1 on any mismatch.
 *
 *   node scripts/check-api-docs.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(js|css)$/.test(p) ? [p] : [];
  });

const src = walk("src")
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

const parts = new Set();
const addParts = (s) =>
  s
    .split(/\s+/)
    .filter((p) => p && !p.includes("$"))
    .forEach((p) => parts.add(p));
for (const m of src.matchAll(/part="([^"]*)"/g)) addParts(m[1]);
for (const m of src.matchAll(/part='([^']*)'/g)) addParts(m[1]);
for (const m of src.matchAll(/setAttribute\(\s*["']part["']\s*,\s*["'`]([^"'`]+)["'`]/g))
  addParts(m[1]);

const problems = [];
let checked = 0;

for (const file of readdirSync("docs/components").filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(join("docs/components", file), "utf8");
  for (const [table] of html.matchAll(/<table[^>]*class="api-table"[\s\S]*?<\/table>/g)) {
    const header = (table.match(/<th[^>]*>([^<]*)<\/th>/) || [])[1] || "";
    const isPartTable = /part/i.test(header);
    for (const [, raw] of table.matchAll(/<td>\s*<code>([^<]+)<\/code>\s*<\/td>/g)) {
      const name = raw.trim();
      if (isPartTable) {
        if (/^\(?none\)?$/i.test(name)) continue;
        checked++;
        if (!parts.has(name)) problems.push(`${file}: part "${name}" is not exposed`);
      } else if (name.startsWith("--ds-") || /^ds-[a-z-]+:[a-z-]+$/.test(name)) {
        checked++;
        if (!src.includes(name)) problems.push(`${file}: "${name}" does not exist in src/`);
      }
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} documented name(s) missing from source (${checked} checked).`);
  process.exit(1);
}
console.log(`API docs match source: ${checked} documented properties, events and parts checked.`);

/**
 * Icon font subset — keeps every page's Material Symbols link limited to the
 * icons the site actually uses (Google Fonts `icon_names=`): ~15 KB instead
 * of the ~325 KB full static font. The FILL axis (0..1) stays in, for 3 KB:
 * active nav bar/rail items fill their icon, as MD3 specifies, via
 * `font-variation-settings: 'FILL' 1`, which a fixed-style font ignores.
 *
 * The inventory is every icon name found in:
 *   - page markup: `icon="…"`, `*-icon="…"` and `<ds-icon name="…">`
 *     attributes, and any element text that is a valid icon name (outside
 *     <pre> samples), since some icons get their font from CSS
 *   - component and shared-script templates, the same way
 *   - any quoted word in a script that is also a valid icon name, since
 *     components set some icons from code (checkbox states, banner types).
 *     That over-includes words like "tab"; each costs a few bytes, while a
 *     missed icon renders as its name in text.
 *
 * Valid names come from scripts/material-symbols-names.json, a copy of
 * Google's list, so the check needs no network. icon.html is excluded: it
 * demos the whole set and keeps the full variable font.
 *
 *   node scripts/icons.mjs          check: exit 1 if any page's link is
 *                                   missing an icon the site uses
 *   node scripts/icons.mjs --write  rewrite every page's link from the
 *                                   inventory
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const FONT_BASE =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0";
const FULL_FONT_PAGE = join("docs", "components", "icon.html");
const LINK = /https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:[^"]*/;

const valid = new Set(
  JSON.parse(readFileSync("scripts/material-symbols-names.json", "utf8")).names,
);

const walk = (dir, ext) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p, ext);
    return p.endsWith(ext) ? [p] : [];
  });

const pages = [
  ...walk("docs/components", ".html"),
  ...walk("docs/examples", ".html"),
  "index.html",
];
const scripts = [...walk("src", ".js"), ...walk("docs/shared", ".js")];

const markupIcons = (text) => [
  ...[...text.matchAll(/\b(?:icon|[a-z]+-icon)="([a-z0-9_]+)"/g)].map((m) => m[1]),
  // <ds-icon name="…">: missing this left state-layers showing "INBOX" as text
  ...[...text.matchAll(/<ds-icon\b[^>]*\bname="([a-z0-9_]+)"/g)].map((m) => m[1]),
  // Any element text that is an icon name, whatever sets its font: the
  // data-table's sort arrow gets the icon font from CSS, not a class, and
  // menu icons only render when the menu opens, so screenshots miss both
  ...[...text.matchAll(/>\s*([a-z0-9_]{2,})\s*</g)]
    .map((m) => m[1])
    .filter((name) => valid.has(name)),
];
const quotedIconWords = (code) =>
  [...code.matchAll(/["'`]([a-z0-9_]{2,})["'`]/g)]
    .map((m) => m[1])
    .filter((w) => valid.has(w));

const used = new Map(); // icon name -> first file it was found in
const note = (name, file) => used.has(name) || used.set(name, basename(file));

for (const file of pages) {
  if (file === FULL_FONT_PAGE) continue;
  const html = readFileSync(file, "utf8").replace(/<pre[\s\S]*?<\/pre>/g, "");
  for (const name of markupIcons(html)) note(name, file);
  for (const [, code] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))
    for (const name of quotedIconWords(code)) note(name, file);
}
for (const file of scripts) {
  const code = readFileSync(file, "utf8");
  for (const name of [...markupIcons(code), ...quotedIconWords(code)])
    note(name, file);
}

const unknown = [...used].filter(([name]) => !valid.has(name));
if (unknown.length) {
  for (const [name, file] of unknown)
    console.error(`  "${name}" (${file}) is not a Material Symbols name`);
  console.error("Fix the name, or refresh scripts/material-symbols-names.json.");
  process.exit(1);
}

// Google Fonts requires the names in alphabetical order
const names = [...used.keys()].sort();
const url = `${FONT_BASE}&icon_names=${names.join(",")}&display=swap`;

if (process.argv.includes("--write")) {
  let changed = 0;
  for (const file of pages) {
    if (file === FULL_FONT_PAGE) continue;
    const html = readFileSync(file, "utf8");
    if (!LINK.test(html)) continue;
    const next = html.replace(LINK, url);
    if (next !== html) {
      writeFileSync(file, next);
      changed++;
    }
  }
  console.log(`${names.length} icons; updated the font link on ${changed} page(s).`);
} else {
  const problems = [];
  for (const file of pages) {
    if (file === FULL_FONT_PAGE) continue;
    const link = readFileSync(file, "utf8").match(LINK)?.[0];
    if (!link) continue;
    const listed = new Set(link.match(/icon_names=([^&]*)/)?.[1].split(",") ?? []);
    const missing = names.filter((n) => !listed.has(n));
    if (!listed.size) problems.push(`${basename(file)}: loads the full icon font`);
    else if (missing.length)
      problems.push(`${basename(file)}: missing ${missing.join(", ")}`);
  }
  if (problems.length) {
    for (const p of problems) console.error(`  ${p}`);
    console.error("Run `npm run icons:write` to regenerate the font links.");
    process.exit(1);
  }
  console.log(`Icon font links cover all ${names.length} icons the site uses.`);
}

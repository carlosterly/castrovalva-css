/**
 * Builds docs/search-index.json from the component demo pages.
 *
 * One entry per docs/components/*.html:
 *   { slug, url, title, description, keywords }
 * where `keywords` is section headings + API attribute/event/slot/part names
 * pulled out of the page, so the nav filter can match on page content, not
 * just the component title.
 *
 * Run with `npm run build:search`. The Pages deploy runs it too, so the
 * live index is always current; the committed copy keeps local dev working.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const COMPONENTS_DIR = "docs/components";
const OUT = "docs/search-index.json";

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const all = (re, html) => [...html.matchAll(re)].map((m) => strip(m[1]));

const GENERIC = new Set([
  "basic usage",
  "usage",
  "api",
  "examples",
  "example",
]);

const entries = [];

for (const file of readdirSync(COMPONENTS_DIR).filter((f) =>
  f.endsWith(".html"),
)) {
  const slug = file.replace(/\.html$/, "");
  const html = readFileSync(join(COMPONENTS_DIR, file), "utf8");

  const title = all(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, html)[0] || slug;
  const description =
    all(/<p class="description"[^>]*>([\s\S]*?)<\/p>/gi, html)[0] ||
    all(/<p[^>]*>([\s\S]*?)<\/p>/gi, html)[0] ||
    "";

  const headings = all(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi, html).filter(
    (h) => h && !GENERIC.has(h.toLowerCase()),
  );
  const apiNames = all(/<code[^>]*>([\s\S]*?)<\/code>/gi, html).filter(
    (c) => c && c.length <= 40 && !c.includes(" "),
  );

  const keywords = [...new Set([...headings, ...apiNames])];

  entries.push({
    slug,
    url: `${slug}.html`,
    title,
    description,
    keywords,
  });
}

entries.sort((a, b) => a.title.localeCompare(b.title));
writeFileSync(OUT, JSON.stringify(entries, null, 0) + "\n");
console.log(
  `search index: ${entries.length} pages, ${entries.reduce(
    (n, e) => n + e.keywords.length,
    0,
  )} keywords -> ${OUT}`,
);

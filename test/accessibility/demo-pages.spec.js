/**
 * Runs an automated axe-core accessibility scan against every demo page
 * under docs/components/, plus the docs-site chrome pages (home page,
 * composed examples), in light and dark theme.
 *
 * axe catches what unit tests can't: incorrect ARIA (not just present-or-not),
 * insufficient color contrast, missing accessible names, invalid roles. It
 * cannot judge everything the WCAG 2.1 AA claim implies (keyboard flow,
 * screen-reader phrasing) — see the manual QA workstream in ROADMAP.md for
 * that half.
 *
 * Component demo pages were the original scope (each one embeds the shared
 * nav shell, docs-nav.js, so its markup has always been swept incidentally
 * as part of every one of those runs). EXTRA_PAGES below adds the pages that
 * had no axe coverage at all — the home page and composed examples — closing
 * the "docs site itself" gap tracked in ROADMAP.md Q4.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, "..", "..", "docs", "components");

const PAGES = readdirSync(COMPONENTS_DIR)
  .filter((f) => f.endsWith(".html"))
  .map((f) => f.replace(/\.html$/, ""))
  .sort();

// { name: test-name slug, path: URL path relative to the site root }
const EXTRA_PAGES = [
  { name: "home page", path: "/index.html" },
  { name: "settings-page (composed example)", path: "/docs/examples/settings-page.html" },
];

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function runAxeSuite(name, path, theme) {
  test(`${name} — no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {
        /* ignore */
      }
    }, theme);
    await page.goto(path, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const summary = results.violations.map(
      (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s)) — ${v.helpUrl}`,
    );
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

for (const slug of PAGES) {
  for (const theme of ["light", "dark"]) {
    runAxeSuite(slug, `/docs/components/${slug}.html`, theme);
  }
}

for (const { name, path } of EXTRA_PAGES) {
  for (const theme of ["light", "dark"]) {
    runAxeSuite(name, path, theme);
  }
}

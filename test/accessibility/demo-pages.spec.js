/**
 * Runs an automated axe-core accessibility scan against every demo page
 * under docs/components/, in light and dark theme.
 *
 * axe catches what unit tests can't: incorrect ARIA (not just present-or-not),
 * insufficient color contrast, missing accessible names, invalid roles. It
 * cannot judge everything the WCAG 2.1 AA claim implies (keyboard flow,
 * screen-reader phrasing) — see the manual QA workstream in ROADMAP.md for
 * that half.
 *
 * This suite scopes to the component demo pages themselves, matching the
 * roadmap item that introduced it. The docs-site chrome (nav shell, filter,
 * home page) gets its own audit pass later — see ROADMAP.md Q4.
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

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const slug of PAGES) {
  for (const theme of ["light", "dark"]) {
    test(`${slug} — no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t);
        } catch {
          /* ignore */
        }
      }, theme);
      await page.goto(`/docs/components/${slug}.html`, { waitUntil: "networkidle" });

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      const summary = results.violations.map(
        (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s)) — ${v.helpUrl}`,
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }
}

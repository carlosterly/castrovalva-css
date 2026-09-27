/**
 * Visual regression baselines: every demo page, the home page and the
 * composed examples at mobile and desktop width in all three themes, plus
 * one open-state shot per overlay — the states a closed-page screenshot
 * never reaches.
 *
 * Local only; see playwright.visual.config.js.
 */
import { test, expect } from "@playwright/test";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, "..", "..", "docs", "components");

// Regions that change on their own, so no two screenshots agree.
const MASKS = {
  carousel: ["ds-carousel[auto-play]"],
};

const PAGES = [
  ...readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith(".html"))
    .sort()
    .map((f) => f.replace(/\.html$/, ""))
    .map((name) => ({ name, path: `/docs/components/${name}.html`, mask: MASKS[name] })),
  { name: "home", path: "/index.html", mask: [".preview"] },
  { name: "example-settings-page", path: "/docs/examples/settings-page.html" },
];

const VIEWPORTS = [
  { key: "mobile", width: 360, height: 780 },
  { key: "desktop", width: 1280, height: 900 },
];
const THEMES = ["light", "dark", "high-contrast"];

// Date and time pickers render "today"; pin it so baselines don't age.
const FIXED_NOW = new Date("2026-06-15T10:30:00");

// Each opens one overlay from its demo page. `open` receives the page with
// the target already scrolled to the middle of the viewport.
const OVERLAYS = [
  { name: "dialog", page: "dialog", target: "#open-basic", open: (p) => p.click("#open-basic") },
  { name: "bottom-sheet", page: "bottom-sheet", target: "#open-variant-modal", open: (p) => p.click("#open-variant-modal") },
  { name: "side-sheet", page: "side-sheet", target: "#open-modal-sheet", open: (p) => p.click("#open-modal-sheet") },
  { name: "navigation-drawer", page: "navigation-drawer", target: "#open-modal-drawer", open: (p) => p.click("#open-modal-drawer") },
  { name: "menu", page: "menu", target: "#menu-trigger-basic", open: (p) => p.click("#menu-trigger-basic") },
  { name: "advanced-menu", page: "advanced-menu", target: "ds-advanced-menu", open: (p) => p.locator("ds-advanced-menu").first().evaluate((el) => el.open()) },
  { name: "split-button", page: "split-button", target: "#basic-split", open: (p) => p.click("#basic-split .menu-button") },
  { name: "combobox", page: "combobox", target: "ds-combobox", open: (p) => p.locator("ds-combobox").first().evaluate((el) => el.show()) },
  { name: "date-picker", page: "date-picker", target: "ds-date-picker", open: (p) => p.locator("ds-date-picker").first().evaluate((el) => el.openCalendar()) },
  { name: "time-picker", page: "time-picker", target: "#interactive-picker", open: (p) => p.locator("#interactive-picker").evaluate((el) => el.openClock()) },
  { name: "tooltip", page: "tooltip", target: "#tooltip-basic-target", open: (p) => p.hover("#tooltip-basic-target") },
  { name: "snackbar", page: "snackbar", target: "#show-basic-snackbar", open: (p) => p.click("#show-basic-snackbar") },
  { name: "search-view", page: "search", target: "#open-fullscreen-search", open: (p) => p.click("#open-fullscreen-search") },
];

// Demo pages pull photos from live hosts, and picsum's ?random= returns a
// different one on every load. Serve a flat placeholder derived from the URL
// instead — the same every run, and no network needed.
const IMAGE_HOSTS = /^https:\/\/(picsum\.photos|images\.unsplash\.com|placehold\.co)\//;

function placeholderFor(url) {
  const u = new URL(url);
  const dims = u.pathname.match(/\/(\d+)(?:\/(\d+))?/);
  const w = Number(u.searchParams.get("w") || dims?.[1] || 800);
  const h = Number(u.searchParams.get("h") || dims?.[2] || dims?.[1] || 600);
  let hash = 0;
  for (const ch of url) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const hue = hash % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="100%" height="100%" fill="hsl(${hue} 35% 55%)"/>
    <circle cx="${w * 0.7}" cy="${h * 0.35}" r="${Math.min(w, h) * 0.18}" fill="hsl(${(hue + 40) % 360} 45% 75%)"/>
    <path d="M0 ${h} L${w * 0.35} ${h * 0.45} L${w * 0.6} ${h * 0.75} L${w} ${h * 0.4} L${w} ${h} Z" fill="hsl(${hue} 30% 35%)"/>
  </svg>`;
}

async function load(page, path, theme) {
  await page.route(IMAGE_HOSTS, (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: placeholderFor(route.request().url()) }),
  );
  await page.clock.setFixedTime(FIXED_NOW);
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {
      /* ignore */
    }
  }, theme);
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

for (const { key, width, height } of VIEWPORTS) {
  test.describe(key, () => {
    test.use({ viewport: { width, height } });

    for (const theme of THEMES) {
      for (const { name, path, mask = [] } of PAGES) {
        test(`page ${name} (${theme})`, async ({ page }) => {
          await load(page, path, theme);
          await expect(page).toHaveScreenshot(`${name}-${key}-${theme}.png`, {
            fullPage: true,
            mask: mask.map((sel) => page.locator(sel)),
          });
        });
      }

      for (const { name, page: slug, target, open } of OVERLAYS) {
        test(`overlay ${name} (${theme})`, async ({ page }) => {
          await load(page, `/docs/components/${slug}.html`, theme);
          await page
            .locator(target)
            .first()
            .evaluate((el) => el.scrollIntoView({ block: "center" }));
          await open(page);
          // Let JS-driven opening (rAF class toggles, positioning) settle;
          // CSS transitions are already disabled by the screenshot options.
          await page.waitForTimeout(400);
          await expect(page).toHaveScreenshot(`overlay-${name}-${key}-${theme}.png`);
        });
      }
    }
  });
}

/**
 * Overlay interaction QA — the part of the manual QA pass the mechanical
 * sweep (qa-sweep.mjs) can't do: actually opening menu / dialog / tooltip /
 * snackbar and capturing their interactive states (open, hover, keyboard
 * focus, pressed) rather than just the closed page.
 *
 * Fixes nothing. Writes screenshots + a contact sheet (index.html) to
 * <outDir> (default: ./_qa-overlays).
 *
 *   node scripts/qa-overlays.mjs [outDir]
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const ROOT = process.cwd();
const OUT = resolve(process.argv[2] || "_qa-overlays");
const SHOTS = join(OUT, "shots");
const PORT = 4322;

const VIEWPORTS = [
  { key: "mobile", width: 360, height: 780 },
  { key: "desktop", width: 1280, height: 900 },
];
const THEMES = ["light", "dark"];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".woff2": "font/woff2", ".map": "application/json",
};

async function startServer() {
  const srv = createServer(async (req, res) => {
    let p = decodeURI(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    try {
      const buf = await readFile(join(ROOT, p));
      res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
      res.end(buf);
    } catch {
      res.writeHead(404);
      res.end("404");
    }
  });
  await new Promise((r) => srv.listen(PORT, r));
  return srv;
}

// Each scenario: { name, page: "<slug>.html", async run(page) }
// run() should leave the DOM in the state to screenshot; return an optional
// note string for the contact sheet.
const SCENARIOS = {
  menu: [
    { name: "basic-open", async run(page) { await page.click("#menu-trigger-basic"); await page.waitForTimeout(150); } },
    { name: "hover-item", async run(page) {
      await page.click("#menu-trigger-basic");
      await page.waitForTimeout(150);
      const item = page.locator("#menu-basic ds-menu-item").first();
      await item.hover();
      await page.waitForTimeout(80);
    } },
    { name: "keyboard-focus-item", async run(page) {
      await page.click("#menu-trigger-basic");
      await page.waitForTimeout(150);
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(80);
    } },
    { name: "with-icons", async run(page) { await page.click("#menu-trigger-icons"); await page.waitForTimeout(150); } },
    { name: "states-demo", async run(page) { await page.click("#menu-trigger-states"); await page.waitForTimeout(150); } },
  ],
  dialog: [
    { name: "basic-open", async run(page) { await page.click("#open-basic"); await page.waitForTimeout(200); } },
    { name: "alert-open", async run(page) { await page.click("#open-alert"); await page.waitForTimeout(200); } },
    { name: "fullscreen-open", async run(page) { await page.click("#open-fullscreen"); await page.waitForTimeout(200); } },
    { name: "focus-in-dialog", async run(page) {
      await page.click("#open-basic");
      await page.waitForTimeout(200);
      await page.keyboard.press("Tab");
      await page.waitForTimeout(80);
    } },
    { name: "hover-button", async run(page) {
      await page.click("#open-basic");
      await page.waitForTimeout(200);
      await page.hover("#basic-save");
      await page.waitForTimeout(80);
    } },
    { name: "configured-no-dismiss", async run(page) {
      await page.click("#open-configured");
      await page.waitForTimeout(200);
      // Verify Escape/backdrop are actually blocked as configured.
      await page.keyboard.press("Escape");
      await page.waitForTimeout(150);
    } },
  ],
  tooltip: [
    { name: "hover-basic", async run(page) { await page.hover("#tooltip-basic-target"); await page.waitForTimeout(650); } },
    { name: "focus-basic-keyboard", async run(page) { await page.locator("#tooltip-basic-target").focus(); await page.waitForTimeout(650); } },
    { name: "position-top", async run(page) { await page.hover("#tooltip-top-target"); await page.waitForTimeout(650); } },
    { name: "position-bottom", async run(page) { await page.hover("#tooltip-bottom-target"); await page.waitForTimeout(650); } },
    { name: "position-left", async run(page) { await page.hover("#tooltip-left-target"); await page.waitForTimeout(650); } },
    { name: "position-right", async run(page) { await page.hover("#tooltip-right-target"); await page.waitForTimeout(650); } },
    { name: "auto-placement", async run(page) { await page.hover("#tooltip-auto-target"); await page.waitForTimeout(650); } },
  ],
  snackbar: [
    { name: "basic-shown", async run(page) { await page.click("#show-basic-snackbar"); await page.waitForTimeout(200); } },
    { name: "with-action", async run(page) { await page.click("#show-with-action"); await page.waitForTimeout(200); } },
    { name: "with-action-hover", async run(page) {
      await page.click("#show-with-action");
      await page.waitForTimeout(200);
      const action = page.locator("ds-snackbar").locator("button, [part='action']").first();
      try { await action.hover({ timeout: 1000 }); } catch {}
      await page.waitForTimeout(80);
    } },
    { name: "queued-first", async run(page) { await page.click("#show-queued"); await page.waitForTimeout(200); } },
    { name: "queued-after-first-dismiss", async run(page) { await page.click("#show-queued"); await page.waitForTimeout(2300); } },
    { name: "indefinite-manual", async run(page) { await page.click("#show-indefinite"); await page.waitForTimeout(200); } },
  ],
};

async function run() {
  await mkdir(SHOTS, { recursive: true });
  const srv = await startServer();
  const browser = await chromium.launch();
  const rows = [];

  for (const [slug, scenarios] of Object.entries(SCENARIOS)) {
    for (const scenario of scenarios) {
      for (const vp of VIEWPORTS) {
        for (const theme of THEMES) {
          const ctx = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            deviceScaleFactor: 1,
          });
          await ctx.addInitScript((t) => {
            try { localStorage.setItem("theme", t); } catch {}
          }, theme);
          const page = await ctx.newPage();
          const consoleErrors = [];
          page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200)); });
          page.on("pageerror", (e) => consoleErrors.push("PE:" + String(e).slice(0, 200)));

          const rec = { slug, scenario: scenario.name, viewport: vp.key, theme };
          try {
            await page.goto(`http://localhost:${PORT}/docs/components/${slug}.html`, {
              waitUntil: "networkidle",
              timeout: 30000,
            });
            await page.waitForTimeout(300);
            await scenario.run(page);
            const shot = `${slug}__${scenario.name}__${vp.key}__${theme}.png`;
            await page.screenshot({ path: join(SHOTS, shot) });
            rec.shot = shot;
          } catch (e) {
            rec.error = String(e).slice(0, 200);
          }
          rec.consoleErrors = consoleErrors;
          rows.push(rec);
          await ctx.close();
        }
      }
      process.stdout.write(".");
    }
  }
  process.stdout.write("\n");

  await browser.close();
  srv.close();

  await writeFile(join(OUT, "findings.json"), JSON.stringify(rows, null, 2));
  await writeFile(join(OUT, "index.html"), contactSheet(rows));
  console.log(`${rows.length} states captured → ${OUT}\nopen ${join(OUT, "index.html")}`);
}

function contactSheet(rows) {
  const bySlug = {};
  for (const r of rows) {
    bySlug[r.slug] ??= {};
    bySlug[r.slug][r.scenario] ??= [];
    bySlug[r.slug][r.scenario].push(r);
  }

  const sections = Object.entries(bySlug)
    .map(([slug, scenarios]) => {
      const cards = Object.entries(scenarios)
        .map(([name, states]) => {
          const shots = states
            .map((s) => {
              if (s.error) return `<div class="err">${s.viewport}/${s.theme}: ${escapeHtml(s.error)}</div>`;
              const errNote = s.consoleErrors.length ? `<div class="err">console: ${escapeHtml(s.consoleErrors.join(" | "))}</div>` : "";
              return `<a href="shots/${s.shot}" target="_blank"><img loading="lazy" src="shots/${s.shot}" alt="${slug} ${name} ${s.viewport} ${s.theme}"><span>${s.viewport}/${s.theme}</span></a>${errNote}`;
            })
            .join("");
          return `<div class="scenario"><h3>${escapeHtml(name)}</h3><div class="shots">${shots}</div></div>`;
        })
        .join("");
      return `<section><h2>${slug}</h2>${cards}</section>`;
    })
    .join("\n");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Overlay QA — menu / dialog / tooltip / snackbar</title>
<style>
  body{font:14px/1.5 system-ui,sans-serif;margin:0;background:#f6f6f6;color:#1a1a1a}
  header{padding:20px 24px;background:#fff;border-bottom:1px solid #ddd;position:sticky;top:0;z-index:2}
  header h1{margin:0;font-size:18px}
  section{background:#fff;border:1px solid #ddd;border-radius:8px;margin:16px;padding:12px 16px}
  section h2{margin:0 0 8px;text-transform:capitalize;font-size:17px;border-bottom:2px solid #eee;padding-bottom:6px}
  .scenario{margin:14px 0}
  .scenario h3{margin:0 0 6px;font-size:13px;color:#444;font-weight:600}
  .shots{display:flex;flex-wrap:wrap;gap:10px}
  .shots a{display:flex;flex-direction:column;align-items:center;text-decoration:none;color:#555;font-size:11px}
  .shots img{width:260px;max-height:220px;object-fit:contain;object-position:top;border:1px solid #ddd;border-radius:4px;background:#fafafa}
  .err{color:#c62828;font-size:12px;margin:4px 0}
</style></head><body>
<header><h1>Overlay QA — menu / dialog / tooltip / snackbar (${new Date().toISOString().slice(0, 10)})</h1></header>
${sections}
</body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

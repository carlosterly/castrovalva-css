/**
 * Component QA triage sweep.
 *
 * Loads every demo page under docs/components/ at two viewports in both
 * themes and records the mechanical checks from the QA workstream
 * (docs/ROADMAP.md): horizontal overflow, console errors, page errors,
 * failed requests, whether the first demo renders, keyboard reach of the
 * primary control, and a few light accessibility flags. Also spot-checks a
 * representative set of components dropped inside <ds-dialog>.
 *
 * Fixes nothing. Writes screenshots + findings.json + a self-contained
 * contact sheet (index.html) to <outDir> (default: ./_qa-out).
 *
 *   node scripts/qa-sweep.mjs [outDir]
 *
 * Needs a Chromium from `npx playwright install chromium`.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const ROOT = process.cwd();
const OUT = resolve(process.argv[2] || "_qa-out");
const SHOTS = join(OUT, "shots");
const PORT = 4321;

const VIEWPORTS = [
  { key: "mobile", width: 360, height: 780 },
  { key: "desktop", width: 1280, height: 900 },
];
const THEMES = ["light", "dark"];

const IGNORE_CONSOLE = [/Lit is in dev mode/i, /favicon/i];

// Components a visitor is most likely to land on — fixed first (Q2).
const TIER1 = new Set([
  "button", "text-field", "checkbox", "radio", "switch", "card", "dialog",
  "menu", "tabs", "chip", "badge", "tooltip", "snackbar", "icon", "slider",
  "data-table", "fab", "list",
]);

// Representative set for the "inside a dialog" composition check.
const COMPOSE = [
  "button", "checkbox", "text-field", "chip", "slider", "switch", "badge",
  "radio",
];

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

const pageChecks = () => {
  const overflowPx =
    document.documentElement.scrollWidth - document.documentElement.clientWidth;

  const area = document.querySelector(".content-area") || document.body;
  const dsEl = [...area.querySelectorAll("*")].find((e) =>
    e.tagName.toLowerCase().startsWith("ds-"),
  );
  let firstDemo = "no ds-* element on page";
  if (dsEl) {
    const r = dsEl.getBoundingClientRect();
    const hasShadow = !!dsEl.shadowRoot && dsEl.shadowRoot.childElementCount > 0;
    firstDemo =
      r.width > 0 && r.height > 0 && (hasShadow || dsEl.childElementCount > 0)
        ? "ok"
        : `${dsEl.tagName.toLowerCase()} renders empty (${Math.round(r.width)}x${Math.round(r.height)}, shadow=${hasShadow})`;
  }

  // light a11y flags
  const a11y = [];
  const imgsNoAlt = [...area.querySelectorAll("img:not([alt])")].length;
  if (imgsNoAlt) a11y.push(`${imgsNoAlt} <img> without alt`);
  const emptyBtns = [...area.querySelectorAll("button, a[href]")].filter(
    (b) =>
      !b.textContent.trim() &&
      !b.getAttribute("aria-label") &&
      !b.getAttribute("title") &&
      !b.querySelector("img[alt]:not([alt=''])"),
  ).length;
  if (emptyBtns) a11y.push(`${emptyBtns} button/link with no accessible name`);

  return { overflowPx, firstDemo, a11y };
};

async function keyboardReach(page) {
  // Start from inside .content-area (the injected nav shell has 50+ focusable
  // items ahead of it), then Tab forward: does focus land on an interactive
  // element still inside the content area within a few presses?
  const started = await page.evaluate(() => {
    const area = document.querySelector(".content-area");
    if (!area) return false;
    area.setAttribute("tabindex", "-1");
    area.focus();
    return document.activeElement === area;
  });
  if (!started) return { reached: null, note: "no .content-area to start from" };

  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const hit = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const tag = a.tagName.toLowerCase();
      return {
        inArea: !!a.closest(".content-area"),
        tag,
        interactive:
          /^(a|button|input|select|textarea|summary)$/.test(tag) ||
          a.tabIndex >= 0 ||
          tag.startsWith("ds-"),
      };
    });
    if (!hit || !hit.inArea) break; // tabbed back out of the content area
    if (hit.interactive) return { reached: true, tabs: i + 1, on: hit.tag };
  }
  return { reached: false, tabs: 15 };
}

async function run() {
  await mkdir(SHOTS, { recursive: true });
  const slugs = (await readdir(join(ROOT, "docs/components")))
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""))
    .sort();

  const srv = await startServer();
  const browser = await chromium.launch();
  const results = [];

  for (const slug of slugs) {
    const rec = { slug, tier: TIER1.has(slug) ? 1 : 2, states: [], perComponent: {} };
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
        const pageErrors = [];
        const failedReqs = [];
        page.on("console", (m) => {
          const txt = m.text();
          if (IGNORE_CONSOLE.some((re) => re.test(txt))) return;
          if (m.type() === "error") consoleErrors.push(txt.slice(0, 200));
        });
        page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 200)));
        page.on("response", (r) => {
          if (r.status() >= 400) failedReqs.push(`${r.status()} ${r.url().replace(/^https?:\/\/[^/]+/, "")}`);
        });

        const state = { viewport: vp.key, theme };
        try {
          await page.goto(`http://localhost:${PORT}/docs/components/${slug}.html`, {
            waitUntil: "networkidle",
            timeout: 30000,
          });
          await page.waitForTimeout(500);
          Object.assign(state, await page.evaluate(pageChecks));
          const shot = `${slug}__${vp.key}__${theme}.png`;
          await page.screenshot({ path: join(SHOTS, shot) });
          state.shot = shot;

          // per-component checks once, on desktop/light
          if (vp.key === "desktop" && theme === "light") {
            rec.perComponent.keyboard = await keyboardReach(page);
          }
        } catch (e) {
          state.navError = String(e).slice(0, 160);
        }
        state.consoleErrors = consoleErrors;
        state.pageErrors = pageErrors;
        state.failedReqs = [...new Set(failedReqs)];
        rec.states.push(state);
        await ctx.close();
      }
    }
    results.push(rec);
    process.stdout.write(rec.perComponent.keyboard?.reached === false ? "k" : ".");
  }
  process.stdout.write("\n");

  // ---- composition: component inside <ds-dialog open> -------------------
  const compose = [];
  for (const slug of COMPOSE) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error" && !IGNORE_CONSOLE.some((re) => re.test(m.text()))) errs.push(m.text().slice(0, 160)); });
    page.on("pageerror", (e) => errs.push("PE:" + String(e).slice(0, 160)));
    const tag = { "text-field": "ds-text-field", "data-table": "ds-data-table" }[slug] || `ds-${slug}`;
    const html = `<!doctype html><html><head>
      <link rel="stylesheet" href="/src/styles.css">
      <script type="module" src="/src/index.js"></script></head>
      <body><ds-dialog open><span slot="headline">Compose test</span>
      <div><${tag}></${tag}></div></ds-dialog></body></html>`;
    await page.route("**/compose.html", (r) => r.fulfill({ contentType: "text/html", body: html }));
    try {
      await page.goto(`http://localhost:${PORT}/compose.html`, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(600);
      const ok = await page.evaluate((t) => {
        const el = document.querySelector(t);
        if (!el) return "component not found in dialog";
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 ? "ok" : `zero size (${Math.round(r.width)}x${Math.round(r.height)})`;
      }, tag);
      compose.push({ slug, result: ok, errors: errs });
    } catch (e) {
      compose.push({ slug, result: "nav error: " + String(e).slice(0, 120), errors: errs });
    }
    await ctx.close();
  }

  await browser.close();
  srv.close();

  // ---- findings + contact sheet ---------------------------------------
  await writeFile(join(OUT, "findings.json"), JSON.stringify({ results, compose }, null, 2));
  await writeFile(join(OUT, "index.html"), contactSheet(results, compose));
  console.log(`\n${results.length} components swept → ${OUT}\nopen ${join(OUT, "index.html")}`);
}

function summarise(rec) {
  const flags = [];
  const overflow = rec.states.filter((s) => s.overflowPx > 2);
  if (overflow.length)
    flags.push({ sev: "A", txt: `overflow: ${overflow.map((s) => `${s.viewport}/${s.theme} +${s.overflowPx}`).join(", ")}` });
  const cErr = [...new Set(rec.states.flatMap((s) => s.consoleErrors || []))];
  if (cErr.length) flags.push({ sev: "A", txt: `console.error: ${cErr.join(" | ")}` });
  const pErr = [...new Set(rec.states.flatMap((s) => s.pageErrors || []))];
  if (pErr.length) flags.push({ sev: "A", txt: `pageerror: ${pErr.join(" | ")}` });
  const fReq = [...new Set(rec.states.flatMap((s) => s.failedReqs || []))];
  if (fReq.length) flags.push({ sev: "A", txt: `failed request: ${fReq.join(", ")}` });
  const nav = rec.states.filter((s) => s.navError);
  if (nav.length) flags.push({ sev: "A", txt: `nav error: ${nav[0].navError}` });
  // Foundation / utility pages have no ds-* showcase element — not a defect.
  const NO_COMPONENT = new Set([
    "design-tokens", "state-layers", "motion-animation", "elevation",
    "focus-ring", "drag-drop", "animation-presets", "scrollbar", "text-wrapper",
  ]);
  const demoBad = [...new Set(rec.states.map((s) => s.firstDemo).filter((d) => d && d !== "ok"))];
  if (demoBad.length && !(NO_COMPONENT.has(rec.slug) && demoBad.every((d) => d.startsWith("no ds-"))))
    flags.push({ sev: "B", txt: `demo: ${demoBad.join(" | ")}` });
  const kb = rec.perComponent.keyboard;
  if (kb && kb.reached === false)
    flags.push({ sev: "B", txt: "a11y: Tab from the content area does not reach an interactive control within 15 presses" });
  const a11y = [...new Set(rec.states.flatMap((s) => s.a11y || []))];
  if (a11y.length) flags.push({ sev: "B", txt: `a11y: ${a11y.join("; ")}` });
  return flags;
}

function contactSheet(results, compose) {
  const rows = results
    .map((rec) => {
      const flags = summarise(rec);
      const worst = flags.some((f) => f.sev === "A") ? "A" : flags.length ? "B" : "ok";
      const shots = ["mobile__light", "mobile__dark", "desktop__light", "desktop__dark"]
        .map((k) => `<a href="shots/${rec.slug}__${k}.png" target="_blank"><img loading="lazy" src="shots/${rec.slug}__${k}.png" alt="${rec.slug} ${k}"></a>`)
        .join("");
      const flagHtml = flags.length
        ? flags.map((f) => `<li class="sev-${f.sev}"><b>${f.sev}</b> ${escapeHtml(f.txt)}</li>`).join("")
        : '<li class="ok">no mechanical findings — needs a visual pass for MD3 fidelity</li>';
      return `<section class="card ${worst}">
        <h2>${rec.slug} <span class="tier">Tier ${rec.tier}</span> <span class="badge ${worst}">${worst}</span></h2>
        <div class="shots">${shots}</div>
        <ul class="flags">${flagHtml}</ul>
      </section>`;
    })
    .join("\n");

  const comp = compose
    .map((c) => {
      const bad = c.result !== "ok" || c.errors.length;
      return `<li class="${bad ? "sev-B" : "ok"}"><b>${c.slug}</b> in &lt;ds-dialog&gt;: ${escapeHtml(c.result)}${c.errors.length ? " — " + escapeHtml(c.errors.join(" | ")) : ""}</li>`;
    })
    .join("");

  const counts = results.reduce(
    (a, r) => {
      const f = summarise(r);
      if (f.some((x) => x.sev === "A")) a.A++;
      else if (f.length) a.B++;
      else a.clean++;
      return a;
    },
    { A: 0, B: 0, clean: 0 },
  );

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Component QA sweep</title>
<style>
  body{font:14px/1.5 system-ui,sans-serif;margin:0;background:#f6f6f6;color:#1a1a1a}
  header{padding:20px 24px;background:#fff;border-bottom:1px solid #ddd;position:sticky;top:0;z-index:2}
  header h1{margin:0 0 4px;font-size:18px}
  .legend span{display:inline-block;margin-right:14px;font-size:12px}
  .dot{display:inline-block;width:10px;height:10px;border-radius:2px;vertical-align:middle;margin-right:4px}
  .dot.A{background:#c62828}.dot.B{background:#f9a825}.dot.ok{background:#2e7d32}
  main{padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(460px,1fr));gap:16px}
  .card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:12px 14px}
  .card.A{border-left:4px solid #c62828}.card.B{border-left:4px solid #f9a825}.card.ok{border-left:4px solid #2e7d32}
  .card h2{margin:0 0 8px;font-size:15px;text-transform:capitalize}
  .tier{font-size:11px;color:#666;font-weight:400}
  .badge{float:right;font-size:11px;padding:2px 8px;border-radius:10px;color:#fff}
  .badge.A{background:#c62828}.badge.B{background:#f9a825}.badge.ok{background:#2e7d32}
  .shots{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}
  .shots img{width:100%;height:150px;object-fit:cover;object-position:top;border:1px solid #eee;border-radius:4px;background:#fff}
  ul.flags{margin:0;padding-left:18px;font-size:12.5px}
  ul.flags li{margin:2px 0}
  .sev-A{color:#c62828}.sev-B{color:#a26a00}.ok{color:#2e7d32}
  .compose{background:#fff;border:1px solid #ddd;border-radius:8px;padding:12px 16px;margin:16px}
  .compose ul{margin:6px 0 0;padding-left:18px;font-size:12.5px}
</style></head><body>
<header>
  <h1>Component QA sweep — ${new Date().toISOString().slice(0, 10)}</h1>
  <div class="legend">
    <span><span class="dot A"></span>${counts.A} with A findings (mechanical, fix first)</span>
    <span><span class="dot B"></span>${counts.B} with B findings</span>
    <span><span class="dot ok"></span>${counts.clean} clean of mechanical issues — still need a visual MD3-fidelity pass</span>
  </div>
  <p style="font-size:12px;color:#666;margin:8px 0 0">
    Screenshots are viewport captures (360×780 / 1280×900), above the fold. Click to open full size.
    "Clean" means no <em>mechanical</em> defect — it is not a pass.
  </p>
</header>
<section class="compose">
  <b>Composition — component inside &lt;ds-dialog open&gt;</b>
  <ul>${comp}</ul>
</section>
<main>
${rows}
</main>
</body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

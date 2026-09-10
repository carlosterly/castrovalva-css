# Castrovalva Roadmap

**Horizon:** September 2026 – August 2027
**Last reviewed:** 6 September 2026

---

## What this document is

This is a **roadmap**: direction and intent, deliberately coarse. It says where the project is heading and, just as importantly, where it is not.

It is not a task tracker. Current status lives in the table below, and the authoritative answer to "what exists" is the filesystem — `src/components/` and `docs/components/`. Build conventions live in [CLAUDE.md](../CLAUDE.md).

**Keeping it current:** when work finishes, *delete* the row and add a clause to that quarter's "Done" line. Do not accumulate ticked or struck-through items — a roadmap that grows a completion log becomes the status tracker this project deliberately removed. Each quarter's table should only ever list work not yet done. Review at quarter boundaries, not per session.

## Context this roadmap is built on

Three constraints drive every decision below. If any of them change, re-read this document from the top — most of it stops making sense.

| Constraint | Value | Consequence |
| --- | --- | --- |
| **Purpose** | Portfolio / craft showcase | Optimise for what a visitor sees in 30 seconds, not for API surface |
| **Time budget** | ~5 hours/week, inconsistent | ~50h per quarter; assume months with zero progress |
| **Distribution** | Hosted docs site only | No npm publishing, no package consumers, no semver obligations |

### The honest starting position

The component library is **done enough**. Adding component #44 does nothing for a portfolio.

| Current status | |
| --- | --- |
| Components | 43 — 36/36 official MD3, plus enhancements (combobox, banner, responsive image) and 10 utilities |
| Tests | 49 files, 2,060 passing, ~92% coverage |
| Lint | Clean — 0 errors, 0 warnings |
| Deployed | Live — [carlosterly.github.io/castrovalva-css](https://carlosterly.github.io/castrovalva-css/) |

Public component APIs are stable. Token prefixes in [tokens.md](./tokens.md) are the canonical naming scheme, and deprecations should be announced here before removal. Shadow DOM internals and undocumented details carry no stability guarantee.

The thing a portfolio needs — **a URL someone can open** — now exists. The rest of Q1 makes the repo around it read as finished; everything after makes what sits behind the URL worth looking at.

---

## Guiding principles

1. **Visible beats complete.** A polished landing page for 43 components is worth more than 50 components nobody can see.
2. **Every quarter ends shippable.** Given the time budget, assume any quarter might be the last one you touch this. Nothing should be left half-migrated.
3. **The repo is part of the portfolio.** A visitor who clicks through to GitHub reads the README, notices failing checks, and forms a judgement. Repo hygiene is portfolio work, not chores.
4. **Depth over breadth.** One genuinely excellent interactive demo says more about craft than ten more components.

## Non-goals

Explicitly not doing these in this horizon. Recorded so the decision does not get silently relitigated every few months.

- **Publishing to npm.** `package.json` stays `private: true`. No semver discipline, no changelog obligations, no consumer support burden.
- **New components**, unless a gap is visible on the docs site itself.
- **Developer tooling** — the component generator CLI, theme builder, and profiling tools listed as "Phase 10D" in the component plan. Invisible to portfolio viewers, expensive to build.
- **Token pipeline work** — no migration to `md.ref`/`md.sys`/`md.comp` naming layers, no Style Dictionary or W3C Design Tokens pipeline, no dynamic colour generation. `src/tokens/tokens.css` is the source of truth and [tokens.md](./tokens.md) is the guidance. Prefer additive token changes over renames. A high-contrast theme is planned (Q4); a density mode is not — add one only for a concrete product need. Revisit the rest only if one becomes real: token export to multiple platforms, formal token governance, or token drift that CSS conventions can no longer manage.
- **Contribution infrastructure** — issue templates, RFC process, governance. There are no contributors and none are being sought.

---

## Q1 · Sep–Nov 2026 — Make it credible and visible — ✅ COMPLETE (Sep 2026)

**Theme was:** get a working, honest public URL. Reached in the first weeks, well ahead of the quarter.

Delivered:

- **Live site** — [carlosterly.github.io/castrovalva-css](https://carlosterly.github.io/castrovalva-css/), deployed serve-as-is (no build) via a Pages workflow. README leads with the URL and a screenshot.
- **Clean baseline** — lint from 28,609 problems to zero (two real bugs fixed on the way); GitHub Actions CI green with a badge; `LICENSE` added; docs consolidated 16,263 → 2,229 lines.
- **QA triage** — automated sweep of all 51 pages × 2 viewports × 2 themes ([DEFECTS.md](./DEFECTS.md)). No console errors, no broken requests, desktop clean. One systemic defect: **48 of 51 demo pages overflow horizontally on mobile** from a single `min-width: auto` flex bug in `pattern-library.css` — one CSS line should fix all of them. Human review of MD3 visual fidelity, interactive states and keyboard paths rolls into the Q2 QA workstream.

**Decision on record — serve-as-is, not a Vite build.** Fastest route to a live URL. Trade-offs, all deferred to Q2's site polish: the published site is the source tree, not a bundle; the six raw `.md` links on the home page render as plain text on Pages ([DEFECTS.md](./DEFECTS.md)); no minification or cache-busting. Revisit if the unbundled module graph loads too slowly to demo well.

---

## Q2 · Dec 2026 – Feb 2027 — Make the site worth browsing

**Theme:** Turn 60-odd demo pages into a coherent product.

**At the end of this quarter:** the site navigates like something designed, not like a directory listing.

**Done early (Sep 2026):**

- Systemic mobile-overflow defect from the Q1 triage — 48 demo pages clipped and scrolling sideways at phone width — fixed with three rules in `pattern-library.css`.
- Landing page, first pass: hero with the "why vanilla web components" pitch, a stat row, a live "running right now" panel of real components that follow the theme toggle, and CTAs — above the existing catalogue grid, which stayed (it is good navigation). Also cleared the home-page theme-toggle-overlaps-`h1` defect and the dev-era `<title>`. Not a full visual redesign; refine on feedback.
- **Navigation shell** — [docs/shared/docs-nav.js](./shared/docs-nav.js), one file included by all 50 demo pages. Fixed sidebar on desktop, off-canvas drawer + hamburger on mobile, full 50-component list grouped by category, current page highlighted and scrolled into view, live filter (`/` to focus, `Esc` to clear), arrow-key navigation. Retired the hand-built `shared-nav.html` prototype (only 7 items, linked from nowhere) — which also closed the last open mobile-overflow item.
- **Content search** — `scripts/build-search-index.mjs` generates `docs/search-index.json` from the demo pages (section headings + API attribute/event/slot/part names); the Pages deploy regenerates it each time. The nav filter now matches page content, not just titles — "disabled" surfaces every component with a disabled state, "ds-click" finds Button. Not yet covered: token-name search from `tokens.md` (blocked on the same raw-`.md` rendering issue as the home-page doc links).
- **Performance — font weight.** The Material Symbols Outlined variable font at full axis range was a 3.9 MB woff2, 82% of every page. Pinned it to a static instance (`@24,400,0,0`, ~315 KB) on every page except `icon.html` — no other page varies the icon axes. Added `preconnect` and `&display=swap` everywhere. Page weight fell ~77% (button.html 4.76 MB → 1.19 MB). `icon.html` keeps the full font since demoing those axes is its purpose. `display=swap` meant fonts never blocked paint, so FCP was already fine (~0.7–1.1 s). No exact Lighthouse score captured — the anonymous PageSpeed Insights quota was exhausted; run `npx lighthouse <url>` for the number. Optional further win: self-host a ~15 KB glyph subset instead of the 315 KB static font.
- **Component QA — triage and Tier-1 fixes.** `scripts/qa-sweep.mjs` swept all 50 demo pages × {360px, 1280px} × {light, dark}, plus 8 components inside `<ds-dialog>` — mechanically clean (no overflow, console errors, page errors or failed requests). Fixed from the sweep and the first-pass contact-sheet review: `ds-slider` keyboard + ARIA (it had neither), the mis-mapped `surface-container` tonal ramp that made every filled input read as disabled, `ds-card` dark-mode elevation, `ds-list-item` empty-leading inset, `ds-icon` text-content glyphs, `ds-button` corner radius and disabled state, `ds-badge` default colour, `ds-data-table` sort affordance, and the `docs-nav` hamburger crowding the page `<h1>`. See [DEFECTS.md](./DEFECTS.md).

| Work | Est. |
| --- | --- |
| **Component QA — manual pass.** Triage and the Tier-1 fixes are done (see _Done early_). What remains is the review the sweep cannot do: MD3 fidelity by eye (elevation, state-layer opacity, type scale, spacing rhythm), interactive states (hover / focus-visible / pressed), and the overlays the sweep never opens — menu, dialog, tooltip, snackbar. | 10h |

**Minimum viable stop:** landing page plus working navigation — **both done.** The rest is refinement.

> The separate "mobile pass over every demo page" line that used to sit here has
> been folded into the QA workstream — responsive behaviour is one dimension of
> the per-component check, not a separate activity. The docs-site accessibility
> audit moved to Q4, where the axe harness that supports it is built.

---

## Q3 · Mar–May 2027 — Make it distinctive

**Theme:** The part that separates this from every other MD3 clone.

**At the end of this quarter:** there is one thing on the site people remember.

**Done early (Sep 2026):**

- **Interactive theme playground — first pass.** [docs/components/theme-playground.html](./components/theme-playground.html), linked from the nav shell and the landing page. One primary source-colour picker; secondary / tertiary / neutral / neutral-variant / error palettes derived from it (tertiary rotated +60°, error hue anchored to the MD3 baseline). Palette generation is an OKLCH L\*→lightness ramp with per-stop sRGB gamut clamping — ~40 lines of colour maths, no dependencies. All 78 `--md-ref-palette-*` values and the `--md-sys-color-*` role set (mapped exactly as `tokens.css` does, per scheme) recompute live; a curated 12-block component preview re-themes with them. Copy per swatch, per role token, or the whole light / dark / palette block. Generating from `#006878` reproduces the shipped palette closely (primary40 → `#006a7b` vs `#006878`). Remaining: refinement on feedback — more preview components, mobile layout pass, maybe a shareable URL hash.

| Work | Est. |
| --- | --- |
| Theme playground — refinement pass (feedback, mobile, polish). | 6h |
| Visual regression tests (Playwright screenshots) — run **after** the QA workstream completes, so the baselines capture a fixed state rather than an unstable one. | 10h |
| One realistic composed demo — a settings page or dashboard built entirely from the library, proving the components work together rather than only in isolation. This is also the cheapest way to surface composition defects that per-component review cannot see. | 10h |
| **Component QA, second half** — see the workstream below. | 15h |

**Minimum viable stop:** the theme playground alone justifies the quarter.

> The standalone token explorer has been merged into the theme playground. A
> playground that shows token values as you edit them is the same build and the
> better single artefact.

---

## Q4 · Jun–Aug 2027 — Narrative and consolidation

**Theme:** Explain the craft, then stop.

**At the end of this quarter:** the project explains its own decisions, and is in a state you can leave alone indefinitely.

**Done early:** documentation consolidation, completed September 2026 — nine months ahead of schedule, freeing ~10h.

| Remaining | Est. |
| --- | --- |
| Write 3–4 short engineering notes: why vanilla web components over a framework, the Shadow DOM and theming tension and how it was resolved, the form-association pattern, what accessibility actually cost. This is the portfolio content most people skip and hiring managers actually read. | 12h |
| Publish real numbers: bundle size, coverage, Lighthouse, browser support — measured, not claimed. | 4h |
| **Build the accessibility harness.** `playwright.config.js` plus axe run across every demo page, wired into CI. `@axe-core/playwright` is already a dependency and `npm run test:a11y` currently finds zero tests — this is what makes the WCAG 2.1 AA claim in the README true rather than aspirational. | 4h |
| Accessibility audit of the **docs site itself** — the components carry a11y assertions, the pages around them have none. Runs on the harness above. | 8h |
| **High-contrast theme.** A `[data-theme="high-contrast"]` token block in `tokens.css` at WCAG AAA ratios, verified against the axe harness above. The switcher button already exists on the home page wired to `data-theme="high-contrast"` — it currently sets an attribute nothing responds to. This finishes it. Fits here because it is accessibility-craft showcase work and needs the harness to verify. | 8h |
| Clear whatever remains in [DEFECTS.md](./DEFECTS.md), and fill component gaps only if Q2–Q3 surfaced real ones. | 10h |
| Dependency refresh, final accessibility pass, roadmap review. | 6h |

**Minimum viable stop:** the engineering notes. Everything else is maintenance.

---

## Workstream: component QA

Spans Q1–Q4, ~45h total. The largest single block of work in this roadmap, and
the one most likely to overrun, so it is defined here rather than buried in a
quarter.

### Why it exists

2,060 passing unit tests prove **behaviour**: attributes reflect, events fire
with the right `detail`, keyboard handlers respond, ARIA attributes get set.

They prove nothing about whether a component *looks* right, whether its ARIA is
*correct* rather than merely present, whether it survives a 360px viewport, or
whether it still works inside a dialog inside a data table. Passing tests on an
unreviewed component is false confidence, and that is the gap this closes.

### Per-component checklist

A component is done when all of these hold, at 360px and 1280px, in light and
dark:

- [ ] Matches the MD3 spec visually — elevation, corner radius, state-layer opacity, type scale
- [ ] Every documented variant and state renders correctly
- [ ] Interactive states behave — hover, focus-visible, pressed, disabled
- [ ] Focus indicator is visible and not doubled
- [ ] Keyboard path works end to end, not just the handlers the tests assert
- [ ] No layout break, overflow or clipping at either viewport
- [ ] No console errors or warnings on the demo page
- [ ] Demo page examples all actually work — it is now the sole API reference
- [ ] Composes correctly with at least one container (dialog, sheet or card)

### Rules of engagement

**Triage first, fix second.** The Q1 sweep logs and fixes nothing. Reviewing all
43 before fixing any prevents the classic failure: rabbit-holing on component
three and never reaching component forty.

**Log to [DEFECTS.md](./DEFECTS.md), fix by visibility.** Order fixes by how
likely a visitor is to land on the component, not alphabetically or by how
interesting the bug is.

**Visual regression comes last.** Screenshot baselines taken mid-QA capture
broken state and entrench it. Q3's regression suite runs once the fixing is done.

### How the pass runs (agreed Sep 2026)

**Status:** the sweep, the contact sheet and the first-pass fidelity review
are done (Sep 2026). Only the human MD3-fidelity pass over the Tier-1
contact sheet and the never-opened overlays is outstanding.

- **One triage sweep over all 43**, not the Q2 half. It is mostly a script
  (viewports, themes, overflow, console errors, failed requests,
  keyboard-reachability of the primary control, "does the first demo render",
  plus a spot-check of representative components dropped inside `<ds-dialog>`).
  Running it over 43 pages costs little more than 21 and gives a complete
  DEFECTS picture, so Q3 skips straight to fixing.
- **Deliverable is a self-contained QA contact sheet** — one HTML page, every
  component × {360px, 1280px} × {light, dark} in a grid with the mechanical
  findings annotated inline. Screenshots live in scratch, not the repo.
- **Split of labour.** The sweep and the contact sheet catch the mechanical
  half — overflow, console errors, broken demos, keyboard reach, gross visual
  breakage. The MD3-fidelity half — is this elevation / state-layer opacity /
  type scale spec-correct, does hover/pressed feel right — is a human pass over
  the contact sheet, not something the sweep can judge.
- **Tier 1 (~18), fixed in Q2:** button, text-field, checkbox, radio, switch,
  card, dialog, menu, tabs, chip, badge, tooltip, snackbar, icon, slider,
  data-table, fab, list. **Tier 2 — everything else — fixed in Q3.**
- **Accessibility trigger.** The sweep tags a11y findings (focus visibility,
  keyboard traversal) but cannot audit ARIA properly — that needs the axe
  harness scheduled for Q4. If the triage returns a high a11y count, pull the
  4h harness forward from Q4 rather than reviewing ARIA by eye.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| **Long gaps between sessions.** The most likely failure mode at 5h/week. | Every quarter has a minimum viable stop. Nothing is left half-migrated across a gap. |
| **Scope creep into new components.** The most tempting and least valuable work — it feels productive and moves no needle. | Listed as an explicit non-goal. Requires a visible gap on the site to justify. |
| **The static deploy exposes hidden coupling.** Demo pages import from `src/` directly; a built deploy may not resolve those paths. | Q1 budgets 8h specifically for this. Discover it in month 1, not month 11. |
| **Docs drift from reality.** Was already happening — the README roadmap sat nine months stale. | Largely structural now: the September 2026 consolidation removed the duplication that caused it. Three maintained docs, and component API lives in exactly one place. |
| **A wrong demo page has nothing to catch it.** Consolidation made `docs/components/{name}.html` the sole source of API truth; there is no second copy to disagree with it. | Tests cover the behaviour the page describes. The QA workstream checks every page's examples actually work, and Q3's visual regression suite locks that in. |
| **The QA workstream overruns.** ~45h estimated against 43 components nobody has systematically reviewed. If the Q1 triage finds the average component needs more than an hour, the estimate is wrong and so is the rest of the plan. | The triage exists precisely to produce this number early. If it comes back high, cut scope at that point — drop to the top 15 components — rather than discovering the overrun in month nine. |
| **Slack has thinned.** The QA workstream, then the high-contrast theme, pushed planned work past a realistic ~200h year; Q1 finishing early recovered some of it, but Q2, Q3 and Q4 all still exceed the ~50h/quarter guide (Q4 most). | Accept that Q4's narrative work is the designated casualty — it has the least dependency on anything else and the highest tolerance for slipping into the following year. If the QA workstream runs long, cut its scope rather than letting every quarter slip; the high-contrast theme is the next thing to drop after that. |

## Revisit triggers

Re-plan from scratch if any of these become true:

- The purpose changes — someone wants to actually *use* this, or it becomes a product foundation
- The time budget changes materially in either direction
- You decide to publish to npm after all, which invalidates most of the non-goals
- The site ships and feedback points somewhere this roadmap does not go

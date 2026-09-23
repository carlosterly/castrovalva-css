# Castrovalva Roadmap

**Horizon:** September 2026 – August 2027
**Last reviewed:** 6 September 2026 (facts re-verified 23 September 2026)

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
| Tests | 49 files, 2,107 passing, ~92% coverage |
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
- **Token pipeline work** — no migration to `md.ref`/`md.sys`/`md.comp` naming layers, no Style Dictionary or W3C Design Tokens pipeline, no build-time colour generation. `src/tokens/palette.css` (the reference tonal palettes — the theme layer) and `src/tokens/tokens.css` (role mapping + type/spacing/motion/shape) are the source of truth; [tokens.md](./tokens.md) is the guidance. Prefer additive token changes over renames. A high-contrast theme shipped in September 2026 as an additive token change; a density mode is not planned — add one only for a concrete product need. Revisit the rest only if one becomes real: token export to multiple platforms, formal token governance, or token drift that CSS conventions can no longer manage.
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
- **Performance — font weight.** The Material Symbols Outlined variable font at full axis range was a 3.9 MB woff2, 82% of every page. Pinned it to a static instance (`@24,400,0,0`, ~315 KB) on every page except `icon.html` — no other page varies the icon axes. Added `preconnect` and `&display=swap` everywhere. Page weight fell ~77% (button.html 4.76 MB → 1.19 MB). `icon.html` keeps the full font since demoing those axes is its purpose. `display=swap` meant fonts never blocked paint, so FCP was already fine. Confirmed since with a real `npx lighthouse` run rather than the anonymous PageSpeed Insights quota this note originally hit: 0.9s FCP / 98 performance on desktop, 4.5s FCP / 71 performance on throttled mobile (98 on a 23 Sep 2026 re-run — simulated-mobile scores swing between runs) — see the README's [Measured numbers](../README.md#measured-numbers) table. Optional further win: self-host a ~15 KB glyph subset instead of the 315 KB static font.
- **Component QA — triage and Tier-1 fixes.** `scripts/qa-sweep.mjs` swept all 50 demo pages × {360px, 1280px} × {light, dark}, plus 8 components inside `<ds-dialog>` — mechanically clean (no overflow, console errors, page errors or failed requests). Fixed from the sweep and the first-pass contact-sheet review: `ds-slider` keyboard + ARIA (it had neither), the mis-mapped `surface-container` tonal ramp that made every filled input read as disabled, `ds-card` dark-mode elevation, `ds-list-item` empty-leading inset, `ds-icon` text-content glyphs, `ds-button` corner radius and disabled state, `ds-badge` default colour, `ds-data-table` sort affordance, and the `docs-nav` hamburger crowding the page `<h1>`. See [DEFECTS.md](./DEFECTS.md).
- **Component QA — overlay interaction pass.** `scripts/qa-overlays.mjs` actually opens the four components the mechanical sweep never triggers — menu, dialog, tooltip, snackbar — across both viewports and themes. Found three A-severity defects, logged to [DEFECTS.md](./DEFECTS.md) and **not yet fixed**: `ds-dialog`'s `actions` slot buttons have zero visual styling (a site-wide `button` reset with nothing to replace it — needs a design decision on default button styling), `ds-tooltip`'s horizontal positions are mis-offset (`left` overlaps its target), and `ds-snackbar` overflows a 360px viewport. Menu and dialog's dismiss configuration held up correctly.
- **Component QA — programmatic type-scale/spacing check.** Cross-referenced every Tier-1 component's Shadow DOM CSS against the MD3 spec's numeric sizing and typescale values (not a screenshot read — actual token/pixel values verified against `tokens.css`). Found and fixed: an invalid typescale-token-name pattern that silently discarded the intended type scale on six components plus a switch helper style, `ds-card`'s corner radius and `ds-radio`'s outer-circle size each resolving to a dead CSS fallback, and `ds-badge`'s dot variant reusing an icon token at over 2x the spec size. Switch, FAB, checkbox, and icon checked out fully spec-compliant. See [DEFECTS.md](./DEFECTS.md).
- **Component QA — manual pass, complete.** The last piece none of the earlier passes could catch: MD3 fidelity *by eye* (spacing rhythm, elevation) and hover/focus/pressed feedback actually rendering, live, in both themes, across all 18 Tier-1 components. Spacing rhythm reviewed clean across all 18 full-page contact sheets. Interactive states were pixel-diffed (rest vs. hover/focus/pressed screenshots) rather than eyeballed, since a translucent 8% overlay is easy to miss by eye but shows immediately in a diff — this caught five real defects a screenshot-only pass had marked clean: `chip`, `radio`, and `switch` share one root cause (an undefined `--md-sys-color-on-surface-rgb` custom property whose hardcoded light-theme fallback never adapts to dark theme, likely also in `snackbar`); `card`'s elevated-hover shadow bump has no dark-theme compensation the way its rest state does; `data-table`'s row-hover tint is theme-aware but too tonally close to read in dark theme; `tabs` has no hover feedback in *either* theme because a base `!important` rule permanently shadows the non-`!important` hover rule. All five logged in [DEFECTS.md](./DEFECTS.md), not fixed here per the workstream's triage-first rule.

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

- **Interactive theme playground.** [docs/components/theme-playground.html](./components/theme-playground.html), linked from the nav shell and the landing page. One primary source-colour picker; secondary / tertiary / neutral / neutral-variant / error palettes derived from it (tertiary rotated +60° by default, error hue anchored to the MD3 baseline). Palette generation is an OKLCH L\*→lightness ramp with per-stop sRGB gamut clamping — no dependencies. All 78 `--md-ref-palette-*` values and the `--md-sys-color-*` role set (mapped exactly as `tokens.css` does, per scheme) recompute live; a curated 12-block component preview re-themes with them.
- **Preset themes + colour harmony.** A grouped dropdown of ~24 starting points — 12 pattern-library accents (Material, Tailwind, Bootstrap, Ant, Carbon, Primer, Polaris, Atlassian, Chakra) and 12 editor themes (Dracula, Nord, Solarized, Gruvbox, One Dark, Monokai, Tokyo Night, Catppuccin, Night Owl, Ayu, Rosé Pine, Synthwave), each seeding a source colour + neutral tint + scheme (credited to its origin, not a reproduction). A Harmony control (Default / Analogous / Complementary / Triadic / Split) reparametrises the secondary/tertiary hue rotation.
- **Shareable URL.** The hash tracks the live theme (`#p=<preset>` or `#c=<hex>&h=<harmony>&s=dark`); a "Copy link" button and `localStorage` fallback round-trip it.
- **Export, on the same surface.** Copy per swatch, per role token, or a whole block: a complete `palette.css` replacement, or the resolved light/dark role set.
- **Token restructure.** The 91 `--md-ref-palette-*` values moved out of the 450-line `tokens.css` into their own `src/tokens/palette.css` — the one file a theme changes, so a bad edit is one `git restore` away from the shipped baseline. `tokens.css` keeps only the role mapping plus type/spacing/motion/shape.
- **Mobile layout pass.** Fixed two real issues at 320–768px: the Harmony control forced 25px of horizontal page scroll (now scrolls internally instead), and the sticky control bar covered most of a phone screen while scrolling the palettes below (now scrolls away below 720px). Zero horizontal overflow at 320/375/768/1280px.
- Generating from `#006878` reproduces the shipped palette closely (primary40 → `#006a7b`). The 12-component preview set (actions, inputs, selection, feedback, containers, navigation, lists, overlay) is judged sufficient — the playground is considered feature-complete for this quarter.
- **Composed example.** [docs/examples/settings-page.html](./examples/settings-page.html), linked from the home page (CTA row + a new "Examples" card group) and the README — a realistic account-settings screen, not a component reference page: `ds-navigation-rail` on desktop and `ds-navigation-bar` on mobile (MD3's own responsive nav pattern) both driving the same section-switching logic, cards full of form fields with shared unsaved-changes tracking across text-fields/switches/radios, a theme switcher wired to the real `data-theme` mechanism, and a delete-account flow through a real confirmation dialog and snackbar. Paid for itself immediately: opening the delete dialog in the new high-contrast theme surfaced a real, severe bug — `ds-dialog` hardcoded its surface to white in its `:host` styles, silently low-contrast in dark theme and **completely illegible** in high-contrast (white-on-white). One-line fix (the token fallback chain underneath was already correct); `dialog.test.js` still 28/28. Also surfaced two lower-priority findings: 15 of 43 components live flat in `src/components/` instead of the `{name}/{name}.js` CLAUDE.md documents (works fine — resolved by documenting the exception in CLAUDE.md rather than moving files), and the home page's live preview panel inherited the `ds-radio`/`ds-switch`/`ds-linear-progress` accessible-name bugs, since fixed with those components (see the axe clusters below).
- **Component QA, second half.** The Tier-2 manual pass (all 32 remaining demo pages) — spacing rhythm and hover/focus/pressed state-layer feel, pixel-diffed rather than eyeballed. One further real defect: `ds-textarea` has no hover styling at all, in either theme. Logged in [DEFECTS.md](./DEFECTS.md).

| Work | Est. |
| --- | --- |
| Visual regression tests (Playwright screenshots) — run **after** the QA workstream completes, so the baselines capture a fixed state rather than an unstable one. | 10h |

**Minimum viable stop:** the theme playground alone justifies the quarter.

> The standalone token explorer has been merged into the theme playground. A
> playground that shows token values as you edit them is the same build and the
> better single artefact.

---

## Q4 · Jun–Aug 2027 — Narrative and consolidation

**Theme:** Explain the craft, then stop.

**At the end of this quarter:** the project explains its own decisions, and is in a state you can leave alone indefinitely.

**Done early:** documentation consolidation, completed September 2026 — nine months ahead of schedule, freeing ~10h.

**Done early (Sep 2026):**

- **High-contrast theme.** `[data-theme="high-contrast"]` block in `tokens.css`, reusing the existing dark theme's 80/20 and 90/30 role mapping against a pure-black surface (no new palette values — additive token change only, per the token-pipeline non-goal). Outline and outline-variant pushed brighter than the dark theme's for unmistakable borders. State-layer opacities doubled for visible hover/focus/pressed feedback. The home-page switcher button was already wired to the attribute; this makes it do something. Verified by computing WCAG contrast ratios directly (relative-luminance formula) for every text-bearing role pair — all ≥7:1 (several 10–21:1); non-text roles (outline/outline-variant) land at 9–16:1 against the black surface, well past the 3:1 floor WCAG 1.4.11 sets for UI component boundaries. This was a math check, not an axe run — see below, it's since been re-verified against the real harness.
- **Accessibility harness.** `playwright.config.js` + `test/accessibility/demo-pages.spec.js` — `@axe-core/playwright` (WCAG 2.1 A/AA tags) across all 51 demo pages × {light, dark}. `npm run test:a11y` now runs 102 real checks instead of zero. First run found 45/102 failing; two systemic bugs (dark-theme native `<select>`/`<input>` contrast in demo control panels, keyboard-unreachable `.code-block` snippets) were fixed on the spot since they were shared infrastructure, not component code — down to 38/102. The rest are genuine per-component ARIA/contrast bugs, logged individually in [DEFECTS.md](./DEFECTS.md) rather than fixed here — that's the QA workstream's job, not the harness-building task's. Also retired the "high-contrast theme was only math-verified" caveat above: the harness now covers it too (it found nothing new there). Wired into CI as a non-blocking step (`continue-on-error`) initially; **flipped to blocking 22 Sep 2026** once the backlog below cleared to 0/102 — see [ci.yml](../.github/workflows/ci.yml).
- **Engineering notes.** Four short write-ups in `docs/notes/`, linked from the README and home page: why vanilla Web Components, the Shadow DOM/theming resolution, the form-association pattern, and what the axe harness actually found. Writing the last two meant verifying claims rather than reusing them, which surfaced two real issues rather than papering over them — both logged in [DEFECTS.md](./DEFECTS.md): `ds-text-field` doesn't actually participate in `FormData` (calls `attachInternals()` but never `setFormValue()`), and of the whole "Input & selection" category only `ds-checkbox` implements the documented form-association pattern at all.
- **Published real numbers.** Measured rather than reused the old claims: 2,077 tests / 92.2% coverage (matched what was already claimed); full-library bundle is 604 KB raw / **97 KB gzipped**, not the stale "~11 KB" the home page and README both had (tree-shaking only actually exists for `button` and `icon` — the other 41 components have no dedicated build entry, so the "tree-shakeable" claim overstated what's wired up; also fixed a dead `package.json` export, `"./input"`, pointing at a file the build never produces). Ran `npm run test:all` for real cross-browser numbers: Chromium and WebKit fully green, Firefox has 12 failing tests (all `ds-slider` pointer-drag simulation, not yet root-caused). Ran real Lighthouse against the live site: 71 mobile / 98 desktop performance on the home page; its 92 accessibility score independently corroborates two of the axe harness's findings. All of it is now in the README's new "Measured numbers" table with the exact command to reproduce each figure, replacing the old approximated stat line.
- **Axe findings, cluster 1 of 5 — missing accessible name.** `radio`, `switch`, `text-field`, `textarea` all failed on a control having no accessible name despite a visible label; `theme-playground` inherited three of the four via its live preview. Two root causes: `text-field`/`textarea` already had an internal but unlinked `<label>` — fixed with `aria-label` on the input/textarea directly. `radio`/`switch` had no label story at all (every demo used an external, unassociated `<label>` sibling) — fixed by giving both a `label` attribute mirroring `ds-checkbox`'s existing pattern (render the text in shadow DOM, mirror it into `aria-label`), then converting 36 demo instances across `radio.html`/`switch.html` off the old external-label markup. `npm run test:a11y`: 64/102 → 72/102 passing, the full expected 8-check gain. All affected suites (157 tests + 12 new) and lint still pass.
- **Axe findings, cluster 2 of 5 — `nested-interactive`.** `checkbox`, `chip`, and `form` (which embeds a checkbox) all failed because a host with an interactive ARIA role contained a native focusable element in its shadow DOM — `tabindex="-1"` and `aria-hidden` don't suppress axe's focusability check for a natively-focusable tag, or for any element carrying an explicit `tabindex` at all. `ds-checkbox`'s hidden `<input type="checkbox">` (vestigial — form value already comes from `ElementInternals.setFormValue()`) became `<input type="hidden">`; `ds-chip`'s remove `<button>` (already handled via delegated click on the host, never independently focusable) became a plain `<span aria-hidden="true">`. `theme-playground` inherited the fix via its live preview, no separate change needed. `npm run test:a11y`: 72/102 → 78/102, the full expected 6-check gain. See [DEFECTS.md](./DEFECTS.md) for the fix writeup; affected suites (138 tests) and lint still pass.
- **Axe findings, cluster 3 of 5 — `scrollable-region-focusable`.** `carousel`, `scrollbar`, `split-button`, `text-wrapper` all failed on an overflowing container with no way into the tab order. `split-button`/`text-wrapper` were generic `.demo-box` overflow — extended the existing `docs-nav.js` `.code-block` tab-stop fix to also cover `.demo-box`, one shared script for every demo page. `carousel`/`scrollbar` were real component bugs: `ds-carousel`'s `[part="viewport"]` (the actual scrolling box) got `tabindex="0"`, which also makes it reachable for the ArrowLeft/ArrowRight `keydown` handler already bound on the host; `ds-scrollbar`'s `.scrollbar-container` div (not the host — confirmed by testing) got the same. `npm run test:a11y`: 78/102 → 84/102, the full expected 6-check gain. See [DEFECTS.md](./DEFECTS.md) for the fix writeup; affected suites (2 new tests, 2093 total) and lint still pass. `carousel` still fails on its separate `aria-required-children` finding, unrelated to this cluster.
- **Axe findings, cluster 4 of 5 — `aria-required-parent`.** `navigation-bar`, `navigation-rail` both failed because each destination item's internal button carries `role="tab"` with no `role="tablist"` ancestor. `ds-navigation-bar` wrapped its item slot in a new `role="tablist"` div inside the existing `nav` landmark; `ds-navigation-rail` already had a `.destinations` wrapper around just the item slot, so the role (plus `aria-orientation="vertical"`) went directly on it. Neither component implements roving-tabindex/arrow-key navigation between tabs — a real but separate gap from this structural fix, logged as its own defect rather than addressed here. `npm run test:a11y`: 84/102 → 88/102, the full expected 4-check gain. See [DEFECTS.md](./DEFECTS.md) for the fix writeup; affected suites (2 new tests, 2095 total) and lint still pass.
- **Axe findings, cluster 5 of 5 — remaining one-offs, backlog cleared.** Seven unrelated findings with no shared cause: `progress-indicator` (both progress components had no accessible name — added a `label` attribute with a value-derived fallback so one always exists), `carousel` (`role="list"` items now get `role="listitem"` via a new `_updateItemRoles()`), `navigation-drawer` (closed drawers used `aria-hidden` alone, leaving translated-off-screen content still tabbable — replaced with native `inert`, which actually blocks focus), `virtual-scroll` (its listbox had no name — same `label`-attribute pattern — and its rows had no `role="option"`; plus an unrelated demo-page input missing a name), `slider` (a hardcoded, non-theme-aware header color, compounded by disabled-state opacity dimming a label that WCAG doesn't require to be dimmed at all — descoped the dimming to just the track/thumb), `design-tokens` (a `.token-name` rule was overriding each swatch's own correctly-paired text color), and `theme-playground` (palette swatch text color picked by a fixed luminance threshold instead of actual contrast ratio, so several mid-tones failed — now picks whichever of black/white contrasts more, which is mathematically guaranteed ≥4.5:1 for any background). `npm run test:a11y`: 88/102 → **102/102**, the full expected 14-check gain and the entire backlog. See [DEFECTS.md](./DEFECTS.md) for the full writeup; full suite (2107 tests) and lint still pass. CI's `test:a11y` step flipped from non-blocking to blocking the same day.
- **Docs-site accessibility audit.** The axe harness above only ever scanned `docs/components/*.html`; the home page and composed examples had zero automated coverage (the nav shell itself was already swept incidentally, since every demo page includes it). Extended `demo-pages.spec.js` with an `EXTRA_PAGES` list covering `index.html` and `docs/examples/settings-page.html` × {light, dark}. Found one real issue: the home page's live "Running right now" `<ds-switch>` preview had no `label`, so no accessible name — the same gap the `radio`/`switch` cluster-1 fix closed on their own demo pages, just never applied to this separate instance. Fixed with a real label ("Notifications"). `settings-page.html` was already clean. `npm run test:a11y`: **106/106** (102 + 4 new). Full suite (2107 tests) and lint still pass.

| Remaining | Est. |
| --- | --- |
| Clear whatever remains in [DEFECTS.md](./DEFECTS.md), and fill component gaps only if Q2–Q3 surfaced real ones. | 10h |
| Dependency refresh, final accessibility pass, roadmap review. | 6h |

**Minimum viable stop:** the engineering notes. Everything else is maintenance.

**Decision on record — sequence what's left by risk, not by table order (Sep 2026).**
Engineering notes, real numbers, and the composed demo are done — see above.
The composed demo turned out not to be purely risk-free (it found and fixed
a real dialog theming bug), which is the expected shape of this kind of
work, not a reason to have skipped it. What's left, still in risk order:

1. **Component QA manual passes** (Q2/Q3 remainders) — triage only by the workstream's own rules ("fixes nothing"), so low risk even though the findings they produce are not. Done (see above).
2. Higher risk, because it touches component source directly: **fixing the axe findings** in DEFECTS.md (the package-export and source-layout defects turned up alongside are also resolved; the form-association defect is still open), then the **docs-site accessibility audit**. Both done — 106/106 checks passing as of 22 Sep 2026 (see above).
3. **Visual regression** — the axe backlog is clear, but three visible A-severity defects are still open in DEFECTS.md (`tooltip` positioning, `snackbar` mobile overflow, unstyled `dialog` action buttons). Baselining now would lock those in, against the workstream's own "visual regression comes last" rule — fix them first, then baseline. (The fourth open A, `text-field` form association, is behavioural and doesn't affect screenshots.)

**Dependency refresh** carries its own separate risk (breaking upgrades) independent of this ordering — treat it on its own merits when it comes up, not by this list's position.

---

## Workstream: component QA

Spans Q1–Q4, ~45h total. The largest single block of work in this roadmap, and
the one most likely to overrun, so it is defined here rather than buried in a
quarter.

### Why it exists

2,107 passing unit tests prove **behaviour**: attributes reflect, events fire
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

**Status:** the sweep, the contact sheet, the first-pass fidelity review, the
overlay interaction pass (menu, dialog, tooltip, snackbar), the programmatic
type-scale/spacing check against the MD3 spec's numeric values, and the
manual pass — spacing rhythm *as felt* plus hover/focus/pressed state-layer
feel, pixel-diffed rather than eyeballed — over **both** Tier 1 and Tier 2
are all done (Sep 2026), and every defect any of those turned up has been
logged (see [DEFECTS.md](./DEFECTS.md)); most visible-severity ones are
fixed, with four A-severity defects still open. The Tier-2 pass covered all 32 remaining demo pages and found one
further real defect (`ds-textarea` has no hover styling at all, in either
theme — the sibling `ds-text-field` implements it correctly).

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

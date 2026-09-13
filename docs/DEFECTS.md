# Defects

Open defects, found however they turn up — the
[component QA workstream](./ROADMAP.md#workstream-component-qa)'s checklist is
the main source, but real ones have also come from the axe/Lighthouse audits,
and from just building something else and noticing the thing underneath it
was wrong. Wherever it came from, it goes here rather than getting fixed
silently and forgotten or left to rot in a chat transcript.

## How to use this file

**It lists open defects only.** When something is fixed, **delete the entry** —
do not tick it, do not strike it through, do not move it to a "Fixed" section.
A file that accumulates resolved items becomes a status tracker, drifts, and
stops being read. Git history is the record of what was fixed.

**Absence means nothing.** A component with no entries here has either been
reviewed and found clean, or not reviewed at all. This file does not track
review coverage — the roadmap's quarter descriptions do.

**One line per defect where possible.** If a defect needs three paragraphs, it
is probably a design decision rather than a defect, and belongs in the roadmap.

### Severity

| | Meaning |
| --- | --- |
| **A** | Visibly broken. A visitor would notice. Fix before the site is shown to anyone. |
| **B** | Wrong but not obviously so — off-spec spacing, a missing state, an inconsistency. |
| **C** | Polish. Nobody but you will ever notice. |

### Format

```markdown
### component-name

- **A** — What is wrong, at which viewport/theme if relevant.
- **B** — Another one.
```

---

## Open defects

### home page (index.html)

- **B** — The six documentation links (`README.md`, `CLAUDE.md`, `docs/ROADMAP.md`, `docs/tokens.md`, `docs/state-layers.md`, `docs/motion.md`) point at raw `.md` files. On the deployed Pages site these render as plain text or download rather than as formatted pages. Accepted for the serve-as-is deploy; proper fix (render to HTML, or link to the GitHub blob view) is site work.
- **B** — Lighthouse (accessibility, live site) flags `aria-progressbar-name` and `aria-toggle-field-name` in the "Running right now" live preview panel — the same underlying `ds-linear-progress`/`ds-radio`/`ds-switch` bugs already logged under those components below, surfacing here too since the panel embeds real instances.

### package build

- **B (fixed)** — `package.json`'s `exports` map listed `"./input": "./dist/input.js"`, but no `input` component exists (the real component is `text-field`) and `vite.config.js` never had a build entry for it — `dist/input.js` was never generated, so that export always 404'd. Removed the entry rather than fabricate an entry point. Found while measuring bundle size for the roadmap's "publish real numbers" item.
- **B** — Only `button` and `icon` have dedicated `vite.config.js` build entries (and matching `package.json` exports) out of 43 components. The README's "Tree-shakeable — import only the components you use" claim is only true for those two; every other component is only reachable via the full `import "castrovalva"` (`dist/index.js`, ~604 KB raw / ~97 KB gzipped for all 43 components + icons). Not a functional bug — nobody consumes this via npm (`private: true`) — but the claim overstates what's actually wired up.

### source layout

- **B** — CLAUDE.md documents `src/components/{name}/{name}.js` for every component, but 14 of them (badge, card, chip, dialog, fab, menu, progress-indicator, radio, slider, snackbar, switch, tabs, textarea, tooltip) actually live flat at `src/components/ds-{name}.js`; their `{name}/` directory holds only the stub README. Everything still imports and works — `src/index.js` points at the real paths — so this is a documentation/reality mismatch, not a functional bug. Found while looking up component source while building the composed settings-page demo.

### carousel

- **A** — axe `aria-required-children` (critical): the `role="list"` viewport's children aren't `role="listitem"` (9 nodes, both themes).
- **A** — axe `scrollable-region-focusable`: the scrolling viewport isn't in the tab order (8 nodes).

### checkbox

- **A** — axe `nested-interactive`: `ds-checkbox`'s rendered markup nests one interactive control inside another — invalid ARIA that can break screen-reader operation (13 nodes, both themes). Same pattern as `chip`, `form`, `theme-playground` — likely one shared fix in the component's internal markup.

### chip

- **A** — axe `nested-interactive`: same pattern as `checkbox` (8 nodes, both themes).

### design-tokens

- **B** — axe `color-contrast`: `.token-name` text on at least one `.surface-chip` swatch fails contrast (both themes).

### dialog

- **A (fixed)** — `:host` set `--ds-dialog-surface-color: #ffffff` unconditionally, short-circuiting the surface's own theme-aware fallback (`var(--ds-dialog-surface-color, var(--md-sys-color-surface-container-high, ...))`) so every dialog rendered on a hardcoded white background regardless of theme. Harmless-looking in light theme; in dark theme it made `on-surface` text (a light color, meant for dark backgrounds) low-contrast against that white surface; in the new high-contrast theme `on-surface` is pure white, making dialog titles and body text **completely invisible** against the same hardcoded white — a real, severe bug no one had seen because nothing had opened a dialog in high-contrast theme until the composed settings-page example did. Fixed by deleting the hardcoded default so the existing fallback chain (already correct) takes over; consumers can still override `--ds-dialog-surface-color` themselves, that capability wasn't removed. Verified: `dialog.test.js` (28/28) still passes, and the settings-page example's delete-confirmation dialog is now legible in all three themes.
- **A** — Every dialog demo's `actions` slot (Cancel/Save/Delete/Confirm) is a native `<button>`, and the site-wide reset (`button { border: none; background: none; padding: 0; }` in `src/styles/reset.css`) strips them of all visual affordance — they render as bare unstyled text with no padding, background, or hover/pressed state, just the browser's default outline on Tab focus. `ds-dialog`'s `::slotted([slot="actions"])` rule only lays out the wrapper `<div>` (flex + gap), it never styles the buttons themselves. Same pattern in the composed `docs/examples/settings-page.html` delete-confirmation dialog, so this isn't a one-off demo mistake — every real usage of the actions slot looks unfinished. Found opening every dialog demo variant in both themes; independent of viewport.

### form

- **A** — axe `label` (critical): several `ds-text-field`/native inputs in the form demos have no accessible name (10 nodes, both themes).
- **A** — axe `nested-interactive`: `ds-checkbox` nested inside `#initialForm`/`#interactiveForm` — the checkbox component bug above, surfacing here too.

### navigation-bar

- **A** — axe `aria-required-parent` (critical): `ds-navigation-bar-item` renders a role that requires a specific ARIA parent role the markup doesn't provide (20 nodes, both themes).

### navigation-drawer

- **A** — axe `aria-hidden-focus`: closed/inactive drawers (`#basic-drawer`, `#modal-drawer`, `#left-drawer`) are `aria-hidden` while still containing focusable elements — a hidden-but-tabbable trap (5 nodes, both themes).

### navigation-rail

- **A** — axe `aria-required-parent` (critical): same role/parent mismatch as `navigation-bar`, on `ds-navigation-rail-item` (18 nodes, both themes).

### progress-indicator

- **A** — axe `aria-progressbar-name`: `ds-linear-progress` renders `role="progressbar"` with no accessible name (8 nodes, both themes). Also present on `theme-playground`'s live preview.

### radio

- **A** — axe `aria-toggle-field-name`: `ds-radio` has no accessible name in most demo configurations (22 nodes, both themes) — the visible label text exists but isn't wired as the control's accessible name. Surprising for an already-reviewed Tier-1 component; the mechanical QA sweep couldn't catch this because it only checks for a *visible* label, not whether it's exposed to assistive tech.

### scrollbar

- **B** — axe `scrollable-region-focusable`: the `ds-scrollbar` demo's scrolling container isn't keyboard-reachable (10 nodes, both themes).

### slider

- **B** — axe `color-contrast`: the light-DOM `.label`/`.value-display` text next to `ds-slider` demos fails contrast (12 nodes, both themes).
- **B** — 12 unit tests fail on Firefox only (`npm run test:all`), all pointer-drag interaction/event tests (`should emit input/change event on pointer interaction`, `should update value when dragged`, `should snap values to step`, …). Chromium and WebKit pass all of them. Not yet root-caused — could be a real Firefox pointer-event handling difference in the component, or a Playwright synthetic-pointer-event quirk specific to Firefox's test harness rather than a user-facing bug. Needs someone to actually drag a slider in real Firefox before concluding either way.

### snackbar

- **A** — At 360px viewport, a snackbar with an action (the "With Action" demo, message + "UNDO" + dismiss icon) renders ~376px wide against the 360px viewport, clipping the message on the left and the action/dismiss controls on the right (confirmed by measurement: inner box left=-8px, right=368px vs a 360px viewport). Not caught by the mechanical QA sweep because it's `position: fixed` content — it never registers in `document.documentElement.scrollWidth`, which is what the sweep's overflow check reads. Both themes; message-only and basic snackbars (no action) fit fine, so this only hits the action/dismissible variants.

### split-button

- **B** — axe `scrollable-region-focusable`: one demo-box scrolls without keyboard access (1 node, both themes).

### switch

- **A** — axe `aria-toggle-field-name`: `ds-switch` has no accessible name in several demos (14 nodes, both themes) — same underlying pattern as `radio`.

### text-field

- **A** — axe `label` (critical): the internal `<input>` isn't reliably exposed with the visible `label` attribute's text as its accessible name — fails even on fully-labelled examples like `label="Full Name"` (21 nodes, both themes).
- **A** — `ds-text-field` calls `this.attachInternals()` but never sets `static formAssociated = true` or calls `setFormValue()`. Verified empirically: `new FormData(form)` on a form containing a named, valued `ds-text-field` silently omits it — the field's value never reaches form submission. `checkValidity()`/`reportValidity()` are implemented by delegating to the internal native `<input>`, so those work standalone, but the field is invisible to the *enclosing* form. Grepped every input/selection component for `formAssociated`: **only `ds-checkbox` fully implements it** (declares the flag and calls `setFormValue`). `ds-radio`, `ds-switch`, `ds-slider`, `ds-select`, `ds-combobox`, `ds-textarea`, `ds-data-table` use neither `formAssociated` nor `attachInternals` at all, despite CLAUDE.md documenting this as the convention for the whole "Input & selection" category. This is bigger than one component — it's the documented pattern applied in one place out of roughly a dozen it's supposed to cover.

### text-wrapper

- **B** — axe `scrollable-region-focusable`: one demo-box scrolls without keyboard access (1 node, both themes).

### textarea

- **A** — axe `label` (critical): same missing-accessible-name pattern as `text-field`, on `ds-textarea` (11 nodes, both themes).

### theme-playground

- **A** — axe `aria-progressbar-name`, `aria-toggle-field-name`, `label`, `nested-interactive`: inherits the `progress-indicator` / `radio`+`switch` / `text-field` / `checkbox` bugs above via its live component preview — no separate fix needed once those land.
- **B** — axe `color-contrast`: palette swatch button labels fail contrast against their own swatch background for some tones (11 nodes, both themes).

### tooltip

- **A** — `position="left"` and `position="right"` render overlapping the target instead of beside it, in both themes — a visitor would see the tooltip cover part of the button's own label. `top`/`bottom` are correctly offset; only the two horizontal positions are affected. Confirmed by measurement, not just a screenshot read: hovering `#tooltip-left-target` (button at x=778–806), the tooltip's rendered box lands at x=692–785 — overlapping ~13px into the button — even though the inline `left` style the component actually sets (676.8px) would, if honored, place it with a clean 8px gap outside the button. Something between `calculatePosition()`'s `left`/`right` branches (`ds-tooltip.js`) and the final rendered box introduces the offset; `top`/`bottom` use a different (centering) formula and aren't affected. Not caught by the QA sweep, which never opens a tooltip via hover/focus.

### virtual-scroll

- **A** — axe `aria-input-field-name`: the jump-to-index input has no accessible name (8 nodes, both themes).
- **A** — axe `aria-required-children` (critical): the `role="listbox"` container's children don't carry `role="option"` (7 nodes, both themes).

## First-pass screenshot review — done, all findings actioned

Claude's first pass over the `_qa-out/` contact sheet (Tier-1 components,
desktop + mobile, light + dark, 11 Sep 2026). Everything it surfaced is now
fixed (see git history):

- **Filled-surface tonal ramp.** `surface-container` steps were mapped onto
  mid-grey palette tones, so text fields, filled cards and the data-table
  toolbar read as disabled. Also why the switch's unselected track outline
  looked absent — it was there, just no contrast against the grey fill.
- **`ds-card`** elevated variant not separating from the page in dark mode.
- **`ds-list-item`** reserving leading-slot space (~32px inset) when empty.
- **`ds-icon`** ignoring text-content glyphs — every `<ds-fab>` on its demo
  page rendered iconless.
- **`ds-button`** corner radius (`--ds-radius-md` / ~8px → MD3 full-pill)
  and disabled state (brand colour dimmed → `on-surface` 12% / 38% tint).
- **`ds-badge`** default colour `primary` → `error` (MD3 default).
- **`ds-data-table`** sort arrows shown on every column at rest → only the
  active or hovered column; pagination row vertically aligned.

Reviewed and looked clean in this pass: checkbox, radio, tabs.

**Overlay interaction pass — done, 12 Sep 2026.** `scripts/qa-overlays.mjs`
actually opens the four components the mechanical sweep never triggers —
menu, dialog, tooltip, snackbar — and captures their interactive states
(open, hover, keyboard focus, pressed) at both viewports and both themes
(96 states). Three real findings, logged under their components above:
dialog's `actions` slot buttons render with no visual styling at all (a
site-wide `button` reset with nothing to replace it), `ds-tooltip`'s
`position="left"`/`"right"` overlap their target instead of sitting beside
it, and `ds-snackbar` with an action overflows a 360px viewport (invisible
to the sweep since fixed-position content doesn't register as page
overflow). Menu — including keyboard roving focus, icons, and the
selected/disabled/divider states demo — and dialog's `dismiss-on-esc`/
`dismiss-on-backdrop-click` configuration held up correctly. One dead end
worth recording so it isn't rechecked: the menu item's keyboard-focus state
layer looked absent in a full-page screenshot but is real — it's a subtle
12%-opacity overlay only visible on close inspection, confirmed by a
cropped/zoomed capture.

**Still to do — the full manual pass.** The screenshot review and the
overlay pass above only catch structural, token, and interaction-triggered
issues. A human eye is still needed on spacing rhythm and MD3 type scale
across the Tier-1 contact sheet, and on hover/pressed states for components
outside the four overlays checked above.

## Triage coverage

### Q2 full sweep — 10 Sep 2026

`scripts/qa-sweep.mjs` over all 50 demo pages × {360px, 1280px} × {light, dark}
— 200 states. Checked: horizontal overflow, console errors, uncaught
exceptions, failed requests, whether the first `ds-*` renders, keyboard reach
of the primary control, a few light a11y flags. Plus 8 representative
components dropped inside `<ds-dialog open>`.

**Mechanically clean.** Zero overflow, zero console errors, zero page errors,
zero failed requests anywhere. All 8 composition checks pass.

**Three findings, all since fixed (see git history):** `ds-slider` had no
keyboard operation and no ARIA (A) — now has `role="slider"` thumbs, full arrow
/ Page / Home / End keys, and synced `aria-value*`; the `state-layers` demo had
three unnamed icon buttons (B); the `docs-nav.js` mobile hamburger crowded the
page `<h1>` on every demo page (B) — top padding bumped to 72px.

**Explained, no action:** `search-view` — its `<ds-search-view>` overlays live
outside `.content-area` by design, so the sweep sees "no component on page".
`tooltip` — `ds-tooltip` is 0×0 at rest, which is correct for a hover/focus
tooltip.

### Still needs a human pass

The sweep only covers mechanical checks. Not covered — this is where most
remaining findings will come from, reviewing the contact sheet
(`_qa-out/index.html`, not committed):

- MD3 visual fidelity — elevation, corner radius, state-layer opacity, type scale
- Interactive states — hover, focus-visible, pressed, disabled
- Component behaviour — focus trapping, carousel advance, menu positioning, …

The 200 screenshots are not committed; regenerate with `node scripts/qa-sweep.mjs`.

### Accessibility (axe) triage — 12 Sep 2026

`playwright.config.js` + `test/accessibility/demo-pages.spec.js` (WCAG 2.1 A/AA
tags via `@axe-core/playwright`) over all 51 demo pages × {light, dark} — 102
checks. `npm run test:a11y` to reproduce.

**Two systemic bugs fixed on the spot** (shared infrastructure, not component
code, so low-risk to fix immediately rather than triage):

- Bare `<select>`/`<input>` controls in demo interactive panels inherited
  `body`'s `color` (the on-surface token) but kept the browser's native —
  usually white — widget background, so dark theme rendered near-white text on
  a white control (~1.3:1 contrast). Fixed with an explicit
  background/color/border rule in `pattern-library.css`. Cleared every
  finding on `animation-presets`, `focus-ring`, `icon`, `responsive-image`,
  `tooltip`.
- `.code-block` snippets that overflow horizontally had no way into the tab
  order. Fixed in `docs-nav.js` (shared by every page) by tab-stopping
  `.code-block` and its `<pre>` on load. Cleared findings on `app-bar-top`,
  and partially on `navigation-bar`, `navigation-rail`, `textarea`.

**38 of 102 checks still fail** (19 components × 2 themes) — logged
individually under [Open defects](#open-defects) above. One likely shared
root cause worth checking first: `radio`, `switch`, `text-field`, `textarea`
all fail on a control having no accessible name despite a visible label —
suggests the label-to-control wiring (`<label for>` / `aria-labelledby`) has
the same gap across several form-associated components, not four unrelated
bugs. `checkbox`, `chip`, and `form` share a separate `nested-interactive`
pattern that's also likely one fix applied in multiple places.

---

## Known gaps in tooling

Not component defects, but things that limit what QA can catch. Delete each when
resolved.

- **No visual regression.** Nothing catches a CSS change that breaks an unrelated component. Scheduled for Q3.
- **No responsive testing.** No automated check at any viewport. Covered manually by the QA workstream.
- **The axe harness doesn't test high-contrast.** `test/accessibility/demo-pages.spec.js` only runs `{light, dark}` — added before the theme existed and never extended. Real consequence, not theoretical: the `ds-dialog` hardcoded-white-surface bug (see the `dialog` entry above) made dialog text completely illegible in high-contrast, and the harness would have caught it immediately if it covered that theme. Extending the `for (const theme of [...])` loop to include `"high-contrast"` is a small change (153 more checks); do it alongside the next `test:a11y` pass rather than as its own task.

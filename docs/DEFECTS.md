# Defects

Open UI/UX defects found during component QA. See the
[component QA workstream](./ROADMAP.md#workstream-component-qa) for the checklist
this is populated from.

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

### carousel

- **A** — axe `aria-required-children` (critical): the `role="list"` viewport's children aren't `role="listitem"` (9 nodes, both themes).
- **A** — axe `scrollable-region-focusable`: the scrolling viewport isn't in the tab order (8 nodes).

### checkbox

- **A** — axe `nested-interactive`: `ds-checkbox`'s rendered markup nests one interactive control inside another — invalid ARIA that can break screen-reader operation (13 nodes, both themes). Same pattern as `chip`, `form`, `theme-playground` — likely one shared fix in the component's internal markup.

### chip

- **A** — axe `nested-interactive`: same pattern as `checkbox` (8 nodes, both themes).

### design-tokens

- **B** — axe `color-contrast`: `.token-name` text on at least one `.surface-chip` swatch fails contrast (both themes).

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

**Still to do — the full manual pass.** The screenshot review only catches
structural and token issues. A human eye is still needed on interactive
states (hover / focus-visible / pressed), spacing rhythm, MD3 type scale,
and the components the sweep never opens (menu, dialog, tooltip, snackbar).

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

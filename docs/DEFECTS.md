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
- Real accessibility (ARIA roles/names/live regions) — waits on the axe harness (Q4)

The 200 screenshots are not committed; regenerate with `node scripts/qa-sweep.mjs`.

---

## Known gaps in tooling

Not component defects, but things that limit what QA can catch. Delete each when
resolved.

- **No accessibility harness.** `npm run test:a11y` finds zero tests — `test/accessibility/` is empty and there is no `playwright.config.js`, despite `@axe-core/playwright` being installed and the README claiming WCAG 2.1 AA. Scheduled for Q4.
- **No visual regression.** Nothing catches a CSS change that breaks an unrelated component. Scheduled for Q3.
- **No responsive testing.** No automated check at any viewport. Covered manually by the QA workstream.

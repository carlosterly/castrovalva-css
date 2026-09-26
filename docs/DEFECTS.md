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

### package build

- **B** — Only `button` and `icon` have dedicated `vite.config.js` build entries (and matching `package.json` exports) out of 43 components. The README's "Tree-shakeable — import only the components you use" claim is only true for those two; every other component is only reachable via the full `import "castrovalva"` (`dist/index.js`, ~609 KB raw / ~99 KB gzipped for all 43 components + icons). Not a functional bug — nobody consumes this via npm (`private: true`) — but the claim overstates what's actually wired up.

### menu

- **B** — The flip-above / align-right collision logic in `positionMenu()` never has real dimensions to work with. `open()` calls `positionMenu()` *before* setting `display: block`, so `container.getBoundingClientRect()` measures a `display: none` element (0×0): "not enough space below" and "not enough space right" are never true, and a menu opened near the bottom or right edge of the viewport overflows instead of flipping. The final viewport clamp uses the same zero size, so it doesn't catch it either. Not visible on the demo page, whose triggers sit mid-page. Found while fixing the fixed-position containing-block offset (26 Sep 2026). Fix: show the container (it's still `opacity: 0`) before measuring.

### full-screen overlays (bottom-sheet, side-sheet, navigation-drawer)

- **B** — Their scrims leave a 15px undimmed strip down each side of the viewport on browsers with classic scrollbars (Windows desktop). Each is a `position: fixed; inset: 0` container, and `html { scrollbar-gutter: stable both-edges }` (`src/styles/base.css`) insets the fixed containing block by the gutter on *both* edges — the same root cause as the since-fixed tooltip/menu offset. `ds-dialog` isn't affected: its `::backdrop` lives in the top layer, which ignores the gutter. `placeFixed()` doesn't apply (these are sized, not placed). Likely fix is revisiting `both-edges` itself (`stable` alone reserves only the right gutter), which trades this for a ~7px content shift when a dialog locks scrolling — a page-wide call, so not made as part of the scrim fixes. Found 26 Sep 2026.

### navigation-bar

- **B** — `ds-navigation-bar-item` renders `role="tab"` but `ds-navigation-bar` doesn't implement the roving-tabindex/arrow-key navigation the ARIA tab pattern expects — every item stays independently `Tab`-reachable instead of only the active one, and Left/Right don't move selection. Same gap in `navigation-rail` (see below). Not axe-detectable (axe checks structure, not interaction), found while fixing the `aria-required-parent` finding on the same component. Functions fine via `Tab` alone; the gap is a mismatch between the announced role's expected behavior and the actual one.

### navigation-rail

- **B** — Same roving-tabindex/arrow-key gap as `navigation-bar` (see above): `ds-navigation-rail-item` renders `role="tab"` with no arrow-key (here, up/down) navigation between destinations.

### search

- **B** — `DSSearch > Keyboard > navigates down with ArrowDown` / `navigates up with ArrowUp` fail intermittently on WebKit only — 1–2 failures on most isolated runs (`npx wtr --config web-test-runner.full.config.js --files test/search.test.js`), sometimes passing in a full `npm run test:all`. Reproduces on the committed code, so it predates the 26 Sep fixes. Both tests wait a fixed `setTimeout(10)` after dispatching the keydown instead of awaiting the update — the arbitrary-timeout pattern CLAUDE.md's testing practices rule out — which is the likely source of the timing sensitivity. Not yet confirmed whether it's only the test or a real WebKit keyboard bug.

### slider

- **B** — 12 unit tests fail on Firefox only (`npm run test:all`), all pointer-drag interaction/event tests (`should emit input/change event on pointer interaction`, `should update value when dragged`, `should snap values to step`, …). Chromium and WebKit pass all of them. Not yet root-caused — could be a real Firefox pointer-event handling difference in the component, or a Playwright synthetic-pointer-event quirk specific to Firefox's test harness rather than a user-facing bug. Needs someone to actually drag a slider in real Firefox before concluding either way.

### text-field

- **A** — `ds-text-field` calls `this.attachInternals()` but never sets `static formAssociated = true` or calls `setFormValue()`. Verified empirically: `new FormData(form)` on a form containing a named, valued `ds-text-field` silently omits it — the field's value never reaches form submission. `checkValidity()`/`reportValidity()` are implemented by delegating to the internal native `<input>`, so those work standalone, but the field is invisible to the *enclosing* form. Grepped every input/selection component for `formAssociated`: **only `ds-checkbox` fully implements it** (declares the flag and calls `setFormValue`). `ds-radio`, `ds-switch`, `ds-slider`, `ds-select`, `ds-combobox`, `ds-textarea`, `ds-data-table` use neither `formAssociated` nor `attachInternals` at all, despite CLAUDE.md documenting this as the convention for the whole "Input & selection" category. This is bigger than one component — it's the documented pattern applied in one place out of roughly a dozen it's supposed to cover.

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

**Programmatic type-scale/spacing check — 13 Sep 2026, all findings fixed.**
Cross-referenced every Tier-1 component's Shadow DOM CSS against the MD3
spec's sizing and typescale values (not a screenshot read — actual
token/pixel values verified against `tokens.css`). Four real, verified
findings, all now fixed (see git history):

- An invalid typescale-token-name pattern — `-font-size`/`-font-weight`/
  `-font-family-name` suffixes that don't exist in `tokens.css` (only
  `-size`/`-weight`/`-font` do), silently discarding the intended type scale
  with no fallback to catch it — spanning `card`, `chip`, `dialog`,
  `snackbar`, `tooltip`, `textarea`, and (found in the same sweep once the
  pattern was known) the `ds-switch.css` helper label. `snackbar` also had
  `-letter-spacing` where the token suffix is `-tracking`. Masked in `card`
  only because the title sits in an `<h3>`, whose native bold/large UA
  styling happened to look plausible — why the screenshot contact-sheet
  review didn't catch it and it took a CSS-level check to surface.
- `card`'s corner radius resolved to a dead `var(--ds-radius-md, 12px)`
  fallback (8px, not MD3's 12dp) since `--ds-radius-md` is already defined;
  fixed by hardcoding 12px directly, since the project's radius scale has no
  token at that value (it jumps sm 4px → md 8px → lg 16px).
- `radio`'s outer circle resolved to a dead `var(--ds-size-icon-md, 20px)`
  fallback (18px, not MD3's 20dp) for the same reason; fixed by hardcoding
  the 20px default instead of reusing checkbox's icon-size token.
- `badge`'s dot variant sized off `--ds-size-icon-sm` (14px) instead of
  MD3's 6dp dot, over 2x oversized; fixed with a dedicated 6px value.

Switch (track/thumb sizing), FAB, checkbox, and icon were checked and are
fully spec-compliant. A handful of lower-confidence items (menu/tabs/list
type-scale role choices, minor padding deltas) surfaced too but weren't
independently verified, so they were left unfixed and unlogged — worth a
follow-up pass if pursued.

**Hover/pressed state-layer pass — 14 Sep 2026, done.** The one item the
screenshot review, overlay pass, and programmatic check couldn't catch:
whether hover/pressed feedback actually *renders*, live, in both themes.
Captured rest/hover/focus/pressed screenshots for the 12 Tier-1 components
with a primary interactive element (button, text-field, checkbox, radio,
switch, card, tabs, chip, slider, data-table, fab, list — dialog, menu,
tooltip, snackbar were already covered by the overlay pass; badge and icon
are non-interactive) at 1280px in both themes, then pixel-diffed rest
against each state rather than eyeballing — a translucent 8% overlay is
easy to miss by eye but shows up immediately in a diff. Five real, verified
findings, all since fixed (26 Sep 2026): `chip`/`radio`/`switch` share one root cause
(an undefined `--md-sys-color-on-surface-rgb` token whose hardcoded
light-theme fallback never adapts to dark theme — probably present in
`snackbar` too, from the same pattern with a different token); `card`'s
elevated-hover shadow bump has no dark-theme compensation the way its rest
state does; `data-table`'s row-hover tint is technically theme-aware but
too tonally close to the surface to read in dark theme; `tabs` has no
hover feedback in *either* theme because an `!important` base rule
permanently shadows the non-`!important` hover rule. Checkbox, radio,
switch, and tabs were all previously reviewed and marked clean by the
screenshot-only first pass — this is exactly the gap that pass couldn't
see. Spacing rhythm *as felt* was reviewed over the same full-page
1280/360 × light/dark screenshots for all 18 Tier-1 components; nothing
beyond what the programmatic type-scale/spacing check already caught
stood out.

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

### Beyond the sweep — human and interaction passes

The sweep only covers mechanical checks. What it can't judge has since been
covered by the passes below (Sep 2026); their open findings are in
[Open defects](#open-defects) above.

- MD3 visual fidelity — elevation, corner radius, state-layer opacity, type
  scale: the first-pass screenshot review, the programmatic type-scale/sizing
  check against the MD3 spec, and the Tier-1/Tier-2 manual pass.
- Interactive states — hover, focus-visible, pressed: pixel-diffed across all
  demo pages in the Tier-1/Tier-2 manual pass.
- Component behaviour — `scripts/qa-overlays.mjs` opens menu, dialog, tooltip
  and snackbar.

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

**Missing-accessible-name cluster fixed — 14 Sep 2026.** `radio`, `switch`,
`text-field`, and `textarea` all failed on a control having no accessible
name despite a visible label. Two different root causes, not one:
`text-field` and `textarea` already had an internal (but unlinked)
`<label>` next to their native `<input>`/`<textarea>` — fixed by adding
`aria-label="${label}"` directly on the input/textarea in each render
template. `radio` and `switch` had no label story at all — every demo used
an external, unassociated `<label>` sibling with no `for`/`id` link (or,
for `radio`, no link of any kind). Fixed by giving both a `label` attribute
that mirrors `ds-checkbox`'s existing, tested pattern exactly: render the
text inside the component's own shadow DOM next to the control, and set
`aria-label` from the same value — self-contained, no external markup to
get out of sync. `radio.html` and `switch.html`'s demo markup (36
instances total) converted from external `<label>` siblings to the new
`label` attribute; `theme-playground`'s live preview instances got real
labels too (previously `<ds-radio>Standard</ds-radio>`-style text content,
silently dropped since `ds-radio` has no default slot to catch it).
Verified: all four components' full test suites still pass (157 tests,
plus 12 new tests added for the `label` attribute itself), `npm run lint`
clean, and `npm run test:a11y` confirms the fix — 72/102 checks now pass
(was 64/102), the exact 8-check gain expected from 4 components × 2
themes. **30 of 102 checks still fail** (down from 38) — logged
individually under [Open defects](#open-defects) above. `checkbox`, `chip`,
and `form` share a `nested-interactive` pattern that's likely one fix
applied in multiple places, worth checking next.

**`nested-interactive` cluster fixed — 22 Sep 2026.** `checkbox`, `chip`,
and `form` (which embeds a checkbox) all failed because a host carrying an
interactive ARIA role (`role="checkbox"`/`role="button"`) contained a
native, natively-focusable element in its shadow DOM. axe's `_isFocusable`
check treats any native `<input>`/`<button>`/etc. as focusable regardless
of `tabindex="-1"` or `aria-hidden`, and separately treats *any* element
carrying an explicit `tabindex` attribute — even `"-1"` — as focusable too,
so neither attribute actually suppressed the finding. `ds-checkbox`'s
hidden native `<input type="checkbox">` existed only to mirror `value`/
`name` for inspection — the real form value already comes from
`ElementInternals.setFormValue()` — so it was changed to
`<input type="hidden">` (not natively focusable, no `tabindex` needed).
`ds-chip`'s remove affordance was a `<button>` that never needed to be
independently focusable — removal already happens via delegated click
handling on the host (`composedPath()`) and via Delete/Backspace on the
host itself — so it became a plain `<span aria-hidden="true">` with no
`tabindex`. `theme-playground` inherited the `checkbox` finding via its
live preview and is fixed by the same change, with no separate edit.
Verified: `checkbox.test.js`/`chip.test.js`/`form.test.js` (138 tests) and
`npm run lint` still pass, and `npm run test:a11y` confirms all `checkbox`,
`chip`, and `form` checks now pass in both themes (`theme-playground` still
has its unrelated `aria-progressbar-name`/`color-contrast` findings, logged
under its own entry).

**`scrollable-region-focusable` cluster fixed — 22 Sep 2026.** `carousel`,
`scrollbar`, `split-button`, and `text-wrapper` all failed because a
horizontally/vertically overflowing container had no way into the tab
order — axe requires the actual overflowing node itself (or a focusable
descendant) to be reachable, not just its ancestor. Two different root
causes, one shared: `split-button` and `text-wrapper`'s findings were
generic `.demo-box` examples overflowing (`overflow-x: auto` in
`pattern-library.css`), the same pattern already fixed for `.code-block` —
extended the existing `docs-nav.js` tab-stop fix to also cover `.demo-box`
(one shared script, every demo page). `carousel` and `scrollbar` are
component bugs, not demo-page ones: `ds-carousel`'s `[part="viewport"]` is
the actual scrolling box (the host's `:host(:focus-visible)` outline
already existed in the CSS but nothing ever made anything focusable) — gave
the viewport `tabindex="0"` directly, which also makes it reachable for the
existing ArrowLeft/ArrowRight `keydown` handler already bound on the host
(the event still bubbles up to it). `ds-scrollbar`'s `.scrollbar-container`
div is the element that actually overflows, not the host itself (the host
just matches its size) — gave the container `tabindex="0"`, not the host,
after an initial attempt at the host confirmed axe still flagged the
container specifically. Verified: `carousel.test.js`/`scrollbar.test.js`
(2 new tests) and full suite (2093 tests) plus `npm run lint` still pass,
and `npm run test:a11y` confirms all four components' checks now pass in
both themes — `carousel` still has its separate, pre-existing
`aria-required-children` finding (its viewport's children aren't
`role="listitem"`), logged under its own entry.

**`aria-required-parent` cluster fixed — 22 Sep 2026.** `navigation-bar`
and `navigation-rail` both failed because each destination item's internal
button carries `role="tab"` (correct for a single-selection destination
switcher), but neither component's markup ever provided the `role="tablist"`
ancestor that ARIA requires for a `tab` to be valid. `ds-navigation-bar`
wrapped its item slot in a new `<div role="tablist">` inside the existing
`<nav role="navigation">` landmark (moved the flex layout from the `nav`
onto the new wrapper so visuals are unchanged); `ds-navigation-rail`
already had a `.destinations` wrapper around just the item slot (separate
from its `header`/`fab` slots) so `role="tablist"` and
`aria-orientation="vertical"` went directly on that existing element — no
new wrapper needed. Neither component implements roving-tabindex/arrow-key
navigation between tabs (every item stays independently `Tab`-reachable);
that's a real gap in the APG tab pattern but a separate, larger piece of
work from this specific `aria-required-parent` fix, not addressed here.
Verified: `navigation-bar.test.js`/`navigation-rail.test.js` (2 new tests)
and full suite (2095 tests) plus `npm run lint` still pass, and
`npm run test:a11y` confirms both components' checks now pass in both
themes.

**Remaining one-offs (cluster 5 of 5) fixed — 22 Sep 2026, clearing the
axe backlog to 0/102.** Seven unrelated findings, no shared root cause:

- **`progress-indicator`** (`aria-progressbar-name`): `ds-linear-progress`/
  `ds-circular-progress` had no accessible name at all. Added a `label`
  attribute reflected as `aria-label`, with a fallback (`"Loading"` when
  indeterminate, `"N% complete"` otherwise) so the progressbar is never
  nameless even if a consumer forgets to set it — real per-instance labels
  were also added to the demo page. Fixes `theme-playground`'s inherited
  copy of the same finding too.
- **`carousel`** (`aria-required-children`): the `role="list"` viewport's
  children are arbitrary consumer-provided elements with no list semantics.
  Added `_updateItemRoles()`, called on connect and on every `slotchange`,
  which sets `role="listitem"` on each assigned item unless it already
  carries its own role.
- **`navigation-drawer`** (`aria-hidden-focus`): closed drawers were marked
  `aria-hidden="true"` while still containing focusable content translated
  off-screen — a hidden-but-tabbable trap, since `aria-hidden` alone doesn't
  stop `Tab` from reaching what's underneath. Replaced with the native
  `inert` attribute, which both hides from the accessibility tree and
  actually blocks focus; un-inert happens before focusing into the drawer
  on open, and previous focus is restored before going inert on close so
  focus never gets stranded in an inert subtree.
- **`virtual-scroll`**, two findings: the `role="listbox"` container had no
  accessible name (`aria-input-field-name`) — same `label`-attribute/
  fallback pattern as `progress-indicator` (defaults to `"Items"`). Its
  rows also lacked `role="option"` (`aria-required-children`) — since rows
  are plain `<div>`s fully owned by the component (not a consumer
  template), the role is set directly in `_renderItems()`. The demo page's
  separate jump-to-index `<input>` also had no name (`placeholder` doesn't
  count) — given `aria-label="Jump to index"`.
- **`slider`** (`color-contrast`, `.label`/`.value-display`): two distinct
  causes. The `.header`'s text color was a hardcoded `#374151` that never
  adapted for dark theme (contrast 1.66:1) — replaced with
  `--md-sys-color-on-surface-variant`. Separately, `.slider-container.disabled`
  applied `opacity: 0.5` to the *entire* container, including `.header` —
  CSS opacity composites across all descendants regardless of their own
  opacity, so even after the token fix, a disabled slider's already-correct
  text still failed (1.26:1, worse than the enabled case). Since WCAG 1.4.3
  exempts inactive-control text from contrast requirements but axe can't
  infer that for a custom element's `disabled` state, and the value is
  genuinely useful to keep legible for a low-vision user reading a disabled
  slider's stuck value, scoped the dimming to `.track-wrapper`/`.thumb`
  only — `.header` now stays at full contrast when disabled.
- **`design-tokens`** (`color-contrast`, `.surface-chip .token-name`): each
  swatch sets its own correctly-paired `color` (`on-surface` /
  `on-inverse-surface`, matched to its `background`), but `.token-name`'s
  own rule unconditionally overrode it with `on-surface-variant` —  wrong
  pairing for the `inverse-surface` swatch specifically. Fixed with
  `.surface-chip .token-name { color: inherit; }`.
- **`theme-playground`** (`color-contrast`, palette swatch labels): the
  `readable(hex)` helper picked black-or-white text by a fixed luminance
  threshold (`> 0.4`), which doesn't track actual WCAG contrast and left
  several mid-tone swatches (e.g. primary/secondary/neutral 50–60) under
  4.5:1 with white text. Replaced with an actual contrast-ratio comparison
  that picks whichever of black/white contrasts more against the
  background — provably always ≥4.5:1 for any solid color, since the
  worst case (a mid-gray background) still yields ~4.58:1 either way.

Verified per-component and via a full `npm run test:a11y` run: **102/102
checks pass**, up from 88/102 — the exact expected 14-check gain (7
components × 2 themes). Full unit suite (2107 tests) and `npm run lint`
both still pass.

**Docs-site accessibility audit — 22 Sep 2026.** The axe harness only ever
scanned `docs/components/*.html` — the surrounding site chrome (home page,
composed examples) had zero automated coverage, even though every demo
page already incidentally sweeps the shared nav shell (`docs-nav.js`) just
by including it. Extended `test/accessibility/demo-pages.spec.js` with an
`EXTRA_PAGES` list covering `index.html` and
`docs/examples/settings-page.html`, × {light, dark}. Found one real issue:
the home page's "Running right now" live preview embeds a real
`<ds-switch>` with no `label` attribute (`aria-toggle-field-name`, 1 node,
both themes — the same underlying gap the `radio`/`switch` cluster-1 fix
closed everywhere else, just never applied here since this instance isn't
part of either component's own demo page). Fixed by giving it a real label
("Notifications") instead of leaving it to axe's absence-of-name failure.
`settings-page.html` was already clean. `npm run test:a11y`: **106/106**
checks pass (102 + 4 new). Full suite (2107 tests) and lint still pass.

---

## Known gaps in tooling

Not component defects, but things that limit what QA can catch. Delete each when
resolved.

- **No visual regression.** Nothing catches a CSS change that breaks an unrelated component. Next on the roadmap (Q3 item).
- **Responsive testing isn't in CI.** `scripts/qa-sweep.mjs` checks horizontal overflow at 360px and 1280px, but it is run by hand, not by CI, and it can't see `position: fixed` content (that is how the since-fixed `snackbar` 360px overflow slipped past it).
- **The axe harness doesn't test high-contrast.** `test/accessibility/demo-pages.spec.js` only runs `{light, dark}` — added before the theme existed and never extended. Real consequence, not theoretical: the since-fixed `ds-dialog` hardcoded-white-surface bug (written up under the composed example in [ROADMAP.md](./ROADMAP.md)) made dialog text completely illegible in high-contrast, and the harness would have caught it immediately if it covered that theme. Extending the `for (const theme of [...])` loop to include `"high-contrast"` is a small change (53 more checks — 51 demo pages plus the 2 extra pages); do it alongside the next `test:a11y` pass rather than as its own task.
- **`check:docs` doesn't verify attributes.** `scripts/check-api-docs.mjs` checks every documented CSS custom property, custom event and CSS part against `src/`, but not attribute tables — components read attributes through `dataset.camelCase`, getters and class names, which a text search can't resolve without false positives. A documented attribute that doesn't exist would still slip through.

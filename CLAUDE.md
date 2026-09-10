# CLAUDE.md — Castrovalva Design System

Conventions for building and documenting components in this repo. This is the
single source of truth for how things are done here.

- **What exists and where it's going:** [docs/ROADMAP.md](docs/ROADMAP.md)
- **Token reference:** [docs/tokens.md](docs/tokens.md), [docs/motion.md](docs/motion.md), [docs/state-layers.md](docs/state-layers.md)
- **Live component docs:** `docs/components/{name}.html`

## What this project is

Vanilla Web Components implementing Material Design 3. Zero runtime
dependencies, Shadow DOM, MD3 design tokens. Built with Vite, tested with
`@web/test-runner` + Playwright.

43 components (36/36 official MD3 plus enhancements and utilities), ~2,060
tests, ~92% coverage. The library is feature-complete; see the roadmap before
proposing new components.

---

## Component deliverables

Three required artefacts per component:

1. **Component JS** — `src/components/{name}/{name}.js`
2. **Unit tests** — `test/{name}.test.js` (40+ cases)
3. **Demo page** — `docs/components/{name}.html`

Plus a **stub README** at `src/components/{name}/README.md`: one line of
description and a link to the demo page. Full API documentation lives on the
demo page only — never maintain it in two places.

### Also update when adding or changing a component

- Register the import **and** export in `src/index.js`
- Add a component card to `index.html`
- Run `npm test test/{name}.test.js`

---

## Demo page rules

### The mistakes that actually happen

1. **Missing `<script src="../shared/theme-init.js"></script>`** before `</body>`
   → symptom: black background, theme never loads
2. **Duplicate theme-init scripts** — include it exactly once
   → symptom: `Identifier 'themeBtns' has already been declared`
3. **HTML entities inside `<script>`** — write `&&`, `<`, `>`, never `&amp;&amp;`
   → symptom: `Unexpected token ';'`
4. **HTML entities in tags** — `<h1>Title</h1>`, never `<h1&gt;Title</h1>`
   → symptom: `Unable to parse HTML`
5. **Redundant imports** — no `import` statements in inline demo scripts; the
   module is already loaded in `<head>`
6. **Wrong `data-page`** — use the component name, never `"playground"`
7. **Lowercase doctype** — `<!DOCTYPE html>`, not `<!doctype html>`
8. **Self-closing void elements** — `<meta>`, not `<meta />`

### Paths from `docs/components/`

| Target | Path |
| --- | --- |
| Component CSS | `../../src/styles.css` |
| Pattern library CSS | `../shared/pattern-library.css` |
| Theme script | `../shared/theme-init.js` |
| Component import | `../../src/index.js` |

### Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{Component Name} - Material Design 3 Component Library</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      rel="stylesheet" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
      rel="stylesheet" />
    <link rel="stylesheet" href="../../src/styles.css" />
    <link rel="stylesheet" href="../shared/pattern-library.css" />
    <script type="module" src="../../src/index.js"></script>
  </head>
  <body data-page="{component-name}">
    <div class="page-container">
      <div class="content-area">
        <h1>{Component Name}</h1>
        <p class="description">Component description here.</p>

        <div class="section">
          <h2>Basic Usage</h2>
          <div class="demo-box">
            <!-- Component demo -->
          </div>
        </div>
      </div>
    </div>

    <!-- Page-specific JS. No import statements. -->
    <script type="module">
      const button = document.querySelector("ds-button");
      button.addEventListener("click", () => {
        console.log("clicked");
      });
    </script>

    <!-- Theme init: at the end, exactly once -->
    <script src="../shared/theme-init.js"></script>
  </body>
</html>
```

### Required sections, in order

1. **Title + description** — what it is, when to reach for it
2. **Basic usage** — the minimal working example
3. **Variants** — the visual/behavioural options
4. **States** — disabled, required, error, loading
5. **API** — tables for attributes, events, slots, CSS parts, CSS custom properties
6. **Accessibility** — keyboard map and screen-reader behaviour
7. **Usage guidelines** — when to use, when not to

Optional where they earn their place: Anatomy, Behaviour model, Related
components, Known limitations.

### CSS classes available

`page-container` (outer wrapper) · `content-area` (main content) · `section`
(major section) · `demo-box` (component example) · `code-block` (code snippet)
· `api-table` (API tables)

### Example quality bar

Every page needs at least: one minimal baseline example, one realistic
production-like example, and one interactive example with observable output.

Use meaningful labels and realistic data. Avoid placeholder prose — "Lorem
ipsum" and `<ds-button>Button</ds-button>` teach nothing.

### Emphasis by component category

| Category | Must emphasise |
| --- | --- |
| **Action** (button, fab, split-button) | Action hierarchy and emphasis; disabled/loading semantics and event behaviour |
| **Input & selection** (text-field, combobox, checkbox, radio, switch, slider) | Validation lifecycle; value model and event timing; keyboard detail |
| **Navigation** (tabs, nav bar/rail/drawer) | Selection model; orientation and responsive behaviour; focus order and roving tabindex |
| **Container & overlay** (card, dialog, sheets, menu) | Open/close behaviour; focus management and dismissal; scrim interaction |
| **Utility** (focus-ring, scrollbar, elevation, animation-presets, drag-drop) | Integration contract with host elements; side effects and init requirements; performance and a11y implications |

---

## Component implementation standards

### Web component pattern

- Shadow DOM, `mode: "open"`
- **Never read attributes in the constructor** — the spec does not guarantee
  they are present. Set defaults there; read attributes in `connectedCallback`.
- Declare `observedAttributes` for anything that must react to change, and
  handle it in `attributeChangedCallback`
- Never mutate classes on `this` — the host's class list belongs to the consumer

### Event naming

- Custom events: `ds-{component}:{action}` — e.g. `ds-button:click`,
  `ds-dialog:open`, `ds-date-picker:change`
- Always `bubbles: true` and `composed: true` so they escape the shadow boundary
- Put the useful payload in `detail`

### Form-associated components (inputs and selection)

- `static formAssociated = true`
- Update internals on state change: `this._internals?.setFormValue(...)`
- Emit `ds-{component}:change` with `{ value, checked, indeterminate }` as applicable

### Sizing

Global size tokens live in `src/tokens/tokens.css`:
`--ds-size-icon-sm|md|lg`, `--ds-size-control-sm|md|lg`, `--ds-size-hit-area`.

Component sizes default to the global tokens and diverge only where the MD3
spec requires it.

```html
<ds-component size="sm"></ds-component>
<ds-component size="md"></ds-component>
<ds-component size="lg"></ds-component>
```

```css
--ds-component-icon-size: var(--ds-size-icon-md);
--ds-component-control-size: var(--ds-size-control-md);
--ds-component-hit-area-size: var(--ds-size-hit-area);
```

### Focus ring

Use the global tokens — `--ds-focus-ring-color|width|offset|radius` — and
remove the default outline to avoid doubling up.

```css
:host(:focus-visible) {
  outline: none;
}

:host(:focus-visible) .focus-target::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 999px;
  box-shadow:
    0 0 0 var(--ds-focus-ring-offset, 2px) transparent,
    0 0 0
      calc(var(--ds-focus-ring-offset, 2px) + var(--ds-focus-ring-width, 2px))
      var(--ds-focus-ring-color, var(--md-sys-color-primary));
}
```

### MD3 compliance

Use MD3 design tokens (`--md-sys-color-*`, `--md-sys-shape-*`, …). Follow MD3
motion durations and easing. Implement the elevation system. Support light,
dark and dynamic colour schemes. Match the component specifications.

Colour tokens are split: `src/tokens/palette.css` holds the six reference
tonal palettes (`--md-ref-palette-*`) — the only file a theme changes —
and `src/tokens/tokens.css` maps `--md-sys-color-*` roles onto them.
Components read the `--md-sys-color-*` roles, never `--md-ref-palette-*`
directly. `styles.css` imports `palette.css` before `tokens.css`.

### Accessibility

Semantic HTML. Correct ARIA roles and labels. Full keyboard navigation (Tab,
Enter, Space, Escape, arrows). Managed focus with a visible indicator. Screen
reader announcements. WCAG 2.1 AA contrast minimum. Disabled state genuinely
prevents interaction.

---

## Testing standards

### Running tests

```bash
npm test test/button.test.js   # one component, Chromium only - the dev loop
npm test                       # all tests, Chromium only
npm run test:all               # all tests, Chromium + Firefox + WebKit
npm run test:a11y              # axe accessibility pass
npm run lint                   # ESLint - must exit 0
```

`web-test-runner.config.js` is the default (Chromium, honours CLI file
arguments). `web-test-runner.full.config.js` runs all three browsers for
pre-release regression.

### Structure

```javascript
import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import { DSComponentName } from "../src/components/{name}/{name}.js";

describe("DSComponentName", () => {
  describe("Initialization", () => {
    it("should render with default properties", async () => {
      const el = await fixture(html`<ds-component-name></ds-component-name>`);
      expect(el).to.exist;
    });
  });

  // Then: Attributes & Properties, Methods, Events, Slots, Interactions,
  // Keyboard, Focus, State, ARIA, Disabled, Validation, Edge cases
});
```

### What to test

✅ Behaviour and user interactions · attribute binding and property changes ·
event emission and `detail` accuracy · ARIA attributes · keyboard navigation ·
focus management · state persistence · edge and error cases · integration with
other components

❌ Browser APIs · third-party libraries · trivial getters and one-liners ·
CSS and styling (use visual regression) · 100% coverage for its own sake

### Coverage

Minimums: 85% statement, 80% branch, 85% function, 85% line.

| Component type | Statement | Branch | Function |
| --- | --- | --- | --- |
| Action (button, fab) | 90% | 85% | 90% |
| Selection (checkbox, radio) | 88% | 82% | 88% |
| Input (text-field, select) | 85% | 78% | 85% |
| Display (card, chip) | 82% | 75% | 82% |
| Navigation (tabs, drawer) | 88% | 85% | 88% |
| Container (dialog, sheet) | 85% | 80% | 85% |

### Keyboard behaviour to verify

| Key | Expected |
| --- | --- |
| `Enter` / `Space` | Trigger the action |
| `Tab` / `Shift+Tab` | Move to next/previous focusable element |
| `Escape` | Close menu or modal, where applicable |
| `↑ ↓ ← →` | Navigate within lists and grids |
| `Home` / `End` | First / last item |

### Practices

Name tests by behaviour, not implementation. Isolate — no shared mutable state
between tests. Use `beforeEach` for repeated setup and `fixture` for complex
HTML. Await updates rather than using arbitrary timeouts. Comment *why* a test
exists when it is guarding a specific bug, not *what* it does.

---

## Writing style for docs

Second person, present tense, active voice. Describe what the component does,
not what it "will" do. Attribute descriptions state the effect and the default.
Avoid marketing language — no "powerful", "seamless", "beautiful".

---

## HTML corruption recovery

If HTML entities leak into tags or scripts across the demo pages:

```powershell
cd "c:\Work\Sites\castrovalva-css\docs\components"
(Get-ChildItem *.html).ForEach({(Get-Content $_.FullName) -replace '&gt;', '>' | Set-Content $_.FullName})
(Get-ChildItem *.html).ForEach({(Get-Content $_.FullName) -replace '&amp;&amp;', '&&' | Set-Content $_.FullName})
```

---

## Reference implementations

When the pattern is unclear, copy the structure from:

- [docs/components/split-button.html](docs/components/split-button.html)
- [docs/components/date-picker.html](docs/components/date-picker.html)
- [docs/components/time-picker.html](docs/components/time-picker.html)

## Before calling a component done

- [ ] Component JS complete, with JSDoc
- [ ] 40+ test cases, `npm test test/{name}.test.js` passes
- [ ] Demo page with theme-init script and correct `data-page`
- [ ] Stub README linking to the demo page
- [ ] Registered in `src/index.js` (import **and** export)
- [ ] Card added to `index.html`
- [ ] `npm run lint` exits 0
- [ ] No console errors in the browser
- [ ] Responsive on mobile
- [ ] Works in light and dark themes
- [ ] Keyboard accessible

## File organisation

- Unit tests: `test/{component}.test.js` — never test HTML files in the repo root
- Demo pages: `docs/components/{component}.html`
- Component source: `src/components/{name}/{name}.js`

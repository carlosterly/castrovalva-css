# CLAUDE.md - Castrovalva Design System

## 🚨 CRITICAL: Read Documentation FIRST

**Before building ANY component, you MUST read these files in order:**

1. **[docs/DOCUMENTATION_STANDARD.md](docs/DOCUMENTATION_STANDARD.md)** - Complete documentation standard v1.1 (READ THIS FIRST)
   - HTML structure requirements (`page-container`, `content-area`, `demo-box`, `code-block`)
   - Required sections: Title, Variants, States, API, Accessibility
   - CSS attachment rules (use `../../src/styles.css` for dev builds)
   - Theme init script placement (before module scripts)
2. **[docs/md3-component-plan.md](docs/md3-component-plan.md)** - Implementation status and architecture
   - Current status: 40 components complete (36 MD3 official + 2 enhancements + 5 utilities + text wrapper)
   - Phase completion tracking
   - Component architecture patterns
   - Testing and quality standards

## Quick Reference Summary

### Component Status (January 2026)

- ✅ **36/36 Official MD3 Components** - 100% complete
- ✅ **All 9 Implementation Phases** - Complete
- ✨ **Enhancements:** Combobox, Banner, Responsive Image (92.21% coverage)
- 🔧 **Utilities:** Focus ring, Data table, Form, Elevation, Text wrapper, Animation Presets (31 presets)
- 📊 **Test Coverage:** 91%+ with 1,960+ unit tests across 19+ test suites
- 🎨 **Theme System:** All 52 demo pages with light/dark mode support

## Non-Negotiable Requirements

### Component Deliverables (All 4 Required)

1. ✅ **Component JS** - `src/components/{name}/{name}.js`
2. ✅ **Unit Tests** - `test/{name}.test.js` (40+ test cases minimum)
3. ✅ **HTML Docs** - `docs/components/{name}.html`
4. ✅ **README** - `src/components/{name}/README.md`

### Critical Items Often Forgotten

#### ❌ Most Common Mistakes:

1. **Missing `<script src="../shared/theme-init.js"></script>`** in HTML docs (MUST be before closing body tag)
   - Symptom: Black background / theme not loading
2. **Duplicate theme-init.js scripts** - Only include once
   - Symptom: "Identifier 'themeBtns' has already been declared" error
3. **HTML entities in JavaScript** - Use `&&` not `&amp;&amp;`, `<` not `&lt;`, `>` not `&gt;` inside `<script>` tags
   - Symptom: "Unexpected token ';'" or syntax errors
4. **Redundant imports** - Don't `import "../../src/index.js"` inside inline scripts (already loaded in head)
5. **HTML entities in tags** - `<h1>Title</h1>` NOT `<h1&gt;Title</h1>`
   - Symptom: "Unable to parse HTML" errors
6. **Wrong `data-page` attribute** - Use component name, NOT "playground"
7. **Lowercase DOCTYPE** - Use `<!DOCTYPE html>` NOT `<!doctype html>`
8. **Self-closing void elements** - Use `<meta>` NOT `<meta />`
9. **Wrong import paths** from `docs/components/`:
   - CSS: `../../src/styles.css`
   - Pattern CSS: `../shared/pattern-library.css`
   - Theme script: `../shared/theme-init.js`
   - Component import: `../../src/index.js`
10. **Forgetting to register** in `src/index.js` (both export AND import)
11. **Forgetting to add** component card to `sandbox-v2/index.html`
12. **Forgetting to update** `docs/md3-component-plan.md` completion status

#### ✅ HTML Documentation Template:

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
    <!-- CRITICAL: Use component name, NOT "playground" -->

    <div class="page-container">
      <div class="content-area">
        <h1>{Component Name}</h1>
        <p class="description">Component description here.</p>

        <!-- Demo sections -->
        <div class="section">
          <h2>Basic Usage</h2>
          <div class="demo-box">
            <!-- Component demo -->
          </div>
        </div>
      </div>
    </div>

    <!-- Page-specific JavaScript (NO import statements) -->
    <script type="module">
      // Interactive demo code - components already loaded
      const button = document.querySelector("ds-button");
      button.addEventListener("click", () => {
        console.log("clicked");
      });
    </script>

    <!-- CRITICAL: Theme init at end, only once -->
    <script src="../shared/theme-init.js"></script>
  </body>
</html>
```

**CRITICAL RULES:**

- ✅ `<!DOCTYPE html>` - uppercase
- ✅ No self-closing slashes on `<meta>`, `<link>`
- ✅ Module script in `<head>`
- ✅ Theme script before `</body>`, only ONCE
- ✅ NO `import` statements in inline scripts
- ✅ Use `&&` not `&amp;&amp;` in JavaScript
- ✅ Use `<h1>Title</h1>` not `<h1&gt;Title</h1>`

#### Required HTML Sections (in order)

1. **Header** - Component name and subtitle
2. **Basic Usage** - Simple default example
3. **Initial Value** - With pre-populated data
4. **Variants/Formats** - Different display options
5. **States** - Disabled, required, error states
6. **Interactive Example** - With event output logging
7. **API Reference** - Tables for attributes, events, CSS parts, methods
8. **Accessibility** - Keyboard support and screen reader info
9. **Usage Guidelines** - When to use, best practices

### CSS Class Standards

- Use `page-container` for outer wrapper
- Use `content-area` for main content
- Use `section` for major sections
- Use `demo-box` for component examples
- Use `code-block` for code snippets
- Use `api-table` for API documentation tables

### Sizing System Quick-Start

- Global size tokens live in `src/tokens/tokens.css`:
  - `--ds-size-icon-sm|md|lg`
  - `--ds-size-control-sm|md|lg`
  - `--ds-size-hit-area`
- Component size props should default to the global tokens and only diverge if the spec requires it.

**Size attribute convention (when supported):**

```html
<ds-component size="sm"></ds-component>
<ds-component size="md"></ds-component>
<ds-component size="lg"></ds-component>
```

**Default mapping pattern:**

```css
--ds-component-icon-size: var(--ds-size-icon-md);
--ds-component-control-size: var(--ds-size-control-md);
--ds-component-hit-area-size: var(--ds-size-hit-area);
```

### Focus Ring Convention

- Use global focus ring tokens: `--ds-focus-ring-color|width|offset|radius`.
- Avoid double outlines by removing default `:focus-visible` outlines when using a custom ring.

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

### Form-Associated Pattern (Inputs + Selection)

- Use `static formAssociated = true`.
- Update internals on state changes: `this._internals?.setFormValue(...)`.
- Emit `ds-{component}:change` with `{ value, checked, indeterminate }` as applicable.

### Test Coverage Quick Checklist

- **Attributes/Properties:** defaults, coercion, invalid values, reflection
- **Events:** custom + native, detail accuracy, bubbling
- **Keyboard:** Space/Enter/Arrow behavior as applicable
- **Focus:** focusable + focus-visible behavior
- **State:** disabled, error, required, indeterminate/selected
- **Integration:** form value + change propagation

### Docs Snippets (copy/paste)

**Sizes section:**

```html
<h3>Sizes</h3>
<p>Use size to align with layout density.</p>
<div class="demo-box">
  <ds-component size="sm"></ds-component>
  <ds-component size="md"></ds-component>
  <ds-component size="lg"></ds-component>
</div>
```

**Accessibility bullets:**

```html
<ul>
  <li>Keyboard accessible with Space key.</li>
  <li>Exposes proper ARIA roles and state attributes.</li>
  <li>Visible focus indicator for keyboard users.</li>
</ul>
```

### Common Updates When Adding/Changing Components

- Register import/export in `src/index.js`
- Add component card in `index.html`
- Update `docs/md3-component-plan.md`
- Add tests + docs + README
- Run `npm test test/{component}.test.js`

### Testing Standards

#### Test Structure

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

  // More test suites: Value Management, Events, States, Accessibility, etc.
});
```

#### Test Workflow

**Fast Component-Focused Testing (Development):**

```bash
npm test test/combobox.test.js      # Single component, Chromium only
npm test test/button.test.js        # Single component, Chromium only
npm test                            # All tests, Chromium only
```

**Full Multi-Browser Regression (CI/Pre-Release):**

```bash
npm run test:all                    # All tests, all browsers (Chromium, Firefox, Webkit)
```

**Configuration:**

- Default config: `web-test-runner.config.js` - Single browser (Chromium), honors CLI file arguments
- Full config: `web-test-runner.full.config.js` - All 3 browsers for comprehensive cross-browser validation
- CLI file arguments are automatically honored for isolated component testing

### HTML Validation & Common Corruption Issues

#### JavaScript in HTML - NEVER Use HTML Entities

**WRONG:**

```html
<script type="module">
  if (element &amp;&amp; button) {  // ❌ Causes syntax error
    console.log('test');
  }
</script>
```

**CORRECT:**

```html
<script type="module">
  if (element && button) {
    // ✅ Use actual operators
    console.log("test");
  }
</script>
```

**Rule:** Inside `<script>` and `<style>` tags, use actual characters (`&&`, `<`, `>`). HTML entities are ONLY for HTML content areas.

#### HTML Tag Corruption

**WRONG:**

```html
<h1&gt;Title</h1>
<div&gt;Content</div>
<button&gt;Click</button&gt;
```

**CORRECT:**

```html
<h1>Title</h1>
<div>Content</div>
<button>Click</button>
```

**Fix Command (if corruption occurs):**

```powershell
cd "c:\Work\Sites\castrovalva-css\docs\components"
(Get-ChildItem *.html).ForEach({(Get-Content $_.FullName) -replace '&gt;', '>' | Set-Content $_.FullName})
(Get-ChildItem *.html).ForEach({(Get-Content $_.FullName) -replace '&amp;&amp;', '&&' | Set-Content $_.FullName})
```

### Theme System Requirements

All demo pages MUST have:

1. **Module script in head:**

   ```html
   <script type="module" src="../../src/index.js"></script>
   ```

2. **Theme script before closing body (only once):**

   ```html
   <script src="../shared/theme-init.js"></script>
   </body>
   ```

3. **Proper data-page attribute:**
   ```html
   <body data-page="button">
     <!-- Component name -->
   </body>
   ```

**Symptoms of missing theme-init.js:**

- Black/dark background on page load
- Theme doesn't switch between light/dark
- No theme persistence

### Material Design 3 Compliance

All components MUST:

- Use MD3 design tokens (`--md-sys-color-*`, `--md-sys-shape-*`, etc.)
- Follow MD3 motion (durations, easing functions)
- Implement MD3 elevation system
- Support MD3 color schemes (light/dark/dynamic)
- Match MD3 component specifications

### Accessibility Requirements

- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation (Tab, Enter, Space, Escape, Arrow keys)
- Focus management and visible focus indicators
- Screen reader announcements
- Color contrast compliance (WCAG AA minimum)
- Disabled state prevents interaction

### Event Naming Convention

- Custom events: `ds-{component-name}:{action}`
- Examples: `ds-button:click`, `ds-dialog:open`, `ds-date-picker:change`
- Always set `bubbles: true` and `composed: true`
- Include relevant data in `detail` object

### File Path Conventions

From `docs/components/` to:

- CSS: `../../dist/css/index.css` or `../../css/app.css`
- Pattern Library CSS: `../shared/pattern-library.css`
- Theme Script: `../shared/theme-init.js`
- Component Import: `../../src/index.js`

### Quality Checklist (Before Completion)

- [ ] Read DOCUMENTATION_STANDARD.md
- [ ] Component JavaScript complete with JSDoc
- [ ] Unit tests with 40+ cases
- [ ] HTML docs with theme-init.js script
- [ ] HTML docs with `data-page="{component-name}"` (NOT "playground")
- [ ] README.md with complete API docs
- [ ] Registered in src/index.js
- [ ] Added to index.html home page
- [ ] Component plan updated
- [ ] No console errors in browser
- [ ] Tests pass (`npm test`)
- [ ] Responsive on mobile
- [ ] Works in light and dark themes
- [ ] Keyboard accessible

## Reference Existing Components

**When in doubt, copy the structure from:**

- ✅ [docs/components/split-button.html](docs/components/split-button.html)
- ✅ [docs/components/date-picker.html](docs/components/date-picker.html)
- ✅ [docs/components/time-picker.html](docs/components/time-picker.html)

These follow the correct patterns.

### File Organization

**Test Files:**

- ✅ Unit tests: `test/{component}.test.js`
- ❌ NO test HTML files in root directory (e.g., `test-bottom-sheet.html`)
- ✅ Use proper `test/` directory structure
- ✅ Demo pages belong in `docs/components/`

**Demo Pages:**

- Location: `docs/components/{component}.html`
- All 52+ demo pages must include theme-init.js
- Validated and error-free HTML

## Key Principle

**Don't duplicate documentation** - this file is a lightweight enforcer that points to the authoritative docs (DOCUMENTATION_STANDARD.md and md3-component-plan.md).

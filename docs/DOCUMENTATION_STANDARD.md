# Documentation Standard

**Material Design 3 Component Library**  
Version 1.2 | Last Updated: January 23, 2026

This document defines the standard format for all component documentation in the Castrovalva Design System. Following these standards ensures consistency, maintainability, and a better developer experience.

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Demo Page Template](#demo-page-template)
3. [Component README Template](#component-readme-template)
4. [Writing Guidelines](#writing-guidelines)
5. [Section Requirements](#section-requirements)
6. [Code Examples](#code-examples)
7. [Accessibility Notes](#accessibility-notes)

---

## File Structure

Every component must have the following files:

```
src/components/{component-name}/
├── {component-name}.js       # Web Component implementation
├── README.md                 # Developer documentation
docs/components/
├── {component-name}.html     # Interactive demo page
test/
├── {component-name}.test.js  # Unit tests
```

**Naming Convention:**

- Use kebab-case for all file names: `button-group.js`, `segmented-button.html`
- Component tag names: `ds-{component-name}` (e.g., `ds-button-group`)
- Class names: `DS{ComponentName}` in PascalCase (e.g., `DSButtonGroup`)

---

## Demo Page Template

All demo pages must follow this comprehensive structure with visual demos, code examples, and detailed API documentation:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{Component Name} - Design System</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      rel="stylesheet" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
      rel="stylesheet" />
    <!-- Design system base styles (dev build) -->
    <link rel="stylesheet" href="../../src/styles.css" />
    <link rel="stylesheet" href="../shared/pattern-library.css" />
    <script type="module" src="../../src/index.js"></script>
  </head>
  <body data-page="{component-name}">
    <div class="page-container">
      <!-- Main Content -->
      <div class="content-area">
        <h1>{Component Name}</h1>
        <p class="description">
          Brief description of the component following MD3 specifications.
        </p>

        <!-- Basic Usage -->
        <div class="section">
          <h2>Basic Usage</h2>
          <p>
            Simple, straightforward example showing the most common use case.
          </p>
          <div class="demo-box">
            <ds-{component-name}>Example</ds-{component-name}>
          </div>
          <div class="code-block">
            <pre>
&lt;ds-{component-name}&gt;Example&lt;/ds-{component-name}&gt;</pre
            >
          </div>
        </div>

        <!-- Variants Demo -->
        <div class="section">
          <h2>Variants</h2>
          <p>Description of variant options</p>

          <h3>Default</h3>
          <p>When to use this variant</p>
          <div class="demo-box">
            <ds-{component-name}>Example</ds-{component-name}>
            <ds-{component-name} disabled>Disabled</ds-{component-name}>
          </div>
          <div class="code-block">
            <pre>
&lt;ds-{component-name}&gt;Example&lt;/ds-{component-name}&gt;</pre
            >
          </div>

          <h3>Variant Name</h3>
          <p>When to use this variant</p>
          <div class="demo-box">
            <ds-{component-name} variant="example">Example</ds-{component-name}>
          </div>
          <div class="code-block">
            <pre>
&lt;ds-{component-name} variant="example"&gt;Example&lt;/ds-{component-name}&gt;</pre
            >
          </div>
        </div>

        <!-- States Demo (if applicable) -->
        <div class="section">
          <h2>States</h2>
          <p>Interactive and validation states</p>
          <div class="demo-box">
            <ds-{component-name}>Default</ds-{component-name}>
            <ds-{component-name} disabled>Disabled</ds-{component-name}>
            <ds-{component-name} error>Error</ds-{component-name}>
          </div>
          <div class="code-block">
            <pre>
&lt;ds-{component-name} disabled&gt;Disabled&lt;/ds-{component-name}&gt;</pre
            >
          </div>
        </div>

        <!-- API Documentation (REQUIRED - Always include) -->
        <div class="section">
          <h2>API</h2>

          <h3>Attributes</h3>
          <table class="api-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>variant</code></td>
                <td>string</td>
                <td>'default'</td>
                <td>Visual variant: 'default', 'outlined', etc.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>false</td>
                <td>Disables the component</td>
              </tr>
            </tbody>
          </table>

          <!-- Events (if applicable) -->
          <h3>Events</h3>
          <table class="api-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Detail</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>change</code></td>
                <td><code>{ value: any }</code></td>
                <td>Fired when value changes</td>
              </tr>
            </tbody>
          </table>

          <!-- CSS Parts (if applicable) -->
          <h3>CSS Parts</h3>
          <table class="api-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>container</code></td>
                <td>Main container element</td>
              </tr>
            </tbody>
          </table>

          <!-- CSS Custom Properties (if applicable) -->
          <h3>CSS Custom Properties</h3>
          <table class="api-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--ds-{component}-bg</code></td>
                <td>Background color</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Accessibility (REQUIRED - Always include) -->
        <div class="section">
          <h2>Accessibility</h2>
          <ul>
            <li>✅ Keyboard navigation: Tab, Enter, Space, Arrow keys</li>
            <li>✅ Screen reader support with ARIA labels</li>
            <li>✅ Focus indicators meet WCAG 2.2 requirements</li>
            <li>✅ High contrast mode support</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Apply saved theme immediately to prevent flash -->
    <script src="../shared/theme-init.js"></script>
  </body>
</html>
```

**CSS Attachment Rules (Updated):**

- Use `../../src/styles.css` for demo pages during development to align with HMR and unbundled workflows.
- Keep the shared pattern library: `../shared/pattern-library.css`.
- Icon fonts remain required (Material Symbols links above).
- When producing a production/static export, it is acceptable to swap `../../src/styles.css` for the built CSS bundle, but dev docs should default to the source stylesheet.

### Required Sections (in order)

1. **Title & Description** - Component name and brief description
2. **Basic Usage** - Simple example showing the most common use case
3. **Variants** - Show all visual variants with `demo-box` and `code-block`
4. **States** - Interactive states (hover, focus, disabled, error) if applicable
5. **API** - REQUIRED section with Attributes table, Events, CSS Parts, Custom Properties
6. **Accessibility** - REQUIRED section with keyboard navigation and ARIA details

### Optional Sections

- **With Icons** - If component supports icons
- **Sizes/Density** - Different size variants
- **Advanced Usage** - Complex configurations
- **Usage Examples** - Additional HTML/JavaScript examples

### HTML Structure Requirements

- Use `<div class="page-container">` and `<div class="content-area">` wrappers
- Use `<div class="section">` for each major section
- Use `<div class="demo-box">` to wrap component examples
- Use `<div class="code-block"><pre>` to show code snippets
- Use `<table class="api-table">` for API documentation
- Include `data-page="{component-name}"` on `<body>` tag

---

## Component README Template

Place this in `src/components/{component-name}/README.md`:

```markdown
# {Component Name}

Material Design 3 {component type} component.

## Usage

\`\`\`html
<ds-{component-name} variant="default">
Content
</ds-{component-name}>
\`\`\`

## API

### Attributes

| Attribute  | Type      | Default     | Description                                     |
| ---------- | --------- | ----------- | ----------------------------------------------- |
| `variant`  | `string`  | `'default'` | Visual variant: `default`, `outlined`, `filled` |
| `disabled` | `boolean` | `false`     | Disables the component                          |
| `size`     | `string`  | `'medium'`  | Size variant: `small`, `medium`, `large`        |

### Events

| Event    | Detail                | Description              |
| -------- | --------------------- | ------------------------ |
| `change` | `{ value: any }`      | Fired when value changes |
| `click`  | `{ target: Element }` | Fired on click           |

### Slots

| Slot      | Description       |
| --------- | ----------------- |
| (default) | Main content area |
| `icon`    | Icon slot         |

### CSS Parts

| Part        | Description            |
| ----------- | ---------------------- |
| `container` | Main container element |
| `label`     | Label element          |

### CSS Custom Properties

| Property                 | Default                          | Description      |
| ------------------------ | -------------------------------- | ---------------- |
| `--ds-{component}-bg`    | `var(--md-sys-color-surface)`    | Background color |
| `--ds-{component}-color` | `var(--md-sys-color-on-surface)` | Text color       |

## Accessibility

- **Keyboard Navigation**: Tab to focus, Enter/Space to activate
- **ARIA**: Includes `role`, `aria-label`, `aria-disabled` attributes
- **Screen Readers**: Announces state changes

## Examples

### Basic Usage

\`\`\`html
<ds-{component-name}>
Click me
</ds-{component-name}>
\`\`\`

### With Attributes

\`\`\`html
<ds-{component-name} variant="filled" disabled>
Disabled
</ds-{component-name}>
\`\`\`

### Event Handling

\`\`\`javascript
const component = document.querySelector('ds-{component-name}');
component.addEventListener('change', (e) => {
console.log('New value:', e.detail.value);
});
\`\`\`

## MD3 Specification

[{Component Name} - Material Design 3](https://m3.material.io/components/{component-name})

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration from M2

Key differences from Material Design 2:

- New color mappings with dynamic color support
- Updated shape tokens (border radius)
- New state layer implementation
- Typography uses sentence case instead of all caps
```

---

## Contribution Workflow

Use this sequence when adding or updating docs:

1. Read [README.md](./README.md) for the current documentation architecture.
2. Use this document for structural and HTML rules.
3. Use [COMPONENT_CONTENT_MODEL.md](./COMPONENT_CONTENT_MODEL.md) for section intent and content quality.
4. Use [md3-component-plan.md](./md3-component-plan.md) when you need to confirm component scope, inventory, or stability expectations.

### Before You Start

Every component page should preserve these invariants:

- Uppercase `<!DOCTYPE html>`.
- Exactly one `theme-init.js` include at the end of `<body>`.
- Module import in `<head>` using `../../src/index.js`.
- Canonical sections: title/description, basic usage, variants, states, API, accessibility, usage guidelines.
- A boundary statement in the description describing common misuse.

### Validation Workflow

After making documentation changes:

1. Run diagnostics on the edited docs pages.
2. Verify examples and interactive demos still work.
3. Check light/dark theme behavior.
4. Verify links and references resolve correctly.
5. Run relevant tests when docs changes interact with demo scripts or example contracts.

### Maintenance Rules

- Keep one primary doc per concept and prefer cross-links over duplicate guidance.
- Keep navigation and resource links in [README.md](./README.md) current when files move.
- Put historical planning artifacts under [notes/README.md](./notes/README.md) instead of top-level docs.
- Prefer logical properties and direction terms in new examples and prose.

---

## Writing Guidelines

### Tone & Voice

- **Clear and concise** - Avoid unnecessary jargon
- **Action-oriented** - Use imperative mood ("Click the button" not "The button can be clicked")
- **Consistent terminology** - Use MD3 terms: "variant" not "type", "disabled state" not "inactive"

### Component Descriptions

Format: `Material Design 3 {component type} for {primary use case}.`

**Examples:**

- ✅ "Material Design 3 segmented button for single or multi-select options."
- ✅ "Material Design 3 button group for organizing related actions."
- ❌ "This is a component that groups buttons together."

### Section Descriptions

Each demo section needs a one-line description:

**Examples:**

- ✅ "Only one segment can be selected at a time."
- ✅ "Buttons are connected with 2dp spacing and modified border radius."
- ❌ "Example of the multi-select mode."

### Attribute Descriptions

Keep attribute descriptions concise:

**Examples:**

- ✅ `<b>variant</b>: <code>connected</code> (default) or <code>standard</code>`
- ✅ `<b>disabled</b>: disables all buttons in the group`
- ❌ `<b>variant</b>: This attribute controls the variant of the component`

---

## Section Requirements

### By Component Type

#### Action Components (Buttons, FABs, Icon Buttons)

**Required sections:**

1. Variants (filled, outlined, text, etc.)
2. With Icons (if supported)
3. Sizes/Density (if applicable)
4. Disabled State
5. Props

#### Selection Components (Checkbox, Radio, Switch, Segmented Button)

**Required sections:**

1. Default State
2. Selected State
3. Disabled State
4. With Labels/Icons
5. Props

#### Input Components (Text Field, Select, Date Picker)

**Required sections:**

1. Default/Empty State
2. Filled State
3. Error State
4. Disabled State
5. With Helper Text
6. Props

#### Container Components (Card, Dialog, Sheet)

**Required sections:**

1. Basic Usage
2. With Content Variations
3. Actions (if applicable)
4. Props

#### Navigation Components (Tabs, Drawer, Rail)

**Required sections:**

1. Default Layout
2. With Active State
3. With Icons
4. Props

---

## Code Examples

### HTML Formatting

**Use clean, readable formatting:**

```html
<!-- ✅ GOOD -->
<ds-button variant="filled"> Click me </ds-button>

<!-- ✅ GOOD - Single line for simple content -->
<ds-button variant="filled">Click me</ds-button>

<!-- ❌ BAD - Excessive line breaks -->
<ds-button variant="filled">Click me</ds-button>
```

### Inline Styles

**Avoid inline styles in component examples:**

```html
<!-- ✅ GOOD -->
<p>Selected: <span id="value">none</span></p>

<!-- ❌ BAD -->
<p
  style="margin-block-start: var(--ds-space-4); color: var(--ds-color-text-secondary);">
  Selected: <span id="value">none</span>
</p>
```

**Exception:** Use inline styles for layout containers when necessary:

```html
<!-- ✅ ACCEPTABLE for layout -->
<div style="display: flex; gap: var(--ds-space-4);">
  <ds-button>One</ds-button>
  <ds-button>Two</ds-button>
</div>
```

### JavaScript Examples

**Keep demo scripts simple and well-commented:**

```javascript
// ✅ GOOD
const button = document.getElementById("my-button");
button.addEventListener("change", (e) => {
  console.log("Value:", e.detail.value);
});

// ❌ BAD - No comments, unclear purpose
document.getElementById("my-button").addEventListener("change", function (e) {
  document.getElementById("output").innerText = e.detail.value || "none";
});
```

---

## Accessibility Notes

Every component README must include an **Accessibility** section covering:

### Required Information

1. **Keyboard Navigation** - All keyboard interactions
   - Example: "Tab to focus, Enter/Space to activate, Arrow keys to navigate"

2. **ARIA Attributes** - List of ARIA attributes used
   - Example: "`role='button'`, `aria-pressed`, `aria-disabled`"

3. **Screen Reader Support** - How screen readers announce the component
   - Example: "Announces button label and pressed state"

4. **Focus Management** - Focus behavior and indicators
   - Example: "Focus ring follows MD3 specifications"

### Example

```markdown
## Accessibility

- **Keyboard Navigation**:
  - `Tab` - Move focus to button
  - `Enter` / `Space` - Activate button
  - `Shift+Tab` - Move focus backwards
- **ARIA Attributes**:
  - `role="button"` - Identifies as button
  - `aria-disabled="true"` - Announces disabled state
  - `aria-label` - Provides accessible name when no text content
- **Screen Reader Support**:
  - Announces button label and variant
  - Announces state changes (pressed, disabled)
- **Focus Indicators**:
  - Visible focus ring using `--md-sys-color-primary`
  - 2px outline with 2px offset
  - Meets WCAG 2.2 focus visible requirements
```

---

## Quality Checklist

Before considering a component's documentation complete, verify:

### Demo Page (`docs/components/{name}.html`)

- [ ] Title includes component name and tag (`<ds-component>`)
- [ ] Brief, clear description following MD3 terminology
- [ ] At least 3 usage examples showing different variants/states
- [ ] Props section is the last section
- [ ] All attributes listed with types and defaults
- [ ] Events documented with detail structure
- [ ] Theme init script included
- [ ] Component script imported
- [ ] No console errors in browser
- [ ] Responsive on mobile devices

### Component README (`src/components/{name}/README.md`)

- [ ] Usage example at the top
- [ ] API tables for attributes, events, slots, parts
- [ ] Accessibility section with keyboard navigation
- [ ] Link to MD3 specification
- [ ] Browser support information
- [ ] At least 3 code examples
- [ ] Migration notes if replacing older component

### Code Quality

- [ ] HTML properly formatted (2-space indentation)
- [ ] No unnecessary inline styles
- [ ] Comments explain complex interactions
- [ ] Event listeners properly cleaned up
- [ ] Works with keyboard only
- [ ] Works with screen reader

### Content Quality

- [ ] Clear, concise descriptions
- [ ] Consistent terminology across docs
- [ ] No spelling or grammar errors
- [ ] MD3 specification links work
- [ ] Code examples are tested

---

## Examples

### Good Documentation Example

See: [`docs/components/button-group.html`](components/button-group.html)

**Strengths:**

- Clear section hierarchy
- Concise descriptions
- Clean HTML formatting
- Props section at the end
- No unnecessary inline styles

### Component with Interactive Demos

See: [`docs/components/segmented-button.html`](components/segmented-button.html)

**Strengths:**

- Shows selection values updating
- Multiple selection modes demonstrated
- Clean event handling in scripts
- Deprecation notice for MD3 Expressive

---

## Maintenance

### Updating This Standard

This documentation standard is a living document. When proposing changes:

1. **Discuss first** - Propose changes in team discussion
2. **Update examples** - Update at least 2 existing components to match
3. **Version bump** - Increment version number at top of document
4. **Changelog** - Document what changed and why

### Version History

- **1.0** (December 18, 2025) - Initial documentation standard

---

## References

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Web Components Standard](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Quick Reference

### Component Demo Page Checklist

```
✓ Title with component tag
✓ Brief description
✓ Default variant section
✓ Additional variants (2-3 minimum)
✓ State examples (disabled, error, etc.)
✓ Props section (LAST)
✓ Theme init script
✓ Component import
```

### README Checklist

```
✓ Usage example first
✓ API tables (attributes, events, slots)
✓ Accessibility section
✓ Code examples (3+ different scenarios)
✓ MD3 spec link
✓ Browser support
```

---

**Questions or suggestions?** Update this document or discuss with the team.

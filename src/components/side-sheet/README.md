# Side Sheet Component

Material Design 3 side sheet component for displaying navigation or additional content that slides in from the left or right side of the screen. Supports both standard and modal variants with full swipe-to-dismiss support on mobile devices.

## Features

- **Flexible positioning**: Slides in from left or right
- **Two variants**: Standard (dismissible) and modal (explicit close required)
- **Gesture support**: Full swipe-to-dismiss with velocity calculation
- **Accessibility**: Complete keyboard navigation and screen reader support
- **Animations**: Smooth 300ms transitions with cubic-bezier timing
- **Mobile responsive**: Auto-adapts width on smaller screens
- **Focus management**: Automatic focus trap and restoration
- **Content projection**: Slots for header, content, and actions
- **Material Design 3**: Follows official MD3 specifications

## Installation

The side sheet is part of the component library and is registered globally when you import the main index:

```javascript
import { initializeTheme, registerComponents } from "./src/index.js";

// Components are automatically registered
registerComponents();
```

## Basic Usage

### Default Side Sheet (Left, Standard)

```html
<ds-side-sheet id="mySheet">
  <div slot="header">
    <h2>Navigation</h2>
  </div>
  <p>Sheet content goes here</p>
</ds-side-sheet>

<script>
  // Open the sheet
  document.getElementById("mySheet").open = true;

  // Listen for events
  document
    .getElementById("mySheet")
    .addEventListener("ds-side-sheet:open", () => {
      console.log("Sheet opened");
    });

  document
    .getElementById("mySheet")
    .addEventListener("ds-side-sheet:close", () => {
      console.log("Sheet closed");
    });
</script>
```

### Right-aligned Sheet

```html
<ds-side-sheet position="right">
  <div slot="header">
    <h2>Options</h2>
  </div>
  <p>Right-aligned sheet content</p>
</ds-side-sheet>
```

### Modal Variant (Cannot dismiss by clicking background)

```html
<ds-side-sheet variant="modal">
  <div slot="header">
    <h2>Important Action</h2>
  </div>
  <p>This sheet must be explicitly closed</p>
  <button slot="actions" onclick="this.closest('ds-side-sheet').open = false">
    Close
  </button>
</ds-side-sheet>
```

### With Header, Content, and Actions

```html
<ds-side-sheet id="settingsSheet">
  <div slot="header">
    <h2>Settings</h2>
    <p>Configure your preferences</p>
  </div>

  <div class="settings-content">
    <label>
      Theme:
      <select>
        <option>Light</option>
        <option>Dark</option>
      </select>
    </label>
  </div>

  <div slot="actions">
    <button class="primary">Save</button>
    <button class="secondary">Cancel</button>
  </div>
</ds-side-sheet>

<script>
  document
    .getElementById("settingsSheet")
    .addEventListener("ds-side-sheet:close", () => {
      // Handle sheet closing
    });
</script>
```

## Attributes

| Attribute   | Type                      | Default      | Description                                                                                    |
| ----------- | ------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `variant`   | `'standard'` \| `'modal'` | `'standard'` | Display variant. Standard allows dismissal by background click, modal requires explicit close. |
| `position`  | `'left'` \| `'right'`     | `'left'`     | Position where sheet slides in from.                                                           |
| `open`      | `boolean`                 | `false`      | Whether the sheet is currently visible. Can be set as attribute or property.                   |
| `swipeable` | `boolean`                 | `true`       | Allow swipe-to-dismiss gesture on touch devices.                                               |

## Properties

### `open`

Get or set whether the sheet is currently open.

```javascript
const sheet = document.querySelector("ds-side-sheet");

// Get current state
console.log(sheet.open); // boolean

// Set to open
sheet.open = true;

// Set to close
sheet.open = false;
```

### `variant`

Get or set the display variant.

```javascript
const sheet = document.querySelector("ds-side-sheet");

// Get current variant
console.log(sheet.variant); // 'standard' or 'modal'

// Set variant
sheet.variant = "modal";
```

### `position`

Get or set the position.

```javascript
const sheet = document.querySelector("ds-side-sheet");

// Get current position
console.log(sheet.position); // 'left' or 'right'

// Set position
sheet.position = "right";
```

### `swipeable`

Get or set whether swipe gestures are enabled.

```javascript
const sheet = document.querySelector("ds-side-sheet");

// Get current state
console.log(sheet.swipeable); // boolean

// Disable swipe
sheet.swipeable = false;
```

## Methods

### `show()`

Open the side sheet with animation.

```javascript
const sheet = document.querySelector("ds-side-sheet");
sheet.show();
```

### `close()`

Close the side sheet with animation.

```javascript
const sheet = document.querySelector("ds-side-sheet");
sheet.close();
```

## Events

### `ds-side-sheet:open`

Fired when the sheet opens.

```javascript
sheet.addEventListener("ds-side-sheet:open", (event) => {
  console.log("Sheet opened");
});
```

### `ds-side-sheet:close`

Fired when the sheet closes.

```javascript
sheet.addEventListener("ds-side-sheet:close", (event) => {
  console.log("Sheet closed");
});
```

### `ds-side-sheet:swipe`

Fired continuously during a swipe-to-dismiss gesture with dismiss progress.

```javascript
sheet.addEventListener("ds-side-sheet:swipe", (event) => {
  const progress = event.detail.progress; // 0 to 1
  console.log(`Dismiss progress: ${progress * 100}%`);
});
```

## Slots

### Default Slot

Main content area. Use for the primary content of the sheet.

```html
<ds-side-sheet>
  <p>Main content goes here</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</ds-side-sheet>
```

### `header` Slot

Optional header section, typically containing a title.

```html
<ds-side-sheet>
  <div slot="header">
    <h2>Sheet Title</h2>
    <p>Subtitle or description</p>
  </div>
  <p>Content</p>
</ds-side-sheet>
```

### `actions` Slot

Optional actions section at the bottom, typically containing buttons.

```html
<ds-side-sheet>
  <div slot="header">
    <h2>Sheet Title</h2>
  </div>
  <p>Content</p>
  <div slot="actions">
    <button>Save</button>
    <button>Cancel</button>
  </div>
</ds-side-sheet>
```

## CSS Parts

Use the `::part()` CSS pseudo-element to style internal parts of the component:

| Part        | Description                                              |
| ----------- | -------------------------------------------------------- |
| `container` | Outer wrapper containing scrim and sheet                 |
| `scrim`     | Background overlay (click dismisses in standard variant) |
| `sheet`     | Main panel element                                       |
| `header`    | Header section wrapper                                   |
| `content`   | Content area wrapper                                     |
| `actions`   | Actions section wrapper                                  |

### Styling Example

```css
ds-side-sheet::part(sheet) {
  background-color: custom-color;
}

ds-side-sheet::part(scrim) {
  background-color: rgba(0, 0, 0, 0.32);
}

ds-side-sheet::part(header) {
  border-block-end: 1px solid var(--md-sys-color-outline);
}
```

## CSS Custom Properties

Customize sheet appearance with CSS custom properties:

| Property                          | Default                       | Description              |
| --------------------------------- | ----------------------------- | ------------------------ |
| `--ds-side-sheet-width`           | `360px`                       | Width of the sheet panel |
| `--ds-side-sheet-max-width`       | `100vw`                       | Maximum width on mobile  |
| `--ds-side-sheet-header-padding`  | `var(--ds-space-6)`           | Header padding           |
| `--ds-side-sheet-content-padding` | `var(--ds-space-6)`           | Content padding          |
| `--ds-side-sheet-actions-padding` | `var(--ds-space-6)`           | Actions area padding     |
| `--ds-side-sheet-actions-gap`     | `var(--ds-space-3)`           | Gap between action items |
| `--ds-side-sheet-bg-color`        | `var(--md-sys-color-surface)` | Sheet background color   |
| `--ds-side-sheet-scrim-color`     | `rgba(0, 0, 0, 0.32)`         | Scrim background color   |

### Customization Example

```css
ds-side-sheet {
  --ds-side-sheet-width: 400px;
  --ds-side-sheet-max-width: 90vw;
  --ds-side-sheet-bg-color: var(--md-sys-color-surface-container);
}
```

## Keyboard Navigation

| Key                               | Behavior                                      |
| --------------------------------- | --------------------------------------------- |
| <kbd>Escape</kbd>                 | Close sheet (standard variant only)           |
| <kbd>Tab</kbd>                    | Navigate through focusable elements in sheet  |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | Navigate backwards through focusable elements |

The component implements focus trapping to keep keyboard navigation within the sheet when it's open.

## Accessibility

The side sheet component follows Material Design 3 and WCAG 2.2 accessibility guidelines:

- **ARIA Support**:
  - `role="complementary"` on sheet element
  - `aria-modal="true"` when variant is modal
  - `aria-hidden="true"` on scrim for screen readers
  - Proper heading hierarchy with semantic HTML

- **Keyboard Navigation**:
  - Full keyboard support with Escape to close (standard variant)
  - Focus trap keeps focus within sheet when open
  - Focus restored to triggering element when closed
  - Tab order follows natural document flow

- **Screen Reader Support**:
  - Semantic HTML structure
  - Descriptive heading text in header slot
  - Content properly announced
  - State changes announced

- **Motion**:
  - Respects `prefers-reduced-motion` media query
  - Animations disabled for users with reduced motion preferences

- **Visual**:
  - High contrast mode support
  - Proper color contrast ratios (WCAG AA)
  - Clear visual distinction between open and closed states
  - Visible focus indicators for keyboard navigation

### Accessibility Example

```html
<ds-side-sheet id="navigationSheet" variant="standard">
  <div slot="header">
    <h2>Main Navigation</h2>
  </div>

  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</ds-side-sheet>

<script>
  // Restore focus to navigation button when sheet closes
  const navButton = document.querySelector('[aria-label="Open Navigation"]');
  document
    .getElementById("navigationSheet")
    .addEventListener("ds-side-sheet:close", () => {
      navButton.focus();
    });
</script>
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

## Material Design 3 References

This component implements the Material Design 3 side sheet specification:

- [Material Design - Navigation Drawer](https://m3.material.io/components/navigation-drawer/overview)
- [MD3 Specifications - Sheets](https://m3.material.io/components/bottom-sheets/specs)
- [MD3 Tokens](https://m3.material.io/tokens/overview)

## Testing

The component includes a comprehensive test suite with 50+ test cases:

```bash
npm test -- test/side-sheet.test.js
```

Test coverage includes:

- Component initialization and lifecycle
- Attribute and property handling
- Variant and position switching
- Keyboard navigation (Escape key)
- Scrim interactions
- Content projection with slots
- CSS parts and custom properties
- Animation and transition behavior
- Edge cases and error handling
- Full accessibility compliance

## Performance

- **Lightweight**: ~8KB minified (gzipped with bottom-sheet)
- **No dependencies**: Uses native Web Components API
- **Efficient animations**: Uses CSS transforms for GPU acceleration
- **Lazy rendering**: Shadow DOM contents only created when needed
- **Event delegation**: Minimal event listeners

## License

Part of the Material Design 3 Component Library - [MIT License](../../LICENSE)

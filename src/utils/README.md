# Design System Utilities

Material Design 3 utilities for enhanced functionality across components and applications.

**Version:** 1.0 | **Last Updated:** January 20, 2026

## Utilities Overview

| Utility                                         | Purpose                   | Use Case                      | Status      |
| ----------------------------------------------- | ------------------------- | ----------------------------- | ----------- |
| [Elevation](#elevation-utility)                 | Shadow depth control      | Card elevation, layering      | ✅ Complete |
| [Focus Ring](#focus-ring-utility)               | Keyboard focus indicators | Accessibility, tab navigation | ✅ Complete |
| [Ripple Effect](#ripple-effect)                 | Touch feedback animation  | Button interactions           | ✅ Complete |
| [Drag and Drop](#drag-and-drop-utility)         | Drag-drop functionality   | Reordering, file upload       | ✅ Complete |
| [Animation Presets](#animation-presets-library) | Motion token animations   | Entrance/exit animations      | ✅ Complete |

## Quick Start

### Elevation Utility

Programmatic control over Material Design 3 elevation levels using shadow depth.

```javascript
import { applyElevation } from "./utils/elevation.js";
applyElevation(element, 2); // Apply level 2 elevation
```

### Focus Ring Utility

Consistent keyboard-friendly focus indicators using `:focus-visible`.

```javascript
import { applyFocusRing } from "./utils/focus-ring.js";
applyFocusRing(element); // Add accessible focus ring
```

### Ripple Effect

Material Design 3 ripple animation for interactive elements.

```javascript
import { createRipple } from "./utils/ripple.js";
element.addEventListener("click", createRipple); // Add ripple on click
```

### Drag and Drop Utility

Comprehensive drag-and-drop with mouse, touch, and keyboard support.

```javascript
import { makeDraggable, makeDropZone } from "./utils/drag-drop.js";
makeDraggable(element);
makeDropZone(dropZone, {
  onDrop: (data) => {
    /* handle drop */
  },
});
```

### Animation Presets Library

CSS animations using Material Design 3 motion tokens with 31 presets covering fades, slides, scales, and effects.

```javascript
import { initAnimationPresets, animate } from "./utils/animation-presets.js";
initAnimationPresets(); // Initialize animation system
await animate(element, "slideInUp"); // Animate with preset
```

---

## Elevation Utility

Material Design 3 utility for programmatic control over elevation levels using shadow depth.

## Usage

```javascript
import {
  getElevation,
  applyElevation,
  ElevationManager,
} from "./src/utils/elevation.js";

// Apply elevation level 2 to an element
const card = document.querySelector(".my-card");
applyElevation(card, 2);
```

## API

### Functions

| Function                         | Parameters                                     | Returns          | Description                               |
| -------------------------------- | ---------------------------------------------- | ---------------- | ----------------------------------------- |
| `getElevation()`                 | `level` (0-5)                                  | `string`         | Get box-shadow value for a level          |
| `getCSSVariable()`               | `level` (0-5)                                  | `string`         | Get CSS custom property name for a level  |
| `applyElevation()`               | `element`, `level`                             | `void`           | Apply elevation directly to element       |
| `applyElevationVar()`            | `element`, `level`                             | `void`           | Apply elevation using CSS custom property |
| `removeElevation()`              | `element`                                      | `void`           | Remove elevation from element             |
| `getElementElevation()`          | `element`                                      | `number \| null` | Get current elevation level from element  |
| `applyElevationWithTransition()` | `element`, `fromLevel`, `toLevel`, `duration?` | `void`           | Apply elevation with smooth animation     |

### ElevationManager Class

Class for managing elevation with automatic state changes on interaction.

#### Constructor

```javascript
const manager = new ElevationManager(element, options);
```

**Options:**

| Option         | Type   | Default | Description              |
| -------------- | ------ | ------- | ------------------------ |
| `defaultLevel` | number | 0       | Base elevation level     |
| `hoverLevel`   | number | 2       | Elevation on hover       |
| `activeLevel`  | number | 3       | Elevation when pressed   |
| `focusLevel`   | number | 2       | Elevation on focus       |
| `duration`     | number | 300     | Transition duration (ms) |

#### Methods

| Method            | Parameters    | Returns  | Description                   |
| ----------------- | ------------- | -------- | ----------------------------- |
| `setElevation()`  | `level` (0-5) | `void`   | Set elevation with transition |
| `getElevation()`  | -             | `number` | Get current elevation level   |
| `reset()`         | -             | `void`   | Reset to default elevation    |
| `updateOptions()` | `options`     | `void`   | Update configuration          |
| `detach()`        | -             | `void`   | Remove event listeners        |

### Constants

#### `ELEVATION_LEVELS`

Object mapping level numbers (0-5) to box-shadow values.

```javascript
ELEVATION_LEVELS[2]; // Returns shadow string for level 2
```

#### `ELEVATION_CSS_VARS`

Object mapping level numbers (0-5) to CSS custom property names.

```javascript
ELEVATION_CSS_VARS[2]; // Returns '--md-sys-elevation-level2'
```

## Elevation Levels

| Level | Shadow Depth | Use Case                            |
| ----- | ------------ | ----------------------------------- |
| 0     | None         | Flat surfaces, default state        |
| 1     | 1dp          | Subtle elevation, hovered states    |
| 2     | 3dp          | Cards, small components             |
| 3     | 6dp          | Dialogs, significant elevation      |
| 4     | 8dp          | Modals, high elevation              |
| 5     | 12dp         | Floating actions, highest elevation |

## Examples

### Basic Elevation

```javascript
const card = document.querySelector(".my-card");

// Apply elevation directly
applyElevation(card, 2);

// Get the shadow value
const shadow = getElevation(2);
element.style.boxShadow = shadow;
```

### Interactive Card with ElevationManager

```javascript
const card = document.querySelector(".my-card");

// Manager automatically handles hover/focus/active states
const manager = new ElevationManager(card, {
  defaultLevel: 1,
  hoverLevel: 3,
  activeLevel: 4,
  duration: 200,
});

// Later, update configuration
manager.updateOptions({ hoverLevel: 4 });

// Clean up when done
manager.detach();
```

### Smooth Elevation Transition

```javascript
const header = document.querySelector("header");

// Animate elevation change over 300ms
applyElevationWithTransition(header, 0, 2, 300);

// Common use case: scroll detection
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    applyElevationWithTransition(header, 0, 2, 200);
  } else {
    applyElevationWithTransition(header, 2, 0, 200);
  }
});
```

### Using CSS Variables

```javascript
const card = document.querySelector(".my-card");

// Apply elevation using design token (allows theme updates)
applyElevationVar(card, 2);
// Result: box-shadow: var(--md-sys-elevation-level2)
```

## Accessibility

- **Visual Hierarchy**: Elevation enhances visual hierarchy, aiding users with visual disabilities
- **Keyboard Navigation**: Works with all interaction methods (mouse, touch, keyboard)
- **Focus States**: ElevationManager responds to keyboard focus events
- **Screen Readers**: Elevation is visual only and doesn't affect announcements
- **Best Practices**:
  - Combine elevation with color and contrast for clarity
  - Pair with explicit focus indicators
  - Use consistent transition durations

## CSS Design Tokens

The elevation utility uses Material Design 3 design tokens:

```css
--md-sys-elevation-level0: none;
--md-sys-elevation-level1:
  0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
--md-sys-elevation-level2:
  0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
--md-sys-elevation-level3:
  0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15);
--md-sys-elevation-level4:
  0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15);
--md-sys-elevation-level5:
  0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
```

## MD3 Specification

[Material Design 3 - Elevation](https://m3.material.io/styles/elevation/overview)

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

All modern browsers supporting CSS custom properties.

## Testing

Run unit tests with:

```bash
npm test -- test/elevation.test.js
```

Test coverage includes:

- All elevation levels (0-5)
- Error handling and validation
- Functional API methods
- CSS variable application
- Transition animations
- ElevationManager interactions
- Integration scenarios

## Related Resources

- [Material Design 3 - Elevation](https://m3.material.io/styles/elevation/overview)
- [CSS Box Shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

---

## Drag and Drop Utility

Material Design 3 drag-and-drop utility providing comprehensive functionality with touch, mouse, and keyboard support.

### Features

- ✅ **Mouse Support** - Native HTML5 drag-and-drop with visual feedback
- ✅ **Touch Support** - Touch events for mobile devices
- ✅ **Keyboard Support** - Full keyboard accessibility (Space/Enter to grab, arrows to move)
- ✅ **Drop Zones** - Multiple drop zones with accept filters
- ✅ **Sortable Lists** - Reorderable lists with placeholder feedback
- ✅ **Constraints** - Axis locking (x/y), containment, and grid snapping
- ✅ **Custom Data** - Pass data through drag lifecycle
- ✅ **Drag Handles** - Specific elements to initiate drag
- ✅ **Visual Feedback** - Configurable opacity, cursors, and CSS classes
- ✅ **Accessibility** - ARIA announcements and keyboard support

### Basic Usage

```javascript
import { makeDraggable, makeDropZone } from "./utils/drag-drop.js";

// Make element draggable
makeDraggable(element, {
  onDragStart: (data) => console.log("Started", data),
  onDragEnd: (data) => console.log("Ended", data),
});

// Create drop zone
makeDropZone(dropZone, {
  onDrop: (data) => {
    console.log("Dropped:", data);
    dropZone.appendChild(data.element);
  },
});
```

### HTML with Data Attributes

```html
<!-- Draggable items -->
<div data-draggable>Item 1</div>
<div data-draggable data-drag-axis="x">Item 2 (horizontal only)</div>

<!-- Drop zone -->
<div data-drop-zone data-drop-accept=".accepted">Drop here</div>

<script type="module">
  import { initDragDrop } from "./utils/drag-drop.js";
  initDragDrop(); // Auto-initialize
</script>
```

### Sortable List

```javascript
makeDropZone(list, {
  sortable: true,
  direction: "vertical",
  placeholder: true,
});

list.querySelectorAll(".item").forEach((item) => {
  makeDraggable(item, {
    handle: ".drag-handle",
  });
});
```

### API Reference

#### makeDraggable(element, options)

Make an element draggable.

**Key Options:**

- `handle` (string) - CSS selector for drag handle
- `axis` ('x'|'y'|null) - Constrain movement
- `disabled` (boolean) - Disable dragging
- `cursor` (string) - CSS cursor style
- `opacity` (number) - Opacity while dragging
- `revert` (boolean) - Return to start if not dropped
- `data` (object) - Custom data to pass
- `onDragStart`, `onDrag`, `onDragEnd` (functions) - Callbacks

#### makeDropZone(element, options)

Make an element a drop zone.

**Key Options:**

- `accept` (string) - CSS selector for acceptable draggables
- `sortable` (boolean) - Enable sortable list
- `direction` ('vertical'|'horizontal') - Sortable direction
- `placeholder` (boolean) - Show placeholder
- `onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop` (functions) - Callbacks

#### Additional Functions

- `removeDraggable(element)` - Remove draggable
- `removeDropZone(element)` - Remove drop zone
- `getDragState()` - Get current drag state
- `initDragDrop(root)` - Auto-initialize from data attributes

### Keyboard Accessibility

- **Tab** - Focus draggable items
- **Space/Enter** - Grab/drop item
- **Arrow Keys** - Move grabbed item (1px per press)
- **Shift + Arrows** - Move faster (10px per press)
- **Escape** - Cancel drag

Keyboard movement properly accumulates offsets for continuous movement on repeated keypresses.

### Interactive Demo

See [docs/components/drag-drop.html](../../docs/components/drag-drop.html) for comprehensive examples including:

- Basic drag and drop between zones
- Sortable lists with reordering
- Axis constraints (horizontal/vertical only)
- Accept filters for specific draggable types
- Event handling with live logging
- Keyboard accessibility with arrow key movement
- Custom data transfer
- Full API reference and accessibility guide

### Testing

```bash
npm test -- test/drag-drop.test.js
```

---

## Animation Presets Library

CSS animations using Material Design 3 motion tokens for consistent, purposeful animations across the design system.

### Features

- **31 animation presets** (fade, slide, scale, bounce, flip, rotate, pulse, glow, shake, shimmer, and more)
- **16 duration tokens** (50ms to 1000ms) aligned with MD3 motion guidelines
- **4 easing curves** (standard, emphasized, emphasized-decelerate, emphasized-accelerate)
- **Promise-based API** - wait for animations to complete
- **CSS class method** - for infinite or manual cleanup animations
- **Staggered sequences** - chain animations with automatic delay between elements
- **Animation sequences** - apply multiple animations to one element
- **Custom presets** - create your own animations using the preset system
- **Full keyboard and mouse support** in demo page

### Quick Start

```javascript
import { initAnimationPresets, animate } from "./utils/animation-presets.js";

// Initialize on page load
initAnimationPresets();

// Animate an element
await animate(element, "slideInUp");

// Or with custom duration
await animate(element, "fadeIn", { duration: 500 });
```

### Animation Types

**Fade Animations (4):**
`fadeIn`, `fadeOut`, `fadeInQuick`, `fadeOutQuick`

**Slide Animations (8):**
`slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`,
`slideOutUp`, `slideOutDown`, `slideOutLeft`, `slideOutRight`

**Scale Animations (3):**
`scaleIn`, `scaleOut`, `scaleInFast`

**Special Effects (12):**
`bounceIn`, `bounceOut`, `flipIn`, `flipOut`, `rotateIn`, `rotateOut`,
`shake`, `pulse`, `glow`, `expandHeight`, `collapseHeight`, `shimmer`

**Total: 31 animation presets** ready to use

### Duration System

```javascript
import { DURATIONS, getDuration } from "./utils/animation-presets.js";

// Short: 50-200ms (icon changes, toggles, immediate feedback)
DURATIONS.short1; // 50ms
DURATIONS.short2; // 100ms
DURATIONS.short3; // 150ms
DURATIONS.short4; // 200ms

// Medium: 250-400ms (dropdowns, tooltips, dialogs)
DURATIONS.medium1; // 250ms
DURATIONS.medium2; // 300ms
DURATIONS.medium3; // 350ms
DURATIONS.medium4; // 400ms

// Long: 450-600ms (drawers, full dialogs, transitions)
DURATIONS.long1; // 450ms
DURATIONS.long2; // 500ms
DURATIONS.long3; // 550ms
DURATIONS.long4; // 600ms

// Extra Long: 700-1000ms (page transitions, hero animations)
DURATIONS.extraLong1; // 700ms
DURATIONS.extraLong2; // 800ms
DURATIONS.extraLong3; // 900ms
DURATIONS.extraLong4; // 1000ms
```

### Core API

#### `initAnimationPresets()`

Initialize animation presets by injecting keyframes and CSS variables.

```javascript
initAnimationPresets();
// Call once on page load
```

#### `animate(element, preset, options)`

Apply animation and return completion promise.

```javascript
// Basic usage
await animate(element, "slideInUp");

// With custom options
await animate(element, "fadeIn", {
  duration: 500,
  easing: EASINGS.standard,
  delay: 100,
});

// With custom preset object
await animate(element, {
  animation: "custom-keyframe",
  duration: 300,
  easing: EASINGS.emphasized,
});
```

#### `animateWithClass(element, presetName, options)`

Apply animation using CSS class. Returns controller for pause/resume/remove.

```javascript
const controller = animateWithClass(element, "pulse");
controller.pause(); // Pause animation
controller.resume(); // Resume animation
controller.remove(); // Stop and clean up
```

#### `animateSequence(elements, preset, options)`

Animate multiple elements with staggered timing.

```javascript
const items = document.querySelectorAll(".list-item");
await animateSequence(items, "slideInLeft", {
  staggerDelay: 100,
  duration: 300,
});
```

#### `animateSequenceOnElement(element, presetSequence)`

Chain multiple animations on a single element.

```javascript
await animateSequenceOnElement(element, [
  { preset: "slideInUp", duration: 300 },
  { preset: "pulse", duration: 500 },
  { preset: "slideOutDown", duration: 300 },
]);
```

### Utility Functions

```javascript
import {
  getPresets,
  getPreset,
  getDuration,
  getEasing,
  createPreset,
  DURATIONS,
  EASINGS,
  PRESETS,
  KEYFRAMES,
} from "./utils/animation-presets.js";

// Get available presets
const names = getPresets();

// Get preset configuration
const preset = getPreset("slideInUp");

// Get duration/easing
const duration = getDuration("medium2"); // 300
const easing = getEasing("emphasizedDecelerate"); // cubic-bezier(...)

// Create custom preset
const custom = createPreset({
  name: "customAnimation",
  animation: "my-custom-keyframe",
  duration: 250,
  easing: EASINGS.standard,
});
```

### Real-World Examples

**Modal Dialog:**

```javascript
async function openModal(modal) {
  modal.style.display = "block";
  await animate(modal, "slideInUp");
}

async function closeModal(modal) {
  await animate(modal, "slideOutDown");
  modal.style.display = "none";
}
```

**List Item Entrance:**

```javascript
async function populateList(items) {
  const elements = document.querySelectorAll(".list-item");
  await animateSequence(elements, "slideInLeft", {
    staggerDelay: 100,
    duration: 300,
  });
}
```

**Loading State:**

```javascript
const loader = document.querySelector(".loader");
const controller = animateWithClass(loader, "pulse");

// Later, when done loading
controller.remove();
await animate(loader, "fadeOut");
```

**Form Validation Error:**

```javascript
function validateInput(input) {
  if (!isValid(input.value)) {
    await animate(input, 'shake');
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }
}
```

### Easing Curves

```javascript
import { EASINGS } from "./utils/animation-presets.js";

EASINGS.standard; // cubic-bezier(0.2, 0, 0, 1)
EASINGS.emphasized; // cubic-bezier(0.2, 0, 0, 1)
EASINGS.emphasizedDecelerate; // cubic-bezier(0.05, 0.7, 0.1, 1)
EASINGS.emphasizedAccelerate; // cubic-bezier(0.3, 0, 0.8, 0.15)
EASINGS.linear; // linear
```

**Usage Guidelines:**

- **Standard:** Default for most animations (smooth, natural)
- **Emphasized-Decelerate:** For elements entering (slide in, fade in)
- **Emphasized-Accelerate:** For elements leaving (slide out, fade out)

### Interactive Demo

See [docs/components/animation-presets.html](../../docs/components/animation-presets.html) for comprehensive examples including:

- Basic fade animations
- Slide animations (all directions)
- Scale animations
- Special effects (bounce, flip, rotate)
- Emphasis animations (shake, pulse, glow)
- Expand/collapse transitions
- Duration tokens visualization
- Staggered animation sequences
- Animation sequences on single element
- CSS class method with controls
- Complete preset catalog
- Real-world usage examples

### Testing

```bash
npm test -- test/animation-presets.test.js
```

Includes 50+ test cases covering:

- Initialization and CSS injection
- Duration and easing tokens
- Keyframe definitions
- Preset configurations
- Animation application
- Promise-based completion
- CSS class method
- Staggered sequences
- Animation sequences
- Utility functions
- Custom presets
- Real-world scenarios

Test coverage includes:

- Draggable initialization and cleanup
- Drop zone behavior
- Event callbacks
- Keyboard interactions
- Touch support
- Data transfer
- Accessibility features

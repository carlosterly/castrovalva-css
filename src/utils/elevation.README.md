# Elevation Utility

**Material Design 3 Shadow Depth Control**

Programmatic control over Material Design 3 elevation levels using shadow depth. Apply, transition, and manage elevation on elements with automatic state handling.

**Status:** ✅ Complete | **Version:** 1.0 | **Module:** `src/utils/elevation.js`

---

## Quick Start

```javascript
import { applyElevation, ElevationManager } from "./utils/elevation.js";

// Direct elevation
applyElevation(element, 2);

// With state management
const manager = new ElevationManager(element, {
  defaultLevel: 0,
  hoverLevel: 2,
  activeLevel: 3,
});
```

---

## Elevation Levels

| Level | Use Case                | Shadow Depth |
| ----- | ----------------------- | ------------ |
| 0     | Flat surfaces           | None         |
| 1     | Raised elements         | Subtle       |
| 2     | Floating cards          | Medium       |
| 3     | Modals, popovers        | Deep         |
| 4     | Floating action buttons | Very deep    |
| 5     | Dialogs, menus          | Maximum      |

---

## API Reference

### `getElevation(level)`

Get box-shadow value for elevation level.

```javascript
import { getElevation } from "./utils/elevation.js";
const shadow = getElevation(2);
```

**Parameters:**

- `level` (0-5) - Elevation level

**Returns:** Box-shadow CSS string

---

### `applyElevation(element, level)`

Apply elevation directly to element.

```javascript
applyElevation(card, 2);
```

**Parameters:**

- `element` (HTMLElement) - Target element
- `level` (0-5) - Elevation level

---

### `removeElevation(element)`

Remove elevation from element.

```javascript
removeElevation(element);
```

---

### `getElementElevation(element)`

Get current elevation level of element.

```javascript
const level = getElementElevation(element);
```

**Returns:** Elevation level or null

---

### `applyElevationWithTransition(element, fromLevel, toLevel, duration)`

Apply elevation with smooth animation.

```javascript
await applyElevationWithTransition(element, 0, 3, 300);
```

**Parameters:**

- `element` (HTMLElement) - Target element
- `fromLevel` (0-5) - Starting elevation
- `toLevel` (0-5) - Target elevation
- `duration` (number) - Transition duration (ms)

---

### `ElevationManager` Class

Class for managing elevation with automatic state changes.

#### Constructor

```javascript
const manager = new ElevationManager(element, options);
```

**Options:**

| Option         | Type   | Default | Description     |
| -------------- | ------ | ------- | --------------- |
| `defaultLevel` | number | 0       | Base elevation  |
| `hoverLevel`   | number | 2       | On hover        |
| `activeLevel`  | number | 3       | On press        |
| `focusLevel`   | number | 2       | On focus        |
| `duration`     | number | 300     | Transition (ms) |

#### Methods

```javascript
manager.setElevation(2); // Set with transition
manager.getElevation(); // Get current level
manager.reset(); // Reset to default
manager.updateOptions(opts); // Update config
manager.detach(); // Remove listeners
```

---

## Usage Examples

### Basic Elevation

```javascript
import { applyElevation } from "./utils/elevation.js";

const card = document.querySelector(".card");
applyElevation(card, 2);
```

### Automatic State Management

```javascript
import { ElevationManager } from "./utils/elevation.js";

const button = document.querySelector(".button");
new ElevationManager(button, {
  defaultLevel: 1,
  hoverLevel: 2,
  activeLevel: 3,
});

// Elevation changes automatically on hover/click
```

### Animated Elevation Change

```javascript
import { applyElevationWithTransition } from "./utils/elevation.js";

const element = document.querySelector(".element");

// Smooth transition from level 0 to 3 over 300ms
await applyElevationWithTransition(element, 0, 3, 300);
```

### Dynamic Elevation

```javascript
import { getElevation } from "./utils/elevation.js";

// Use in custom styles
const customCard = document.querySelector(".custom-card");
customCard.style.boxShadow = getElevation(2);
```

---

## CSS Custom Properties

Elevation levels are also available as CSS variables:

```css
.card {
  box-shadow: var(--md-sys-elevation-level0);
}

.card:hover {
  box-shadow: var(--md-sys-elevation-level2);
}
```

---

## Best Practices

1. **Use ElevationManager for interactive elements** - Automatic state handling
2. **Apply elevation to enhance hierarchy** - Not for styling alone
3. **Limit elevation changes** - Too many levels reduce clarity
4. **Combine with other MD3 properties** - Color, typography, spacing
5. **Test on various backgrounds** - Ensure shadow visibility

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## License

Part of the Castrovalva Design System. Material Design 3 specification by Google.

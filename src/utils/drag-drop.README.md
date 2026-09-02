# Drag and Drop Utility

**Material Design 3 Drag-and-Drop System**

Comprehensive drag-and-drop functionality with full mouse, touch, and keyboard support. Includes draggable elements, drop zones, sortable lists, accept filters, and extensive event handling.

**Status:** ✅ Complete | **Version:** 1.0 | **Module:** `src/utils/drag-drop.js`

---

## Quick Start

```javascript
import { makeDraggable, makeDropZone } from "./utils/drag-drop.js";

// Make element draggable
makeDraggable(document.querySelector(".item"));

// Create drop zone
makeDropZone(document.querySelector(".drop-area"), {
  onDrop: (data) => {
    console.log("Dropped:", data.element);
  },
});
```

---

## Features

- ✅ **Mouse, Touch & Keyboard Support** - Works across all input methods
- ✅ **Drag Handles** - Specify areas for grabbing
- ✅ **Axis Constraints** - Limit dragging to X or Y axis
- ✅ **Containment** - Restrict drag to parent or selector
- ✅ **Grid Snapping** - Snap to grid positions
- ✅ **Sortable Lists** - Reorder items within zone
- ✅ **Accept Filters** - Control which items can drop
- ✅ **Auto-scroll** - Scroll container at drag edges
- ✅ **Custom Data** - Pass data with dragged item
- ✅ **Full Accessibility** - ARIA attributes and keyboard support

---

## API Reference

### `makeDraggable(element, options)`

Make an element draggable.

```javascript
makeDraggable(element, {
  handle: ".drag-handle",
  axis: "y",
  onDragStart: (data) => console.log("Started"),
  onDragEnd: (data) => console.log("Ended"),
});
```

**Options:**

| Option              | Type                | Default       | Description                       |
| ------------------- | ------------------- | ------------- | --------------------------------- |
| `handle`            | string              | null          | CSS selector for drag handle      |
| `axis`              | 'x'\|'y'\|null      | null          | Constrain to axis                 |
| `containment`       | string              | null          | Selector or 'parent' to constrain |
| `grid`              | [x, y]              | null          | Snap to grid                      |
| `disabled`          | boolean             | false         | Disable dragging                  |
| `cursor`            | string              | 'grab'        | Cursor style                      |
| `opacity`           | number              | 0.5           | Opacity while dragging            |
| `zIndex`            | number              | 1000          | Z-index while dragging            |
| `revert`            | boolean             | false         | Return if not dropped             |
| `revertDuration`    | number              | 300           | Revert animation (ms)             |
| `helper`            | 'clone'\|'original' | 'clone'       | Use clone or original             |
| `scroll`            | boolean             | true          | Auto-scroll at edges              |
| `scrollSensitivity` | number              | 20            | Edge distance to scroll           |
| `scrollSpeed`       | number              | 10            | Scroll speed                      |
| `dragClass`         | string              | 'ds-dragging' | Class while dragging              |
| `data`              | object              | {}            | Custom data to pass               |
| `onDragStart`       | function            | null          | Callback on start                 |
| `onDrag`            | function            | null          | Callback during drag              |
| `onDragEnd`         | function            | null          | Callback on end                   |

---

### `makeDropZone(element, options)`

Make an element a drop zone.

```javascript
makeDropZone(element, {
  accept: ".draggable",
  sortable: true,
  onDrop: (data) => {
    console.log("Dropped:", data.element);
  },
});
```

**Options:**

| Option        | Type                     | Default          | Description                       |
| ------------- | ------------------------ | ---------------- | --------------------------------- |
| `accept`      | string                   | '\*'             | CSS selector for acceptable items |
| `activeClass` | string                   | 'ds-drop-active' | Class on enter                    |
| `hoverClass`  | string                   | 'ds-drop-hover'  | Class on hover                    |
| `disabled`    | boolean                  | false            | Disable drop zone                 |
| `sortable`    | boolean                  | false            | Enable sortable                   |
| `direction`   | 'vertical'\|'horizontal' | 'vertical'       | Sort direction                    |
| `placeholder` | boolean                  | true             | Show placeholder                  |
| `onDragEnter` | function                 | null             | Callback on enter                 |
| `onDragOver`  | function                 | null             | Callback on hover                 |
| `onDragLeave` | function                 | null             | Callback on leave                 |
| `onDrop`      | function                 | null             | Callback on drop                  |

---

### `removeDraggable(element)`

Remove draggable functionality.

```javascript
removeDraggable(element);
```

---

### `removeDropZone(element)`

Remove drop zone functionality.

```javascript
removeDropZone(element);
```

---

### `initDragDrop(root)`

Auto-initialize from data attributes.

```javascript
// Initialize all elements with data attributes
initDragDrop(document.body);
```

---

## Usage Examples

### Basic Drag-Drop

```html
<div class="draggable-item" data-draggable>Item 1</div>
<div class="drop-zone" data-drop-zone>Drop here</div>

<script type="module">
  import { makeDraggable, makeDropZone } from "./utils/drag-drop.js";

  makeDraggable(document.querySelector(".draggable-item"));

  makeDropZone(document.querySelector(".drop-zone"), {
    onDrop: (data) => {
      data.zone.appendChild(data.element);
    },
  });
</script>
```

### Sortable List

```html
<ul class="sortable-list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<script type="module">
  import { makeDropZone } from "./utils/drag-drop.js";

  const list = document.querySelector(".sortable-list");
  list.querySelectorAll("li").forEach((item) => {
    item.draggable = true;
  });

  makeDropZone(list, {
    sortable: true,
    direction: "vertical",
    placeholder: true,
  });
</script>
```

### Drag Handle

```html
<div class="draggable-item">
  <span class="drag-handle">☰</span>
  Item content
</div>

<script type="module">
  import { makeDraggable } from "./utils/drag-drop.js";

  makeDraggable(document.querySelector(".draggable-item"), {
    handle: ".drag-handle",
  });
</script>
```

### Constrained Dragging

```javascript
// Horizontal only
makeDraggable(element, { axis: "x" });

// Within parent
makeDraggable(element, { containment: "parent" });

// Snap to grid
makeDraggable(element, { grid: [50, 50] });
```

### Multiple Drop Zones

```javascript
makeDraggable(item);

// Only accept in zone-a
makeDropZone(document.querySelector("#zone-a"), {
  accept: ".type-a",
  onDrop: (data) => {
    /* ... */
  },
});

// Only accept in zone-b
makeDropZone(document.querySelector("#zone-b"), {
  accept: ".type-b",
  onDrop: (data) => {
    /* ... */
  },
});
```

### Custom Data Transfer

```javascript
const products = [{ id: 1, name: "Product 1", price: 10 }];

makeDraggable(element, {
  data: products[0],
});

makeDropZone(cart, {
  onDrop: (data) => {
    const product = data.data;
    console.log("Added to cart:", product.name);
  },
});
```

### Event Handling

```javascript
makeDraggable(element, {
  onDragStart: (data) => {
    console.log("Started dragging", data.element);
  },
  onDrag: (data) => {
    console.log("Position:", data.x, data.y);
  },
  onDragEnd: (data) => {
    console.log("Ended - dropped:", data.dropped);
  },
});

makeDropZone(zone, {
  onDragEnter: () => console.log("Entered zone"),
  onDragLeave: () => console.log("Left zone"),
  onDrop: (data) => console.log("Dropped!"),
});
```

---

## Keyboard Support

All draggable elements support full keyboard control:

- **Tab** - Focus draggable items
- **Space/Enter** - Grab/drop item
- **Arrow Keys** - Move grabbed item (1px steps)
- **Shift + Arrow** - Move faster (10px steps)
- **Escape** - Cancel drag

---

## Accessibility

- ✅ ARIA attributes (`role`, `aria-grabbed`, `aria-dropeffect`)
- ✅ Keyboard navigation and control
- ✅ Touch support for mobile
- ✅ Screen reader announcements
- ✅ Visual feedback with CSS classes

---

## Demo & Testing

- **Interactive Demo:** [drag-drop.html](../../docs/components/drag-drop.html)
- **Test Suite:** [drag-drop.test.js](../../../test/drag-drop.test.js)

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with touch support

---

## License

Part of the Castrovalva Design System.

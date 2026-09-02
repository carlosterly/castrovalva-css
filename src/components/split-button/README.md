# Split Button

Material Design 3 split button component combining a primary action with a dropdown menu.

## Usage

```html
<ds-split-button variant="filled">
  Primary Action
  <ds-menu-item slot="menu" value="option-1">Option 1</ds-menu-item>
  <ds-menu-item slot="menu" value="option-2">Option 2</ds-menu-item>
  <ds-menu-item slot="menu" value="option-3">Option 3</ds-menu-item>
</ds-split-button>
```

## API

### Attributes

| Attribute  | Type    | Default      | Description                                                            |
| ---------- | ------- | ------------ | ---------------------------------------------------------------------- |
| `variant`  | string  | 'filled'     | Button style: 'filled', 'filled-tonal', 'outlined', 'elevated', 'text' |
| `disabled` | boolean | false        | Disables both buttons                                                  |
| `position` | string  | 'bottom-end' | Menu position: 'bottom-start', 'bottom-end', 'top-start', 'top-end'    |

### Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| (default) | Primary button content             |
| `menu`    | Menu items (ds-menu-item elements) |

### Events

| Event                         | Detail                   | Description            |
| ----------------------------- | ------------------------ | ---------------------- |
| `ds-split-button:click`       | `{ originalEvent }`      | Primary button clicked |
| `ds-split-button:menu-select` | `{ item, value, label }` | Menu item selected     |

### Methods

| Method        | Description              |
| ------------- | ------------------------ |
| `openMenu()`  | Opens the dropdown menu  |
| `closeMenu()` | Closes the dropdown menu |

### CSS Parts

| Part             | Description                 |
| ---------------- | --------------------------- |
| `primary-button` | The primary action button   |
| `menu-button`    | The dropdown trigger button |
| `menu`           | The dropdown menu container |

### CSS Custom Properties

| Property | Description                         |
| -------- | ----------------------------------- |
| none     | No component-specific custom props. |

## Examples

### Basic Usage

```html
<ds-split-button>
  Save
  <ds-menu-item slot="menu">Save As...</ds-menu-item>
  <ds-menu-item slot="menu">Save All</ds-menu-item>
</ds-split-button>
```

### Different Variants

```html
<!-- Filled -->
<ds-split-button variant="filled">Send</ds-split-button>

<!-- Outlined -->
<ds-split-button variant="outlined">Share</ds-split-button>

<!-- Text -->
<ds-split-button variant="text">More</ds-split-button>
```

### Menu Position

```html
<!-- Menu opens at bottom-start -->
<ds-split-button position="bottom-start">Actions</ds-split-button>

<!-- Menu opens at top-end -->
<ds-split-button position="top-end">Options</ds-split-button>
```

### Event Handling

```javascript
const splitBtn = document.querySelector("ds-split-button");

// Primary action
splitBtn.addEventListener("ds-split-button:click", () => {
  console.log("Primary action clicked");
});

// Menu selection
splitBtn.addEventListener("ds-split-button:menu-select", (e) => {
  console.log("Selected:", e.detail.value, e.detail.label);
});
```

### Programmatic Control

```javascript
const splitBtn = document.querySelector("ds-split-button");

// Open menu programmatically
splitBtn.openMenu();

// Close menu programmatically
splitBtn.closeMenu();

// Disable
splitBtn.disabled = true;
```

## Accessibility

- **Keyboard Navigation**:
  - `Tab` moves focus between primary and menu buttons
  - `Enter` / `Space` activates the focused control
  - `Escape` closes the menu when open
- **ARIA Attributes**:
  - `aria-haspopup="true"` on the menu button
  - `aria-expanded` reflects open/closed state
  - `role="menu"` on the menu container
  - `aria-label` provides accessible names for buttons
- **Screen Reader Support**:
  - Announces button labels and menu state changes
- **Focus Indicators**:
  - Visible focus ring using MD3 color tokens

## Best Practices

- Use for primary actions with related secondary options
- Keep menu items to 3-7 related actions
- Ensure the primary action is the most frequently used
- Provide clear, action-oriented labels
- Consider using dividers to group related menu items

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All browsers with Web Components support

## MD3 Specification

[Split Button - Material Design 3](https://m3.material.io/components/buttons)

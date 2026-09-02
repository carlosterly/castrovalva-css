# List Component

A continuous vertical index of text or images for displaying collections of items. Lists are composed of a container (`<ds-list>`) and one or more list items (`<ds-list-item>`).

## Installation

```javascript
import { DSList, DSListItem } from "castrovalva";
```

## Basic Usage

```html
<ds-list>
  <ds-list-item headline="Item 1"></ds-list-item>
  <ds-list-item headline="Item 2"></ds-list-item>
  <ds-list-item headline="Item 3"></ds-list-item>
</ds-list>
```

## Variants

### One-Line Items (Default)

Simple list items with only headline text. Default height is based on
`--ds-size-control-lg` plus 8px.

```html
<ds-list-item headline="One line item"></ds-list-item>
```

### Two-Line Items

List items with headline and supporting text. Default height is based on
`--ds-size-control-lg` plus 24px.

```html
<ds-list-item
  variant="two-line"
  headline="Two line item"
  supporting-text="This is supporting text">
</ds-list-item>
```

### Three-Line Items

List items with headline and longer supporting text (up to 2 lines). Default
height is based on `--ds-size-control-lg` plus 40px.

```html
<ds-list-item
  variant="three-line"
  headline="Three line item"
  supporting-text="This is a longer supporting text that can span multiple lines">
</ds-list-item>
```

## Slots

### Leading Slot

Add icons, avatars, or other elements before the headline.

```html
<ds-list-item headline="User name">
  <div slot="leading">
    <img src="avatar.png" alt="User avatar" />
  </div>
</ds-list-item>
```

### Trailing Slot

Add icons, buttons, or other elements after the content.

```html
<ds-list-item headline="Settings" trailing-text="On">
  <ds-icon-button slot="trailing">
    <ds-icon>more_vert</ds-icon>
  </ds-icon-button>
</ds-list-item>
```

## Selection

Use the `selected` attribute to mark items as selected.

```html
<ds-list-item headline="Item 1"></ds-list-item>
<ds-list-item headline="Selected item" selected></ds-list-item>
```

Handle selection changes with the `ds-list-item:click` event:

```javascript
const list = document.querySelector("ds-list");

list.addEventListener("ds-list-item:click", (event) => {
  const selectedItem = event.detail.item;
  console.log("Selected:", selectedItem.headline);
});
```

## Disabled Items

Use the `disabled` attribute to disable items (prevents click events).

```html
<ds-list-item headline="Disabled item" disabled></ds-list-item>
```

## CSS Custom Properties

```css
/* Customize list item styling */
ds-list-item {
  --ds-list-item-height: calc(var(--ds-size-control-lg) + 8px);
  --ds-list-item-height-two-line: calc(var(--ds-size-control-lg) + 24px);
  --ds-list-item-height-three-line: calc(var(--ds-size-control-lg) + 40px);
  --ds-list-item-padding: 8px 16px;
  --ds-list-item-border-color: var(--md-sys-color-outline-variant);
  --ds-list-item-leading-size: var(--ds-size-hit-area);
}
```

## CSS Parts

Style specific parts of list items using `::part()`:

```css
/* Style the headline */
ds-list-item::part(headline) {
  font-weight: 600;
}

/* Style the supporting text */
ds-list-item::part(supporting-text) {
  font-size: 12px;
}

/* Style the item container */
ds-list-item::part(container) {
  background-color: var(--md-sys-color-surface);
}
```

## API Reference

### DSList

The list container component (role="list").

#### Properties

- None (simple wrapper)

### DSListItem

The list item component.

#### Attributes

| Attribute         | Type    | Default    | Description                                        |
| ----------------- | ------- | ---------- | -------------------------------------------------- |
| `variant`         | String  | "one-line" | Item variant: "one-line", "two-line", "three-line" |
| `headline`        | String  | -          | Primary text for the item                          |
| `supporting-text` | String  | -          | Secondary text (two/three-line only)               |
| `trailing-text`   | String  | -          | Optional trailing text                             |
| `selected`        | Boolean | false      | Whether item is selected                           |
| `disabled`        | Boolean | false      | Whether item is disabled                           |

#### Properties (JavaScript)

```javascript
const item = document.querySelector("ds-list-item");

// Get/set variant
item.variant; // "one-line" | "two-line" | "three-line"
item.variant = "two-line";

// Get/set headline
item.headline; // string
item.headline = "New headline";

// Get/set supporting text
item.supportingText; // string
item.supportingText = "New supporting text";

// Get/set trailing text
item.trailingText; // string
item.trailingText = "New trailing text";

// Get/set selected state
item.selected; // boolean
item.selected = true;

// Get/set disabled state
item.disabled; // boolean
item.disabled = true;
```

#### Slots

| Slot       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `leading`  | Element to display before headline (icon, avatar, etc.) |
| `trailing` | Element to display after content (button, switch, etc.) |

#### CSS Parts

| Part              | Description                                |
| ----------------- | ------------------------------------------ |
| `container`       | Main item container                        |
| `leading`         | Leading slot container                     |
| `content`         | Content area with headline/supporting text |
| `headline`        | Headline text element                      |
| `supporting-text` | Supporting text element                    |
| `trailing`        | Trailing slot container                    |
| `trailing-text`   | Trailing text element                      |

#### Events

| Event                | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `ds-list-item:click` | Fired when item is clicked (detail.item = item element) |

## Accessibility

- List uses semantic `role="list"`
- List items use `role="listitem"`
- Disabled items set `aria-disabled="true"`
- Click events don't fire for disabled items
- Proper focus management for interactive elements
- Keyboard accessible through native click handlers

## Examples

### List with Avatars

```html
<ds-list>
  <ds-list-item variant="two-line" headline="Alice" supporting-text="Available">
    <div slot="leading" class="avatar">A</div>
  </ds-list-item>
  <ds-list-item
    variant="two-line"
    headline="Bob"
    supporting-text="In a meeting">
    <div slot="leading" class="avatar">B</div>
  </ds-list-item>
</ds-list>
```

### Selectable List

```html
<script>
  const list = document.querySelector("ds-list");
  list.addEventListener("ds-list-item:click", (event) => {
    // Deselect all items
    list.querySelectorAll("ds-list-item").forEach((item) => {
      item.selected = false;
    });
    // Select clicked item
    event.detail.item.selected = true;
  });
</script>

<ds-list>
  <ds-list-item headline="Option 1"></ds-list-item>
  <ds-list-item headline="Option 2"></ds-list-item>
  <ds-list-item headline="Option 3"></ds-list-item>
</ds-list>
```

### List with Controls

```html
<ds-list>
  <ds-list-item
    variant="two-line"
    headline="Notifications"
    supporting-text="Manage alerts"
    trailing-text="On">
  </ds-list-item>
  <ds-list-item
    variant="two-line"
    headline="Dark Mode"
    supporting-text="Enable dark theme"
    trailing-text="Off">
    <ds-switch slot="trailing"></ds-switch>
  </ds-list-item>
</ds-list>
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

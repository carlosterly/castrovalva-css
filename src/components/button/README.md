# Button

Material Design 3 button component for triggering actions and navigation with multiple variants, sizes, and interactive states.

## Usage

```html
<ds-button variant="filled"> Click me </ds-button>
```

## API

### Attributes

| Attribute  | Type      | Default    | Description                                                                      |
| ---------- | --------- | ---------- | -------------------------------------------------------------------------------- |
| `variant`  | `string`  | `'filled'` | Button style: `filled`, `filled-tonal`, `outlined`, `elevated`, `text`, `danger` |
| `size`     | `string`  | `'medium'` | Size variant: `small`, `medium`, `large`                                         |
| `disabled` | `boolean` | `false`    | Disables the button and prevents interaction                                     |
| `loading`  | `boolean` | `false`    | Shows loading state with spinner                                                 |
| `ripple`   | `boolean` | `false`    | Enables Material Design 3 ripple animation on click                              |
| `type`     | `string`  | `'button'` | Button type: `button`, `submit`, `reset`                                         |

### Events

| Event   | Detail                | Description                                    |
| ------- | --------------------- | ---------------------------------------------- |
| `click` | `{ target: Element }` | Fired when button is clicked (if not disabled) |

### Slots

| Slot         | Description              |
| ------------ | ------------------------ |
| (default)    | Main button text content |
| `icon-left`  | Icon element before text |
| `icon-right` | Icon element after text  |

### CSS Parts

| Part      | Description                       |
| --------- | --------------------------------- |
| `button`  | The internal button element       |
| `content` | The content wrapper for text/icon |

### CSS Custom Properties

| Property                             | Default              | Description                      |
| ------------------------------------ | -------------------- | -------------------------------- |
| `--md-sys-color-primary`             | Material theme color | Primary color for filled variant |
| `--md-sys-color-secondary-container` | Material theme color | Background for filled-tonal      |
| `--md-sys-color-outline`             | Material theme color | Border color for outlined        |
| `--md-sys-color-error`               | Material theme color | Color for danger variant         |
| `--md-sys-shape-corner-full`         | `100px`              | Border radius                    |

## Accessibility

- **Keyboard Navigation**:
  - `Tab` - Move focus to button
  - `Enter` / `Space` - Activate button
  - `Shift+Tab` - Move focus backwards
  - Focus always remains on button, not internal elements

- **ARIA Attributes**:
  - `role="button"` - Identifies as button when needed
  - `aria-disabled="true"` - Announces disabled state
  - `aria-pressed="true/false"` - For toggle-like buttons
  - `aria-label` - Provides accessible name when no text content

- **Screen Reader Support**:
  - Announces button label and variant
  - Announces disabled state
  - Announces loading state when active

- **Focus Indicators**:
  - Visible focus ring using Material Design 3 specifications
  - 2px outline with 2px offset
  - Meets WCAG 2.2 focus visible requirements
  - High contrast mode support

## Examples

### Basic Usage

```html
<ds-button>Click me</ds-button>
```

### Different Variants

```html
<ds-button variant="filled">Filled (default)</ds-button>
<ds-button variant="filled-tonal">Filled Tonal</ds-button>
<ds-button variant="outlined">Outlined</ds-button>
<ds-button variant="elevated">Elevated</ds-button>
<ds-button variant="text">Text</ds-button>
<ds-button variant="danger">Delete</ds-button>
```

### Different Sizes

```html
<ds-button size="small">Small</ds-button>
<ds-button size="medium">Medium</ds-button>
<ds-button size="large">Large</ds-button>
```

### With Icons

```html
<ds-button variant="filled">
  <span slot="icon-left">
    <span class="material-symbols-outlined">check</span>
  </span>
  Save
</ds-button>
```

### Disabled State

```html
<ds-button disabled>Disabled</ds-button>
<ds-button variant="filled-tonal" disabled>Disabled</ds-button>
```

### Loading State

```html
<ds-button loading>Processing...</ds-button>
```

### With Ripple Effect

```html
<ds-button variant="filled" ripple>Click me</ds-button>
```

### Form Submission

```html
<form>
  <input type="text" name="username" />
  <ds-button type="submit">Submit</ds-button>
</form>
```

### Event Handling

```javascript
const button = document.querySelector("ds-button");
button.addEventListener("click", (e) => {
  console.log("Button clicked!");
});
```

## Styling with CSS

### Override Button Colors

```css
ds-button[variant="filled"] {
  --md-sys-color-primary: #2196f3;
}
```

### Customize Border Radius

```css
ds-button {
  --md-sys-shape-corner-full: 8px;
}
```

### Custom Sizing

```css
ds-button {
  font-size: 16px;
  padding: 12px 24px;
}
```

## Material Design 3 Specification

[Button - Material Design 3](https://m3.material.io/components/buttons)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration from M2

Key differences from Material Design 2:

- New color system with dynamic color support
- Simplified variant names (filled instead of raised)
- Updated shape tokens (border radius standardized)
- Ripple animation now optional (`ripple` attribute)
- New loading state support
- Enhanced accessibility with better focus management

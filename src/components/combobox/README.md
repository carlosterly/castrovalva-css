# Combobox Component

Material Design 3 combobox component for selecting from a list of options with built-in search/filter capabilities. Supports single or multiple selection modes with full keyboard navigation and accessibility support.

## Features

- **Flexible selection**: Single or multiple selection modes
- **Search/filter**: Built-in search to filter options (optional)
- **Keyboard navigation**: Full keyboard support (arrows, enter, escape)
- **Accessibility**: WCAG 2.2 compliant with ARIA support
- **Customizable**: CSS parts and custom properties for theming
- **State management**: Easy value getting/setting
- **Events**: Custom events for open, close, and change
- **Material Design 3**: Follows official MD3 specifications
- **No dependencies**: Pure Web Components

## Installation

The combobox is part of the component library and is registered globally when you import the main index:

```javascript
import { initializeTheme, registerComponents } from "./src/index.js";

// Components are automatically registered
registerComponents();
```

## Basic Usage

### Simple Single Selection

```html
<ds-combobox id="fruits">
  <div slot="option" data-value="apple">Apple</div>
  <div slot="option" data-value="banana">Banana</div>
  <div slot="option" data-value="cherry">Cherry</div>
</ds-combobox>

<script>
  const combobox = document.getElementById("fruits");

  // Get selected value
  console.log(combobox.value); // 'apple' or null

  // Set value
  combobox.value = "banana";

  // Listen for changes
  combobox.addEventListener("ds-combobox:change", (e) => {
    console.log("Selected:", e.detail.value);
  });
</script>
```

### Multiple Selection

```html
<ds-combobox multiple id="languages">
  <div slot="option" data-value="js">JavaScript</div>
  <div slot="option" data-value="ts">TypeScript</div>
  <div slot="option" data-value="py">Python</div>
</ds-combobox>

<script>
  const combobox = document.getElementById("languages");

  // Get array of selected values
  console.log(combobox.value); // ['js', 'ts'] or []

  // Set multiple values
  combobox.value = ["js", "py"];

  // In HTML: value="js,py"
</script>
```

### Non-Searchable Combobox

```html
<ds-combobox searchable="false">
  <div slot="option">Small</div>
  <div slot="option">Medium</div>
  <div slot="option">Large</div>
</ds-combobox>
```

### Disabled Combobox

```html
<ds-combobox disabled>
  <div slot="option">Option 1</div>
  <div slot="option">Option 2</div>
</ds-combobox>
```

## Attributes

| Attribute     | Type            | Default              | Description                               |
| ------------- | --------------- | -------------------- | ----------------------------------------- |
| `open`        | `boolean`       | `false`              | Whether the dropdown is currently visible |
| `multiple`    | `boolean`       | `false`              | Allow multiple options to be selected     |
| `searchable`  | `boolean`       | `true`               | Enable search/filter input field          |
| `disabled`    | `boolean`       | `false`              | Disable all interactions                  |
| `placeholder` | `string`        | `'Select an option'` | Text shown when no option is selected     |
| `value`       | `string\|array` | `null`               | Currently selected value(s)               |

## Properties

### `open`

Get or set whether the dropdown is open.

```javascript
const combobox = document.querySelector("ds-combobox");

// Get current state
console.log(combobox.open); // boolean

// Set to open
combobox.open = true;

// Set to close
combobox.open = false;
```

### `value`

Get or set the selected value(s).

```javascript
const combobox = document.querySelector("ds-combobox");

// Single selection
combobox.value = "option1";
console.log(combobox.value); // 'option1'

// Multiple selection
combobox.value = ["option1", "option2"];
console.log(combobox.value); // ['option1', 'option2']

// Get value as array in multiple mode
console.log(Array.isArray(combobox.value)); // true in multiple mode
```

### `multiple`, `searchable`, `disabled`

Get or set boolean properties.

```javascript
combobox.multiple = true;
combobox.searchable = false;
combobox.disabled = true;
```

## Methods

### `show()`

Open the dropdown.

```javascript
combobox.show();
```

### `close()`

Close the dropdown.

```javascript
combobox.close();
```

## Events

### `ds-combobox:change`

Fired when the selection changes.

```javascript
combobox.addEventListener("ds-combobox:change", (event) => {
  console.log("Value:", event.detail.value); // Selected value(s)
  console.log("Option:", event.detail.option); // DOM element
});
```

### `ds-combobox:open`

Fired when the dropdown opens.

```javascript
combobox.addEventListener("ds-combobox:open", () => {
  console.log("Dropdown opened");
});
```

### `ds-combobox:close`

Fired when the dropdown closes.

```javascript
combobox.addEventListener("ds-combobox:close", () => {
  console.log("Dropdown closed");
});
```

## Slots

### `option` Slot

Define selectable options using elements with `slot="option"` attribute.

```html
<ds-combobox>
  <!-- Basic option -->
  <div slot="option">Option 1</div>

  <!-- Option with value attribute -->
  <div slot="option" data-value="custom-value">Display Text</div>

  <!-- Option with custom content -->
  <div slot="option" data-value="advanced">
    <strong>Advanced</strong>
    <p>With rich content</p>
  </div>
</ds-combobox>
```

The `data-value` attribute is optional. If not provided, the option's text content is used as the value.

## CSS Parts

Use `::part()` to style internal elements:

| Part           | Description                           |
| -------------- | ------------------------------------- |
| `container`    | Main wrapper element                  |
| `trigger`      | Button that opens/closes the dropdown |
| `dropdown`     | Dropdown container with options       |
| `search-input` | Search/filter input field             |
| `listbox`      | Options list container                |
| `option`       | Individual option button              |

### Styling Example

```css
ds-combobox::part(trigger) {
  border: 2px solid var(--md-sys-color-primary);
  border-radius: 8px;
}

ds-combobox::part(option) {
  padding: 16px;
  font-weight: 500;
}

ds-combobox::part(option)[aria-selected="true"] {
  background: var(--md-sys-color-primary);
  color: white;
}
```

## CSS Custom Properties

Customize combobox appearance:

| Property                         | Default                                               | Description                |
| -------------------------------- | ----------------------------------------------------- | -------------------------- |
| `--ds-combobox-width`            | `100%`                                                | Width of combobox          |
| `--ds-combobox-max-height`       | `280px`                                               | Max height of dropdown     |
| `--ds-combobox-height`           | `calc(var(--ds-size-control-lg) + var(--ds-space-2))` | Trigger height             |
| `--ds-combobox-search-height`    | `var(--ds-size-control-lg)`                           | Search input height        |
| `--ds-combobox-option-height`    | `var(--ds-size-control-lg)`                           | Option height              |
| `--ds-combobox-padding-y`        | `var(--ds-space-4)`                                   | Trigger vertical padding   |
| `--ds-combobox-padding-x`        | `var(--ds-space-4)`                                   | Trigger horizontal padding |
| `--ds-combobox-option-padding-y` | `var(--ds-space-3)`                                   | Option vertical padding    |
| `--ds-combobox-option-padding-x` | `var(--ds-space-4)`                                   | Option horizontal padding  |
| `--ds-combobox-icon-size`        | `var(--ds-size-icon-lg)`                              | Trigger icon size          |
| `--ds-combobox-bg-color`         | `var(--md-sys-color-surface-container-highest)`       | Trigger background         |
| `--ds-combobox-dropdown-bg`      | `var(--md-sys-color-surface-container)`               | Dropdown background        |
| `--ds-combobox-text-color`       | `var(--md-sys-color-on-surface)`                      | Text color                 |
| `--ds-combobox-border-color`     | `var(--md-sys-color-outline)`                         | Border color               |
| `--ds-combobox-hover-bg`         | `var(--md-sys-color-surface-container-high)`          | Hover background           |
| `--ds-combobox-selected-bg`      | `var(--md-sys-color-secondary-container)`             | Selected background        |
| `--ds-combobox-selected-color`   | `var(--md-sys-color-on-secondary-container)`          | Selected text color        |

### Customization Example

```css
ds-combobox {
  --ds-combobox-width: 100%;
  --ds-combobox-max-height: 400px;
  --ds-combobox-border-color: #e0e0e0;
  --ds-combobox-hover-bg: #f5f5f5;
  --ds-combobox-height: 3.5rem;
}
```

## Keyboard Navigation

| Key                  | Behavior                                   |
| -------------------- | ------------------------------------------ |
| <kbd>Enter</kbd>     | Open dropdown or select highlighted option |
| <kbd>Escape</kbd>    | Close dropdown                             |
| <kbd>ArrowDown</kbd> | Navigate to next option                    |
| <kbd>ArrowUp</kbd>   | Navigate to previous option                |
| <kbd>Space</kbd>     | Select option (when searchable disabled)   |
| <kbd>Type</kbd>      | Filter options (when searchable enabled)   |

## Accessibility

The combobox component is fully accessible and WCAG 2.2 AA compliant:

- **ARIA Support**:
  - `role="combobox"` on trigger button
  - `role="listbox"` on options container
  - `role="option"` on individual options
  - `aria-expanded` indicates dropdown state
  - `aria-selected` indicates selected options
  - `aria-haspopup="listbox"` on trigger

- **Keyboard Navigation**:
  - Full keyboard support with arrow keys
  - Enter to select
  - Escape to close
  - Can type to search when enabled

- **Screen Reader Support**:
  - Semantic HTML structure
  - Descriptive labels and roles
  - Value announcements on selection
  - State announcements

- **Focus Management**:
  - Focus automatically moves to search input when opened
  - Focus returns to trigger button when closed
  - Focus trap prevents tabbing outside dropdown when open

- **Visual Indicators**:
  - Clear selection indication
  - Highlighted option during navigation
  - Disabled state opacity
  - High contrast support

### Accessibility Example

```html
<fieldset>
  <legend>Select Programming Languages</legend>
  <ds-combobox id="langs" multiple aria-label="Programming languages">
    <div slot="option" data-value="python">Python</div>
    <div slot="option" data-value="javascript">JavaScript</div>
    <div slot="option" data-value="rust">Rust</div>
  </ds-combobox>
</fieldset>

<script>
  const combobox = document.getElementById("langs");

  combobox.addEventListener("ds-combobox:change", (e) => {
    console.log("Updated selection:", e.detail.value);
  });
</script>
```

## Advanced Examples

### With Grouped Options

```html
<ds-combobox id="grouped">
  <optgroup label="Fruits">
    <div slot="option" data-value="apple">Apple</div>
    <div slot="option" data-value="banana">Banana</div>
  </optgroup>
  <optgroup label="Vegetables">
    <div slot="option" data-value="carrot">Carrot</div>
    <div slot="option" data-value="broccoli">Broccoli</div>
  </optgroup>
</ds-combobox>
```

### Form Integration

```html
<form>
  <label for="country">Country</label>
  <ds-combobox id="country" name="country">
    <div slot="option" data-value="us">United States</div>
    <div slot="option" data-value="uk">United Kingdom</div>
    <div slot="option" data-value="ca">Canada</div>
  </ds-combobox>

  <button type="submit">Submit</button>
</form>

<script>
  const form = document.querySelector("form");
  const combobox = document.getElementById("country");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Selected country:", combobox.value);
  });
</script>
```

### Dynamic Options

```javascript
const combobox = document.querySelector("ds-combobox");

// Add options dynamically
const options = ["Option 1", "Option 2", "Option 3"];
options.forEach((opt) => {
  const div = document.createElement("div");
  div.slot = "option";
  div.textContent = opt;
  combobox.appendChild(div);
});

// Combobox automatically detects new options
combobox.show();
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

## Performance

- **Lightweight**: ~5KB minified (with other components)
- **No dependencies**: Uses native Web Components API
- **Efficient filtering**: Real-time search without lag
- **Lazy rendering**: Options only rendered when dropdown opens
- **GPU acceleration**: CSS transforms for smooth animations

## Testing

The component includes 50+ comprehensive test cases:

```bash
npm test -- test/combobox.test.js
```

Test coverage includes:

- Component initialization and lifecycle
- Single and multiple selection modes
- Search/filter functionality
- Keyboard navigation
- Event dispatching
- CSS parts and custom properties
- Accessibility compliance
- Edge cases and error handling

## Related Components

- [TextField](./text-field/) - For text input
- [Select](./select/) - Standard HTML select replacement (coming soon)
- [Menu](./menu/) - For action menus

## Material Design 3 References

- [MD3 Select](https://m3.material.io/components/menus/overview)
- [MD3 Tokens](https://m3.material.io/tokens/overview)
- [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## License

Part of the Material Design 3 Component Library - [MIT License](../../LICENSE)

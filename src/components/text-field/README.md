# Text Field

Material Design 3 text field for single-line input with validation, icons, and character counting.

## Usage

```html
<ds-text-field label="Full Name"></ds-text-field>
```

## API

### Attributes

| Attribute         | Type      | Default    | Description                                                      |
| ----------------- | --------- | ---------- | ---------------------------------------------------------------- |
| `variant`         | `string`  | `"filled"` | Visual style: `"filled"` or `"outlined"`.                        |
| `type`            | `string`  | `"text"`   | Input type: `text`, `email`, `password`, `number`, `tel`, `url`. |
| `label`           | `string`  | `""`       | Floating label text.                                             |
| `value`           | `string`  | `""`       | Input value.                                                     |
| `placeholder`     | `string`  | `""`       | Placeholder text.                                                |
| `supporting-text` | `string`  | `""`       | Helper text below the input.                                     |
| `error-text`      | `string`  | `""`       | Error message shown when `error` is set.                         |
| `disabled`        | `boolean` | `false`    | Disables the field.                                              |
| `error`           | `boolean` | `false`    | Shows error state.                                               |
| `required`        | `boolean` | `false`    | Marks the field as required.                                     |
| `maxlength`       | `number`  | `-`        | Maximum character length.                                        |
| `show-counter`    | `boolean` | `false`    | Shows the character counter.                                     |

### Events

| Event                  | Detail              | Description                          |
| ---------------------- | ------------------- | ------------------------------------ |
| `ds-text-field:input`  | `{ value: string }` | Fired on input.                      |
| `ds-text-field:change` | `{ value: string }` | Fired when value commits.            |
| `ds-text-field:focus`  | `{ value: string }` | Fired when the input receives focus. |
| `ds-text-field:blur`   | `{ value: string }` | Fired when the input loses focus.    |

### Slots

| Slot            | Description            |
| --------------- | ---------------------- |
| `leading-icon`  | Icon before the input. |
| `trailing-icon` | Icon after the input.  |

### CSS Parts

| Part                        | Description              |
| --------------------------- | ------------------------ |
| `input`                     | Native input element.    |
| `label`                     | Floating label.          |
| `leading-icon`              | Leading icon container.  |
| `trailing-icon`             | Trailing icon container. |
| `supporting-text-container` | Helper text wrapper.     |
| `supporting-text`           | Helper or error text.    |
| `character-counter`         | Character counter label. |

### CSS Custom Properties

| Property                | Default | Description               |
| ----------------------- | ------- | ------------------------- |
| `--ds-text-field-width` | `100%`  | Controls the field width. |

### Methods

| Method             | Description                       |
| ------------------ | --------------------------------- |
| `focus()`          | Moves focus to the input.         |
| `blur()`           | Removes focus from the input.     |
| `select()`         | Selects the input text.           |
| `checkValidity()`  | Returns the input validity state. |
| `reportValidity()` | Reports the input validity state. |

## Accessibility

- **Keyboard Navigation**: Tab to focus, Enter/Space to submit.
- **ARIA Attributes**: `aria-invalid` reflects the error state.
- **Screen Reader Support**: Uses native input semantics with labels.
- **Focus Indicators**: Follows MD3 focus visibility guidelines.

## Examples

### Basic Usage

```html
<ds-text-field label="Full Name"></ds-text-field>
```

### With Validation

```html
<ds-text-field
  label="Email"
  type="email"
  error
  error-text="Please enter a valid email">
</ds-text-field>
```

### With Icons

```html
<ds-text-field label="Search">
  <ds-icon slot="leading-icon" name="search"></ds-icon>
</ds-text-field>
```

## MD3 Specification

[Text Field - Material Design 3](https://m3.material.io/components/text-fields)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

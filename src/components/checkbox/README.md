# Checkbox

Material Design 3 checkbox for binary selection with checked, unchecked, and indeterminate states.

## Usage

```html
<ds-checkbox label="Receive updates"></ds-checkbox>
```

## API

### Attributes

| Attribute       | Type      | Default | Description                                |
| --------------- | --------- | ------- | ------------------------------------------ |
| `label`         | `string`  | `""`    | Label text displayed next to the checkbox. |
| `name`          | `string`  | `""`    | Form field name.                           |
| `value`         | `string`  | `""`    | Form value when checked.                   |
| `checked`       | `boolean` | `false` | Checked state.                             |
| `indeterminate` | `boolean` | `false` | Indeterminate state.                       |
| `disabled`      | `boolean` | `false` | Disables the checkbox.                     |
| `error`         | `boolean` | `false` | Shows error state.                         |
| `required`      | `boolean` | `false` | Makes the checkbox required.               |
| `size`          | `string`  | `""`    | Size of the checkbox (`sm`, `md`, `lg`).   |

### Events

| Event                | Detail                                                        | Description                            |
| -------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `ds-checkbox:change` | `{ checked: boolean, indeterminate: boolean, value: string }` | Fired when the checkbox state changes. |

### Slots

None.

### CSS Parts

| Part          | Description                  |
| ------------- | ---------------------------- |
| `container`   | The checkbox container.      |
| `input`       | The hidden native input.     |
| `icon`        | The checkbox icon.           |
| `label`       | The label text element.      |
| `state-layer` | The interaction state layer. |

### CSS Custom Properties

| Property                         | Default                         | Description         |
| -------------------------------- | ------------------------------- | ------------------- |
| `--ds-checkbox-size`             | `var(--ds-size-icon-md, 18px)`  | Checkbox size.      |
| `--ds-checkbox-icon-size`        | `var(--ds-size-icon-md, 18px)`  | Checkbox icon size. |
| `--ds-checkbox-state-layer-size` | `var(--ds-size-hit-area, 40px)` | State layer size.   |

## Accessibility

- **Keyboard Navigation**: Space toggles the checkbox.
- **ARIA Attributes**: `role="checkbox"`, `aria-checked`, `aria-disabled`, `aria-required`.
- **Screen Reader Support**: Announces label and checked state.
- **Focus Indicators**: Visible focus ring for keyboard users.

## Examples

### Checked State

```html
<ds-checkbox label="Agree" checked></ds-checkbox>
```

### Indeterminate State

```html
<ds-checkbox label="Select all" indeterminate></ds-checkbox>
```

### Error State

```html
<ds-checkbox label="Accept terms" error></ds-checkbox>
```

## MD3 Specification

[Checkbox - Material Design 3](https://m3.material.io/components/checkbox)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

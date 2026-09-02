# Radio

Material Design 3 radio button for single selection within a named group.

## Import

```javascript
import "../src/components/ds-radio.js";
```

## Basic Usage

```html
<ds-radio name="contact" value="email" checked></ds-radio>
<ds-radio name="contact" value="phone"></ds-radio>
```

## Attributes

| Attribute  | Type      | Default | Description                                         |
| ---------- | --------- | ------- | --------------------------------------------------- |
| `checked`  | `boolean` | `false` | Whether the radio is selected.                      |
| `disabled` | `boolean` | `false` | Disables interaction and removes it from tab order. |
| `error`    | `boolean` | `false` | Shows the error color treatment.                    |
| `name`     | `string`  | `""`    | Group name shared by related radios.                |
| `value`    | `string`  | `""`    | Value emitted when selected.                        |
| `size`     | `string`  | `""`    | Optional size override: `sm`, `md`, or `lg`.        |

## Properties

| Property   | Type      | Description                        |
| ---------- | --------- | ---------------------------------- |
| `checked`  | `boolean` | Gets or sets the checked state.    |
| `disabled` | `boolean` | Gets or sets the disabled state.   |
| `error`    | `boolean` | Gets or sets the error state.      |
| `name`     | `string`  | Gets or sets the radio group name. |
| `value`    | `string`  | Gets or sets the radio value.      |
| `size`     | `string`  | Gets or sets the size override.    |

## Events

| Event             | Detail                           | Description                          |
| ----------------- | -------------------------------- | ------------------------------------ |
| `ds-radio:change` | `{ checked: true, value, name }` | Fired when a radio becomes selected. |

## CSS Custom Properties

| Property                      | Default                          | Description                   |
| ----------------------------- | -------------------------------- | ----------------------------- |
| `--ds-radio-size`             | `var(--ds-size-icon-md, 18px)`   | Outer radio circle size.      |
| `--ds-radio-dot-size`         | `calc(var(--ds-radio-size) / 2)` | Inner selected dot size.      |
| `--ds-radio-state-layer-size` | `var(--ds-size-hit-area, 40px)`  | Interactive state-layer size. |

## Sizing Defaults

The radio defaults are mapped to the shared size-token system:

- default icon size uses `--ds-size-icon-md`
- default touch target uses `--ds-size-hit-area`
- the `size` attribute remaps icon and state-layer sizing to the `sm`, `md`, and `lg` token sets

## Accessibility

- Uses `role="radio"` with `aria-checked` and `aria-disabled`.
- Supports Space and Enter to select the focused radio.
- Supports Arrow keys to move selection within a named group.
- Disabled radios are removed from keyboard tab order.

## Examples

### Error State

```html
<ds-radio name="shipping" value="express" error></ds-radio>
```

### Size Variants

```html
<ds-radio name="density" value="compact" size="sm"></ds-radio>
<ds-radio name="density" value="default" size="md" checked></ds-radio>
<ds-radio name="density" value="comfortable" size="lg"></ds-radio>
```

## Notes

- Use radios only for mutually exclusive choices.
- For binary on/off choices, use a switch.
- For multi-select lists, use checkboxes.

## Demo

See `docs/components/radio.html`.

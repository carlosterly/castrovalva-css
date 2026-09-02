# Scrollbar (`ds-scrollbar`)

Utility wrapper for MD3-themed scrollbar styling.

## Basic Usage

```html
<ds-scrollbar style="block-size: 200px">
  <div style="block-size: 480px">Scrollable content</div>
</ds-scrollbar>
```

## Attributes

| Attribute   | Type    | Default    | Description                                 |
| ----------- | ------- | ---------- | ------------------------------------------- |
| `size`      | string  | `medium`   | `thin`, `medium`, `thick` thickness presets |
| `color`     | string  | `primary`  | Thumb color token mapping                   |
| `hover`     | boolean | true       | Hover-only visibility toggle                |
| `direction` | string  | `vertical` | `vertical`, `horizontal`, `both`            |

## Properties

```js
const el = document.querySelector("ds-scrollbar");
el.size = "thick";
el.color = "secondary";
el.hover = false;
el.direction = "both";
```

## Methods

- `getScrollbarSize()` returns active size token expression.
- `getColorVariable()` returns current CSS color variable name.
- `getHoverOpacity()` returns opacity value used for hover behavior.

## CSS Parts

- `container`: scrollable inner container.

```css
ds-scrollbar::part(container) {
  padding: 12px;
}
```

## CSS Custom Properties

- `--ds-scrollbar-size-thin`
- `--ds-scrollbar-size-medium`
- `--ds-scrollbar-size-thick`

Defaults are token-mapped in component CSS:

- Thin: `calc(var(--ds-space-2, 8px) - 2px)`
- Medium: `calc(var(--ds-space-2, 8px) + 2px)`
- Thick: `calc(var(--ds-space-3, 12px) + 2px)`

## Accessibility

- Preserves native scrolling behavior and keyboard scroll interactions.
- Does not change semantics of slotted content.

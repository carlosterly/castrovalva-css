# Divider

Material Design 3 divider component for separating content in lists and layouts.

## Usage

```html
<ds-divider></ds-divider>
```

## Variants

### Full-Width (Default)

```html
<ds-divider variant="full-width"></ds-divider>
```

### Inset

Inset from the start edge (16px by default):

```html
<ds-divider variant="inset"></ds-divider>
```

### Middle

Inset from both edges (16px by default):

```html
<ds-divider variant="middle"></ds-divider>
```

## Orientation

### Horizontal (Default)

```html
<ds-divider orientation="horizontal"></ds-divider>
```

### Vertical

```html
<div style="display: flex; align-items: center; height: 60px;">
  <span>Item 1</span>
  <ds-divider orientation="vertical"></ds-divider>
  <span>Item 2</span>
</div>
```

## API

### Attributes

| Attribute     | Type   | Default      | Description                                         |
| ------------- | ------ | ------------ | --------------------------------------------------- |
| `variant`     | String | "full-width" | Divider variant: "full-width", "inset", or "middle" |
| `orientation` | String | "horizontal" | Orientation: "horizontal" or "vertical"             |
| `color`       | String | -            | Custom color (CSS color value)                      |
| `thickness`   | String | -            | Custom thickness (CSS length value)                 |

### Properties

```javascript
const divider = document.querySelector("ds-divider");

// Variant
divider.variant = "inset"; // 'full-width', 'inset', or 'middle'
console.log(divider.variant);

// Orientation
divider.orientation = "vertical"; // 'horizontal' or 'vertical'
console.log(divider.orientation);

// Custom color
divider.color = "#ff5722";
console.log(divider.color);

// Custom thickness
divider.thickness = "2px";
console.log(divider.thickness);
```

### CSS Custom Properties

| Property                    | Default                             | Description                             |
| --------------------------- | ----------------------------------- | --------------------------------------- |
| `--ds-divider-color`        | var(--md-sys-color-outline-variant) | Color of the divider line               |
| `--ds-divider-thickness`    | 1px                                 | Thickness of the divider line           |
| `--ds-divider-inset`        | 16px                                | Inset spacing for inset variant         |
| `--ds-divider-middle-inset` | 16px                                | Spacing for middle variant (both sides) |

### CSS Parts

| Part      | Description                   |
| --------- | ----------------------------- |
| `divider` | The divider line element (hr) |

## Accessibility

- **Keyboard Navigation**: Non-interactive component, does not receive focus
- **ARIA**:
  - Uses semantic `<hr>` element
  - Has `role="separator"` for screen readers
- **Screen Reader Support**: Announces as separator to assistive technologies
- **Focus Management**: Does not receive keyboard focus (non-interactive)

## Examples

### Basic Usage

```html
<p>Content above</p>
<ds-divider></ds-divider>
<p>Content below</p>
```

### Divider in a List

```html
<div class="list-container">
  <div class="list-item">Item 1</div>
  <ds-divider variant="inset"></ds-divider>
  <div class="list-item">Item 2</div>
  <ds-divider variant="inset"></ds-divider>
  <div class="list-item">Item 3</div>
</div>
```

### Custom Styling

```html
<ds-divider variant="middle" color="#2196f3" thickness="2px"></ds-divider>
```

## Styling with CSS

```css
/* Custom color globally */
ds-divider {
  --ds-divider-color: #2196f3;
}

/* Custom thickness */
ds-divider {
  --ds-divider-thickness: 2px;
}

/* Custom inset spacing */
ds-divider[variant="inset"] {
  --ds-divider-inset: 24px;
}

/* Style the divider part */
ds-divider::part(divider) {
  background: linear-gradient(to right, transparent, #000, transparent);
}
```

## Browser Support

Works in all modern browsers that support Web Components:

- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+

## References

- [Material Design 3 - Divider](https://m3.material.io/components/divider)
- [MDN - Semantic HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)
- [ARIA - Separator Role](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

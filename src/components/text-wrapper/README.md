# Text Wrapper (ds-text-wrapper)

A Material Design 3 typography utility component for consistent text styling across applications.

## Overview

The Text Wrapper component provides a simple, declarative way to apply MD3 typescale styles (typography) to any text content. It handles font family, size, line height, weight, and letter spacing based on the selected variant.

## Features

- **MD3 Typescale Support**: All 15 official Material Design 3 typescale variants
- **Semantic Colors**: Support for all MD3 semantic colors (primary, secondary, tertiary, error, surface variants)
- **Text Alignment**: Full control over text alignment (start, center, end, left, right, justify)
- **Truncation**: Single-line truncation with ellipsis
- **Line Clamping**: Multi-line truncation with `-webkit-line-clamp`
- **Shadow DOM**: Full encapsulation for style isolation
- **CSS Parts**: External styling via `::part()` selector
- **Accessible**: WCAG 2.1 AA compliant with semantic HTML

## Installation

```html
<script src="src/components/text-wrapper/text-wrapper.js"></script>
```

## Basic Usage

```html
<!-- Default body-medium text -->
<ds-text-wrapper>Default text</ds-text-wrapper>

<!-- Display variant -->
<ds-text-wrapper variant="display-large">Large display heading</ds-text-wrapper>

<!-- Custom color -->
<ds-text-wrapper color="primary">Primary colored text</ds-text-wrapper>

<!-- Centered text -->
<ds-text-wrapper align="center">Centered text</ds-text-wrapper>

<!-- Truncate single line -->
<ds-text-wrapper truncate
  >Very long text that will be truncated with ellipsis</ds-text-wrapper
>

<!-- Limit to 3 lines -->
<ds-text-wrapper lines="3">
  Long paragraph that will be clipped to 3 lines with ellipsis
</ds-text-wrapper>
```

## Attributes

### `variant`

The MD3 typescale variant to apply. Default: `body-medium`

**Valid values:**

- Display: `display-large`, `display-medium`, `display-small`
- Headline: `headline-large`, `headline-medium`, `headline-small`
- Title: `title-large`, `title-medium`, `title-small`
- Body: `body-large`, `body-medium`, `body-small`
- Label: `label-large`, `label-medium`, `label-small`

```html
<ds-text-wrapper variant="headline-large">Headline</ds-text-wrapper>
```

### `color`

The semantic color to apply. Default: `on-surface`

**Valid values:**

- `on-surface`, `on-surface-variant`
- `primary`, `on-primary`
- `secondary`, `on-secondary`
- `tertiary`, `on-tertiary`
- `error`, `on-error`
- `outline`, `surface-variant`

```html
<ds-text-wrapper color="error">Error message</ds-text-wrapper>
```

### `align`

Text alignment. Default: `start`

**Valid values:** `start`, `center`, `end`, `left`, `right`, `justify`

```html
<ds-text-wrapper align="center">Centered text</ds-text-wrapper>
```

### `truncate`

Enables single-line truncation with ellipsis. Default: `false`

```html
<ds-text-wrapper truncate
  >Very long text that will be truncated...</ds-text-wrapper
>
```

### `lines`

Maximum number of lines before truncation. When set, enables multi-line truncation. Default: `null` (unlimited)

```html
<ds-text-wrapper lines="2"
  >Multi-line text that will be limited to 2 lines</ds-text-wrapper
>
```

## Properties

All attributes are available as properties:

```javascript
const textEl = document.querySelector("ds-text-wrapper");

// Get properties
console.log(textEl.variant); // "body-medium"
console.log(textEl.color); // "on-surface"
console.log(textEl.align); // "start"
console.log(textEl.truncate); // false
console.log(textEl.lines); // null

// Set properties
textEl.variant = "headline-large";
textEl.color = "primary";
textEl.align = "center";
textEl.truncate = true;
textEl.lines = 3;
```

## CSS Parts

Style the text wrapper using CSS parts:

```css
ds-text-wrapper::part(text) {
  font-weight: bold;
  text-decoration: underline;
}
```

## Slots

The component uses a default unnamed slot to accept text content:

```html
<ds-text-wrapper>
  Text content can include <strong>HTML elements</strong>
</ds-text-wrapper>
```

## Examples

### Typography Scale Demo

```html
<ds-text-wrapper variant="display-large">Display Large</ds-text-wrapper>
<ds-text-wrapper variant="display-medium">Display Medium</ds-text-wrapper>
<ds-text-wrapper variant="display-small">Display Small</ds-text-wrapper>

<ds-text-wrapper variant="headline-large">Headline Large</ds-text-wrapper>
<ds-text-wrapper variant="headline-medium">Headline Medium</ds-text-wrapper>
<ds-text-wrapper variant="headline-small">Headline Small</ds-text-wrapper>

<ds-text-wrapper variant="title-large">Title Large</ds-text-wrapper>
<ds-text-wrapper variant="title-medium">Title Medium</ds-text-wrapper>
<ds-text-wrapper variant="title-small">Title Small</ds-text-wrapper>

<ds-text-wrapper variant="body-large">Body Large</ds-text-wrapper>
<ds-text-wrapper variant="body-medium">Body Medium</ds-text-wrapper>
<ds-text-wrapper variant="body-small">Body Small</ds-text-wrapper>

<ds-text-wrapper variant="label-large">Label Large</ds-text-wrapper>
<ds-text-wrapper variant="label-medium">Label Medium</ds-text-wrapper>
<ds-text-wrapper variant="label-small">Label Small</ds-text-wrapper>
```

### Color Variants

```html
<ds-text-wrapper color="on-surface">Default text</ds-text-wrapper>
<ds-text-wrapper color="primary">Primary accent</ds-text-wrapper>
<ds-text-wrapper color="secondary">Secondary accent</ds-text-wrapper>
<ds-text-wrapper color="tertiary">Tertiary accent</ds-text-wrapper>
<ds-text-wrapper color="error">Error message</ds-text-wrapper>
```

### Text Truncation

```html
<!-- Single line with ellipsis -->
<ds-text-wrapper truncate>
  This is a very long text that will be cut off with an ellipsis after overflow
</ds-text-wrapper>

<!-- Limited to 2 lines -->
<ds-text-wrapper lines="2">
  This paragraph will be limited to a maximum of two lines of text, and any
  content beyond that will be hidden with an ellipsis indicator.
</ds-text-wrapper>
```

### Centered Heading

```html
<ds-text-wrapper variant="headline-large" color="primary" align="center">
  Section Title
</ds-text-wrapper>
```

## Accessibility

The Text Wrapper component is fully accessible:

- ✅ Semantic HTML structure
- ✅ Supports ARIA attributes for additional context
- ✅ Screen reader friendly
- ✅ Proper color contrast with all color variants
- ✅ Keyboard navigable when interactive content is included

```html
<!-- With ARIA label for additional context -->
<ds-text-wrapper aria-label="Important announcement">
  System will be under maintenance
</ds-text-wrapper>
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Design Tokens

All typography values are sourced from Material Design 3 design tokens:

- Font families: `--md-sys-typescale-*-font`
- Font sizes: `--md-sys-typescale-*-size`
- Line heights: `--md-sys-typescale-*-line-height`
- Font weights: `--md-sys-typescale-*-weight`
- Letter spacing: `--md-sys-typescale-*-tracking`

Colors are sourced from semantic color tokens:

- `--md-sys-color-on-surface`
- `--md-sys-color-primary`
- `--md-sys-color-secondary`
- etc.

## Related Components

- [Text Field](../text-field/) - For user input
- [Button](../button/) - For interactive actions
- [Card](../ds-card.js) - For content containers

## License

Material Design 3 is licensed under the Apache License 2.0.

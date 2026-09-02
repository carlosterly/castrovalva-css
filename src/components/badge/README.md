# DS Badge

Material Design 3 badge component for compact status and count indicators.

## Basic Usage

```html
<ds-badge value="3"></ds-badge>
```

## Attributes

- `value`: string or number content for the badge
- `dot`: boolean dot mode (no text)
- `max`: number overflow threshold for numeric content (default `99`)
- `color`: `primary`, `secondary`, `error`, or CSS color string
- `position`: `inline` or `overlap`

## Properties

- `value`
- `dot`
- `max`
- `color`
- `position`

## Behavior

- Numeric values above `max` are formatted as `{max}+`
- Dot mode suppresses text content
- Overlap mode toggles host positioning class for overlay placement

## Accessibility

- Badge content uses `role="status"`
- Badge is not focusable by default and should be paired with contextual labels

## CSS Custom Properties

- `--ds-badge-size` (defaults to `var(--ds-size-icon-md)`)
- `--ds-badge-dot-size` (defaults to `var(--ds-size-icon-sm)`)
- `--ds-badge-padding-inline` (defaults to `var(--ds-space-1)`)
- `--ds-badge-font-size` (defaults to `12px`)

# DS Tooltip

Material Design 3 tooltip component for brief contextual labels shown on hover and focus.

## Basic Usage

```html
<button id="help-target">Help</button>
<ds-tooltip for="help-target">Helpful context</ds-tooltip>
```

## Attributes

- `for`: target element id. When omitted, previous sibling is used.
- `position`: `auto`, `top`, `bottom`, `left`, or `right`.
- `delay`: delay in milliseconds before showing (default `500`).

## Properties

- `position`: reflects `position` attribute.
- `delay`: reflects `delay` attribute.

## Events

- `ds-tooltip:show` with detail `{ position, targetId }`
- `ds-tooltip:hide` with detail `{ targetId }`

## Methods

- `show()`
- `hide()`
- `updatePosition()`

## Accessibility

- Tooltip content exposes `role="tooltip"`.
- Target elements are linked with `aria-describedby`.
- Supports hover and keyboard focus interactions.

## CSS Custom Properties

- `--ds-tooltip-max-inline-size` (default `12.5rem`)
- `--ds-tooltip-padding-block` (default `var(--ds-space-1)`)
- `--ds-tooltip-padding-inline` (default `var(--ds-space-2)`)
- `--ds-tooltip-border-radius` (default `var(--ds-space-1)`)
- `--ds-tooltip-offset` (default `var(--ds-space-2)`)
- `--ds-tooltip-arrow-size` (default `var(--ds-space-1)`)
- `--ds-tooltip-z-index` (default `1000`)

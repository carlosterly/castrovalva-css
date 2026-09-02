# DS Progress Indicator

Material Design 3 progress indicators for linear and circular loading feedback.

## Components

- `ds-linear-progress`
- `ds-circular-progress`

## Basic Usage

```html
<ds-linear-progress value="45"></ds-linear-progress>
<ds-circular-progress value="45"></ds-circular-progress>
```

## Attributes

### ds-linear-progress

- `value`: current progress value.
- `max`: maximum value, defaults to `100`.
- `indeterminate`: enables indeterminate animation.
- `color`: `primary`, `secondary`, `tertiary`, `error`.

### ds-circular-progress

- `value`: current progress value.
- `max`: maximum value, defaults to `100`.
- `indeterminate`: enables indeterminate animation.
- `size`: `sm`, `md`, `lg`, aliases `small`, `medium`, `large`, or pixel value.
- `color`: `primary`, `secondary`, `tertiary`, `error`.

## Properties

- `value`
- `max`
- `indeterminate`
- `color`
- `size` (circular only)

## Methods

- `getProgress()`
- `getSizeValue()` (circular only)

## Events

- No custom events are emitted.

## Accessibility

- Uses `role="progressbar"`.
- Sets `aria-valuemin` and `aria-valuemax`.
- Sets `aria-valuenow` in determinate mode only.

## CSS Custom Properties

- `--ds-linear-progress-track-size` (default `var(--ds-space-1)`)
- `--ds-linear-progress-radius` (default `calc(var(--ds-space-1) / 2)`)
- `--ds-circular-progress-size-sm` (default `var(--ds-size-icon-lg)`)
- `--ds-circular-progress-size-md` (default `var(--ds-size-control-lg)`)
- `--ds-circular-progress-size-lg` (default `calc(var(--ds-size-control-lg) + var(--ds-space-4))`)

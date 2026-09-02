# DS Banner

Material Design 3 banner component for persistent, high-priority messaging with optional actions.

## Basic Usage

```html
<ds-banner open message="System maintenance starts tonight."></ds-banner>
```

## Attributes

- `message`: primary message text.
- `variant`: `default`, `info`, `warning`, `error`, or `success`.
- `dismissible`: controls whether dismiss button is rendered.
- `open`: controls visibility.

## Properties

- `message`
- `variant`
- `dismissible`
- `open`

## Methods

- `show(options)` with `{ message?: string, variant?: string }`
- `hide()`

## Events

- `ds-banner:show` with detail `{ message, variant }`
- `ds-banner:dismiss` with detail `{ message }`
- `ds-banner:action` with detail `{ actionIndex, message }`

## Slots

- Default slot: message fallback content.
- `icon`: custom icon.
- `supporting-text`: secondary explanatory text.
- `actions`: action button container.

## Accessibility

- Host uses `role="region"` with `aria-label="Banner notification"`.
- `aria-hidden` tracks open/closed state.
- Hidden status live region announces messages.

## CSS Parts

- `container`
- `icon`
- `content`
- `message`
- `supporting-text`
- `actions`
- `dismiss-button`

## CSS Custom Properties

- `--ds-banner-max-block-size` (default `31.25rem`)
- `--ds-banner-padding-inline` (default `var(--ds-space-4)`)
- `--ds-banner-padding-block` (default `var(--ds-space-4)`)
- `--ds-banner-gap` (default `var(--ds-space-4)`)
- `--ds-banner-icon-size` (default `var(--ds-size-icon-lg)`)
- `--ds-banner-action-gap` (default `var(--ds-space-2)`)
- `--ds-banner-dismiss-size` (default `var(--ds-size-control-md)`)

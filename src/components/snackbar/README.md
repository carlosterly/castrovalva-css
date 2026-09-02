# DS Snackbar

Material Design 3 snackbar component for brief feedback messages with optional action.

## Basic Usage

```html
<ds-snackbar id="snack"></ds-snackbar>

<script type="module">
  document.querySelector("#snack").show({
    message: "Saved successfully",
  });
</script>
```

## Attributes

- `message`: message text shown in the snackbar body.
- `action-label`: optional action button label.
- `duration`: auto-dismiss duration in milliseconds (`0` disables auto-dismiss).

## Properties

- `message`
- `actionLabel`
- `duration`

## Methods

- `show(options)`
- `dismiss()`

## Events

- `ds-snackbar:show` with detail `{ message, duration, hasAction }`
- `ds-snackbar:action` with detail `{ message, actionLabel }`
- `ds-snackbar:dismiss` with detail `{ message }`

## Behavior

- Queues multiple snackbar instances and displays one at a time.
- Prevents duplicate queue entries for the same instance while visible.
- Clears timeout state when dismissed or disconnected.

## Accessibility

- Snackbar uses `role="alert"` and `aria-live="polite"`.
- Includes a hidden status live region for announcement consistency.
- Action and close controls are native buttons.

## CSS Custom Properties

- `--ds-snackbar-min-inline-size` (default `21.5rem`)
- `--ds-snackbar-max-inline-size` (default `42rem`)
- `--ds-snackbar-min-block-size` (default `var(--ds-size-control-lg)`)
- `--ds-snackbar-gap` (default `var(--ds-space-2)`)
- `--ds-snackbar-padding-inline` (default `var(--ds-space-4)`)
- `--ds-snackbar-padding-block` (default `var(--ds-space-3)`)
- `--ds-snackbar-offset-inline` (default `var(--ds-space-4)`)
- `--ds-snackbar-offset-block-end` (default `var(--ds-space-4)`)
- `--ds-snackbar-radius` (default `var(--ds-space-1)`)
- `--ds-snackbar-action-padding-inline` (default `var(--ds-space-3)`)
- `--ds-snackbar-action-padding-block` (default `var(--ds-space-2)`)
- `--ds-snackbar-close-size` (default `var(--ds-size-icon-lg)`)

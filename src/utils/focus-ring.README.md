# Focus Ring Utility (`src/utils/focus-ring.js`)

Applies consistent keyboard-visible focus styling to interactive elements.

## Exports

- `applyFocusRing(target, options?)`
- `initFocusRings(root?)`
- `removeFocusRing(target)`

## Basic Usage

```js
import { applyFocusRing } from "../src/utils/focus-ring.js";

const button = document.querySelector("button");
applyFocusRing(button);
```

## Auto Initialization

Elements with `data-focus-ring` can be initialized in bulk:

```js
import { initFocusRings } from "../src/utils/focus-ring.js";

initFocusRings(document);
```

## Options

`applyFocusRing(target, options)` supports:

- `color`: focus ring color value
- `ringSize`: ring thickness value
- `offset`: distance from element edge
- `radius`: corner radius

For backward compatibility, `options["width"]` is also accepted.

```js
applyFocusRing(button, {
  color: "var(--md-sys-color-secondary)",
  ringSize: "3px",
  offset: "2px",
  radius: "10px",
});
```

## Data Attributes

- `data-focus-ring`
- `data-focus-ring-color`
- `data-focus-ring-width`
- `data-focus-ring-offset`
- `data-focus-ring-radius`

## CSS Tokens

The utility writes these custom properties to each target element:

- `--ds-focus-ring-color`
- `--ds-focus-ring-width`
- `--ds-focus-ring-offset`
- `--ds-focus-ring-radius`

## Accessibility Notes

- Focus ring is shown on keyboard interaction (`:focus-visible` or keyboard-mode fallback).
- Pointer interactions clear keyboard-mode visibility.
- Utility does not remove semantic behavior from target elements.

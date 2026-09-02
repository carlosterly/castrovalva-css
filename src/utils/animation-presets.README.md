# Animation Presets Utility

Material Design 3 animation helpers with token-based durations and easing curves.

- File: `src/utils/animation-presets.js`
- Demo: `docs/components/animation-presets.html`
- Tests: `test/animation-presets.test.js`

## Quick Start

```js
import {
  initAnimationPresets,
  animate,
} from "../src/utils/animation-presets.js";

initAnimationPresets();
await animate(element, "fadeIn");
```

## Core API

### `initAnimationPresets()`

Injects keyframes, motion-token CSS variables, and `.ds-animate-*` utility classes once.

### `animate(element, preset, options?)`

Runs a preset animation and resolves when complete.

```js
await animate(card, "slideInUp");
await animate(card, "fadeOut", { duration: 200, delay: 40 });
```

### `animateWithClass(element, presetName, options?)`

Applies class-based animation and returns controls:

- `remove()`
- `pause()`
- `resume()`

```js
const controller = animateWithClass(badge, "pulse");
controller.pause();
controller.resume();
controller.remove();
```

### `animateSequence(elements, preset, options?)`

Animates an array of elements with stagger support.

```js
await animateSequence(items, "slideInUp", { staggerDelay: 75 });
```

### `animateSequenceOnElement(element, presetSequence)`

Runs multiple presets in order for a single element.

```js
await animateSequenceOnElement(panel, [
  { preset: "fadeIn", duration: 120 },
  { preset: "scaleIn", duration: 180 },
]);
```

### Lookup Helpers

- `getPresets()`
- `getPreset(name)`
- `getDuration(key)`
- `getEasing(key)`
- `createPreset(config)`

## Presets

Examples:

- Fade: `fadeIn`, `fadeOut`, `fadeInQuick`, `fadeOutQuick`
- Slide: `slideInUp`, `slideInDown`, `slideOutUp`, `slideOutDown`
- Inline slide (logical canonical): `slideInInlineStart`, `slideInInlineEnd`, `slideOutInlineStart`, `slideOutInlineEnd`
- Scale: `scaleIn`, `scaleOut`, `scaleInFast`
- Emphasis: `bounceIn`, `bounceOut`, `flipIn`, `flipOut`, `rotateIn`, `rotateOut`, `shake`, `pulse`, `glow`, `shimmer`
- Block expand/collapse (logical canonical): `expandBlock`, `collapseBlock`

Backward-compatible alias names are also available:

- `slideInLeft`, `slideInRight`, `slideOutLeft`, `slideOutRight`
- `expandHeight`, `collapseHeight`

## Motion Tokens

Durations are exported in milliseconds:

- `short1` through `short4`
- `medium1` through `medium4`
- `long1` through `long4`
- `extraLong1` through `extraLong4`

Easing keys:

- `standard`
- `emphasized`
- `emphasizedDecelerate`
- `emphasizedAccelerate`
- `linear`

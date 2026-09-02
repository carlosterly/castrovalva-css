# State Layers & Ripple Effects

Material Design 3 state layers provide visual feedback for user interactions on interactive elements.

> **MD3 Specification:** [Interaction States](https://m3.material.io/foundations/interaction/states)  
> **Opacity Values:** Hover (0.08), Focus (0.12), Pressed (0.12), Dragged (0.16)

## Scope

- This document is the source of truth for interaction feedback patterns using state layers and ripple behavior.
- It covers hover/focus/pressed/dragged semantics and implementation guidance.
- It does not define complete token hierarchy; see [tokens.md](./tokens.md).
- It does not define animation system timing/choreography in detail; see [motion.md](./motion.md).

## Related Foundation Docs

- [Material Design 3 Token Reference](./tokens.md)
- [Motion & Animation System](./motion.md)

## Terminology Conventions

- Use interaction-state terms consistently: hover, focus, pressed, dragged.
- Refer to opacity/state-layer guidance as semantic system behavior, not ad hoc per-component styling.
- Keep motion timing details in [motion.md](./motion.md) and token naming in [tokens.md](./tokens.md).

## Start Here

- For foundation onboarding, begin with [tokens.md](./tokens.md), then [motion.md](./motion.md), then this state-layer guide.

## Overview

State layers are subtle color overlays that appear on hover, focus, and press states. They help users understand that an element is interactive and provide feedback during interaction.

## State Layer Utilities

### Basic State Layer

Apply to any interactive element:

```html
<div class="state-layer" tabindex="0">Interactive Element</div>
```

**Features:**

- Hover: 8% opacity overlay
- Focus: 12% opacity overlay
- Press: 12% opacity overlay
- Uses `currentColor` by default

### Colored State Layers

Override the state layer color:

```html
<div class="state-layer state-layer-primary">Primary overlay</div>
<div class="state-layer state-layer-secondary">Secondary overlay</div>
<div class="state-layer state-layer-tertiary">Tertiary overlay</div>
<div class="state-layer state-layer-error">Error overlay</div>
```

## Ripple Effects

### Basic Ripple

Add ripple animation to elements with `data-ripple` attribute:

```html
<button data-ripple>Click Me</button>
```

The ripple automatically initializes on page load.

### Custom Ripple Color

```html
<button data-ripple data-ripple-color="var(--md-sys-color-primary)">
  Primary Ripple
</button>
```

### CSS-Only Ripple Implementation

The ripple effect is implemented purely with CSS using the `:active` pseudo-class:

```css
/* Automatically applied to elements with data-ripple or .ripple-container */
[data-ripple]:active::after {
  animation: ripple-effect 0.6s ease-out;
}
```

**How it works:**

- Uses `::after` pseudo-element for the ripple circle
- Triggers on `:active` state (click/press)
- No JavaScript required
- Inherits color from parent element's `currentColor`
- 600ms duration with ease-out timing

## Combined State Layer + Ripple

For the full MD3 experience:

```html
<button class="state-layer" data-ripple>Best of Both</button>
```

This provides:

- State layer on hover/focus
- Ripple animation on click
- Press state overlay

## Common Use Cases

### Icon Buttons

```html
<button class="state-layer" style="border-radius: 50%;">
  <ds-icon name="favorite"></ds-icon>
</button>
```

### List Items

```html
<div class="state-layer">
  <ds-icon name="inbox"></ds-icon>
  <span>Inbox</span>
</div>
```

### Cards

```html
<div class="state-layer" data-ripple>
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

### Navigation Items

```html
<nav>
  <a href="#" class="state-layer">Home</a>
  <a href="#" class="state-layer">About</a>
  <a href="#" class="state-layer">Contact</a>
</nav>
```

## CSS Tokens

State layer opacities are defined in [tokens.md](./tokens.md) and available as CSS custom properties:

```css
--md-sys-state-hover-opacity: 0.08;
--md-sys-state-focus-opacity: 0.12;
--md-sys-state-pressed-opacity: 0.12;
--md-sys-state-dragged-opacity: 0.16;
```

These values are per Material Design 3 specification and should not be changed on a per-component basis. For color customization, use the component's semantic color token (e.g., `--md-sys-color-primary`).

## Accessibility

State layers enhance accessibility by:

- Providing visual feedback for keyboard navigation (focus state)
- Making interactive elements more discoverable (hover state)
- Confirming user actions (press state)

**Best Practices:**

1. Always include `tabindex` for non-button interactive elements
2. Use semantic HTML (`<button>`, `<a>`) when possible
3. Ensure state layers don't obscure important content
4. Test with keyboard navigation

## Browser Support

- State layers: All modern browsers (uses CSS `::before`)
- Ripple effects: All browsers with pointer events support
- Graceful degradation: Works without JavaScript (state layers only)

## Performance

State layers are highly optimized:

- Uses CSS pseudo-elements (no extra DOM nodes)
- GPU-accelerated transitions
- Ripple animations clean up automatically
- No memory leaks

## Customization

### Custom State Layer Opacity

```css
.my-element.state-layer:hover::before {
  opacity: 0.16; /* Custom hover opacity */
}
```

### Custom Ripple Animation

```css
@keyframes my-ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.my-ripple {
  animation: my-ripple 400ms ease-out;
}
```

### Disable State Layers

```css
.no-state-layer::before {
  display: none;
}
```

## Examples

See the "State Layers & Ripple Effects" section in `index.html` for live demos.

## References

- [Material Design 3 - Interaction States](https://m3.material.io/foundations/interaction/states)
- [Material Design 3 - Motion](https://m3.material.io/styles/motion)

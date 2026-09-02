# Motion & Animation System

Material Design 3 motion system with duration tokens and easing curves for consistent, meaningful animations.

> **MD3 Specification:** [Motion Guidelines](https://m3.material.io/styles/motion/overview)  
> **Duration System:** 16 tokens from 50ms to 1000ms  
> **Easing Curves:** Standard, Emphasized, Emphasized-Decelerate, Emphasized-Accelerate

## Scope

- This document is the source of truth for motion timing, easing, and animation behavior guidelines.
- It covers when and how to apply motion patterns in UI.
- It does not define full token taxonomy; see [tokens.md](./tokens.md).
- It does not define state-layer interaction semantics; see [state-layers.md](./state-layers.md).

## Related Foundation Docs

- [Material Design 3 Token Reference](./tokens.md)
- [State Layers & Ripple Effects](./state-layers.md)

## Terminology Conventions

- Use MD3 duration/easing names consistently: `short*`, `medium*`, `long*`, `extra-long*`, `standard`, `emphasized*`.
- Treat motion tokens as semantic system guidance (`md.sys.motion.*`) rather than component-specific hardcoded values.
- Prefer logical direction language in docs when describing movement in adaptive layouts.

## Start Here

- For full context, read [tokens.md](./tokens.md) first, then this motion guide, then [state-layers.md](./state-layers.md).

## Overview

Motion in Material Design 3 helps users understand relationships between UI elements, provides feedback, and guides attention. The motion system uses specific duration and easing tokens to create consistent, purposeful animations.

## Duration Tokens

### Short Durations (50-200ms)

For quick, immediate feedback on simple state changes.

```css
--md-sys-motion-duration-short1: 50ms; /* Extra quick - Icon state changes */
--md-sys-motion-duration-short2: 100ms; /* Very quick - Checkboxes, toggles */
--md-sys-motion-duration-short3: 150ms; /* Quick - Button hover, focus rings */
--md-sys-motion-duration-short4: 200ms; /* Snappy - Small UI element transitions */
```

**Use for:**

- Icon state changes (filled/outlined)
- Checkbox/radio button selections
- Toggle switches
- Button hover states
- Focus indicators
- Small ripple effects

### Medium Durations (250-400ms)

For standard UI transitions and component interactions.

```css
--md-sys-motion-duration-medium1: 250ms; /* Normal - Tooltips, menus */
--md-sys-motion-duration-medium2: 300ms; /* Comfortable - Dropdown expansion */
--md-sys-motion-duration-medium3: 350ms; /* Smooth - Dialog appearances */
--md-sys-motion-duration-medium4: 400ms; /* Relaxed - Tab transitions */
```

**Use for:**

- Dropdown menus
- Tooltips appearing
- Simple dialogs
- Bottom sheets (half-height)
- Tab switching
- Card expansions
- List item reveals

### Long Durations (450-600ms)

For complex animations and larger UI changes.

```css
--md-sys-motion-duration-long1: 450ms; /* Gentle - Side drawers */
--md-sys-motion-duration-long2: 500ms; /* Slow - Navigation transitions */
--md-sys-motion-duration-long3: 550ms; /* Very slow - Large dialogs */
--md-sys-motion-duration-long4: 600ms; /* Extra slow - Bottom sheet (full) */
```

**Use for:**

- Navigation drawers
- Full-screen dialogs
- Bottom sheets (full-height)
- Page section reveals
- Complex multi-step animations
- Large surface transitions

### Extra Long Durations (700-1000ms)

For page-level transitions and hero animations.

```css
--md-sys-motion-duration-extra-long1: 700ms;
--md-sys-motion-duration-extra-long2: 800ms;
--md-sys-motion-duration-extra-long3: 900ms;
--md-sys-motion-duration-extra-long4: 1000ms;
```

**Use for:**

- Page transitions
- Hero element animations
- Onboarding sequences
- Full-screen overlays
- App-level state changes

## Easing Curves

### Standard Easing

Gentle, balanced acceleration and deceleration.

```css
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
```

**Use for:**

- Most animations (default)
- Smooth, natural-feeling transitions
- When emphasis isn't required

**Example:**

```css
.element {
  transition: transform var(--md-sys-motion-duration-medium2)
    var(--md-sys-motion-easing-standard);
}
```

### Emphasized Easing

More pronounced curve for important UI changes.

```css
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
```

**Note:** Per Material Design 3 specification, the Emphasized easing curve is mathematically identical to Standard. Use this token for semantic intent when you want to emphasize a transition; the curve may differ in future custom theme implementations.

**Use for:**

- Important state changes
- User-triggered actions
- Drawing attention to changes

### Emphasized Decelerate

Strong deceleration for elements entering the screen.

```css
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
```

**Use for:**

- Elements appearing (fade in, slide in)
- Expanding panels
- Dialog opening
- Menu revealing
- Any "entering" motion

**Example:**

```css
.dialog-enter {
  animation: fadeIn var(--md-sys-motion-duration-medium3)
    var(--md-sys-motion-easing-emphasized-decelerate);
}
```

### Emphasized Accelerate

Strong acceleration for elements exiting the screen.

```css
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
```

**Use for:**

- Elements disappearing (fade out, slide out)
- Collapsing panels
- Dialog closing
- Menu hiding
- Any "exiting" motion

**Example:**

```css
.dialog-exit {
  animation: fadeOut var(--md-sys-motion-duration-short4)
    var(--md-sys-motion-easing-emphasized-accelerate);
}
```

## Animation Utilities

### Fade Animations

```html
<div class="fade-in">Fades in</div>
<div class="fade-out">Fades out</div>
```

### Slide Animations

```html
<div class="slide-in-up">Slides in from bottom</div>
<div class="slide-in-down">Slides in from top</div>
<div class="slide-in-left">Slides in from left</div>
<div class="slide-in-right">Slides in from right</div>

<div class="slide-out-up">Slides out to top</div>
<div class="slide-out-down">Slides out to bottom</div>
<div class="slide-out-left">Slides out to left</div>
<div class="slide-out-right">Slides out to right</div>
```

### Scale Animations

```html
<div class="scale-in">Scales up with fade</div>
<div class="scale-out">Scales down with fade</div>
```

### Expand/Collapse

```html
<div class="expand-vertical">Expands vertically</div>
<div class="collapse-vertical">Collapses vertically</div>
```

## Transition Utilities

Apply smooth transitions to elements:

```html
<!-- All properties -->
<div class="transition-all">Transitions everything</div>

<!-- Specific properties -->
<div class="transition-colors">Transitions colors only</div>
<div class="transition-transform">Transitions transform only</div>
<div class="transition-opacity">Transitions opacity only</div>
```

## Duration Modifiers

Override animation duration:

```html
<div class="fade-in duration-short">Fast fade in (150ms)</div>
<div class="fade-in duration-medium">Normal fade in (300ms)</div>
<div class="fade-in duration-long">Slow fade in (500ms)</div>
```

## Animation Control

```html
<!-- Pause animation -->
<div class="animation-paused">Paused</div>

<!-- Infinite loop -->
<div class="fade-in animation-infinite">Loops forever</div>

<!-- Delay animation -->
<div class="fade-in animation-delay-short">Delayed 100ms</div>
<div class="fade-in animation-delay-medium">Delayed 250ms</div>
```

## Custom Animations

### Using CSS

```css
.my-element {
  transition: transform var(--md-sys-motion-duration-medium2)
    var(--md-sys-motion-easing-emphasized-decelerate);
}

.my-element:hover {
  transform: scale(1.05);
}
```

### Using Animation

```css
@keyframes customAnimation {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-enter {
  animation: customAnimation var(--md-sys-motion-duration-medium2)
    var(--md-sys-motion-easing-emphasized-decelerate);
}
```

## Best Practices

### Do's ✓

- **Use appropriate durations** - Short for simple, medium for standard, long for complex
- **Match easing to context** - Decelerate for entering, accelerate for exiting
- **Reduce motion for accessibility** - Respect `prefers-reduced-motion`
- **Keep animations purposeful** - Every animation should communicate something
- **Maintain consistency** - Use the same duration/easing for similar actions

### Don'ts ✗

- **Don't use long durations for simple actions** - Feels sluggish
- **Don't mix multiple easing curves** - Creates jarring experience
- **Don't over-animate** - Too much motion is distracting
- **Don't ignore performance** - Use `transform` and `opacity` for best performance
- **Don't animate layout properties** - Avoid animating `width`, `height`, `top`, `left`

## Accessibility

Always respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is automatically included in the design system.

## Performance Tips

1. **Use GPU-accelerated properties**:
   - `transform` (translate, scale, rotate)
   - `opacity`
   - Avoid: `width`, `height`, `top`, `left`, `margin`

2. **Use `will-change` sparingly**:

   ```css
   .animating-element {
     will-change: transform;
   }
   ```

3. **Remove `will-change` after animation**:
   ```javascript
   element.addEventListener("animationend", () => {
     element.style.willChange = "auto";
   });
   ```

## Examples

See the "Motion & Animation" section in `index.html` for interactive demos of all duration tokens, easing curves, and animation utilities.

## References

- [Material Design 3 - Motion](https://m3.material.io/styles/motion/overview)
- [Material Design 3 - Duration & Easing](https://m3.material.io/styles/motion/easing-and-duration)
- [MDN - CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [MDN - CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

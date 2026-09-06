# Material Design 3 Token Reference

This document provides a comprehensive reference of all Material Design 3 tokens available in the design system.

> **Based on:** [Material Design 3 Design Tokens](https://m3.material.io/foundations/design-tokens/overview)

## Scope

- This document is the source of truth for token taxonomy, naming, and role-level usage guidance.
- It covers token definitions and semantic mapping.
- It does not define motion choreography details; see [motion.md](./motion.md).
- It does not define interaction-state behavior patterns; see [state-layers.md](./state-layers.md).

## Related Foundation Docs

- [Motion & Animation System](./motion.md)
- [State Layers & Ripple Effects](./state-layers.md)

## Terminology Conventions

- `md.ref.*`: reference palette/source values.
- `md.sys.*`: semantic system roles used by components.
- `md.comp.*`: component-scoped token aliases/overrides when needed.
- Prefer logical terms in guidance where applicable (`inline`, `block`, `start`, `end`).

## Start Here

- New to foundations: start with this token reference, then continue to [motion.md](./motion.md), then [state-layers.md](./state-layers.md).

## Table of Contents

- [Color Tokens](#color-tokens)
- [Typography Tokens](#typography-tokens)
- [Elevation Tokens](#elevation-tokens)
- [Motion Tokens](#motion-tokens)
- [State Layer Tokens](#state-layer-tokens)
- [Shape Tokens](#shape-tokens)

---

## Color Tokens

### Tonal Palettes (78 tokens)

MD3 uses tonal palettes with 13 tones per color, providing a complete range from 0 (black) to 100 (white).

#### Primary Palette

```css
--md-ref-palette-primary0     /* #000000 */
--md-ref-palette-primary10
--md-ref-palette-primary20
--md-ref-palette-primary30
--md-ref-palette-primary40
--md-ref-palette-primary50
--md-ref-palette-primary60
--md-ref-palette-primary70
--md-ref-palette-primary80
--md-ref-palette-primary90
--md-ref-palette-primary95
--md-ref-palette-primary99
--md-ref-palette-primary100   /* #FFFFFF */
```

**Similar palettes exist for:**

- `--md-ref-palette-secondary*` (13 tokens)
- `--md-ref-palette-tertiary*` (13 tokens)
- `--md-ref-palette-neutral*` (13 tokens)
- `--md-ref-palette-neutral-variant*` (13 tokens)
- `--md-ref-palette-error*` (13 tokens)

### Semantic Color Roles (40+ tokens)

These tokens map to specific UI purposes and automatically adapt to light/dark themes.

#### Primary Colors

```css
--md-sys-color-primary                  /* Primary brand color */
--md-sys-color-on-primary               /* Text/icons on primary */
--md-sys-color-primary-container        /* Standout containers */
--md-sys-color-on-primary-container     /* Text/icons on primary container */
```

#### Secondary Colors

```css
--md-sys-color-secondary                /* Secondary brand color */
--md-sys-color-on-secondary             /* Text/icons on secondary */
--md-sys-color-secondary-container      /* Less prominent containers */
--md-sys-color-on-secondary-container   /* Text/icons on secondary container */
```

#### Tertiary Colors

```css
--md-sys-color-tertiary                 /* Tertiary brand color */
--md-sys-color-on-tertiary              /* Text/icons on tertiary */
--md-sys-color-tertiary-container       /* Complementary containers */
--md-sys-color-on-tertiary-container    /* Text/icons on tertiary container */
```

#### Error Colors

```css
--md-sys-color-error                    /* Error states */
--md-sys-color-on-error                 /* Text/icons on error */
--md-sys-color-error-container          /* Error container backgrounds */
--md-sys-color-on-error-container       /* Text/icons on error container */
```

#### Surface Colors

```css
--md-sys-color-surface                  /* Default background */
--md-sys-color-on-surface               /* Default text/icons */
--md-sys-color-surface-variant          /* Subtle background variant */
--md-sys-color-on-surface-variant       /* Text on surface variant */

--md-sys-color-surface-dim              /* Dimmed surface */
--md-sys-color-surface-bright           /* Bright surface */

--md-sys-color-surface-container-lowest /* Lowest elevation */
--md-sys-color-surface-container-low    /* Low elevation */
--md-sys-color-surface-container        /* Default elevation */
--md-sys-color-surface-container-high   /* High elevation */
--md-sys-color-surface-container-highest /* Highest elevation */
```

#### Outline Colors

```css
--md-sys-color-outline                  /* Borders, dividers */
--md-sys-color-outline-variant          /* Lighter borders */
```

#### Utility Colors

```css
--md-sys-color-inverse-surface          /* Inverse background (e.g., snackbar) */
--md-sys-color-inverse-on-surface       /* Text on inverse surface */
--md-sys-color-inverse-primary          /* Primary on inverse surface */

--md-sys-color-scrim                    /* Modal overlays */
--md-sys-color-shadow                   /* Shadow color */
```

### Usage Guidelines

**✅ Do:**

- Use semantic tokens (`--md-sys-color-*`) in components
- Use tonal palette (`--md-ref-palette-*`) only for custom themes
- Use `on-*` colors for text/icons on colored backgrounds
- Use container colors for standout elements

**❌ Don't:**

- Hardcode hex values
- Use tonal palette directly in components
- Mix color systems (legacy + MD3)

---

## Spacing Tokens

Use spacing tokens for layout margins, padding, and gaps throughout the design system. Spacing is based on a 4px unit grid.

```css
--ds-space-0: 0; /* No space */
--ds-space-1: 4px; /* Extra small */
--ds-space-2: 8px; /* Small */
--ds-space-3: 12px; /* Small-medium */
--ds-space-4: 16px; /* Medium */
--ds-space-5: 20px; /* Medium-large */
--ds-space-6: 24px; /* Large */
--ds-space-8: 32px; /* Extra large */
--ds-space-10: 40px; /* XX-large */
--ds-space-12: 48px; /* XXX-large */
--ds-space-16: 64px; /* Giant */
--ds-space-20: 80px; /* Huge */
--ds-space-24: 96px; /* Massive */
```

**Use for:** Component padding, gaps in flex/grid, margins between sections, consistent spacing rhythm.

---

## Size Tokens

Use size tokens for interactive control sizing and icon sizing. Component-specific size props should default to these tokens.

```css
--ds-size-icon-sm: 14px; /* Small icon (e.g., status indicators) */
--ds-size-icon-md: 18px; /* Medium icon (default Material icon) */
--ds-size-icon-lg: 24px; /* Large icon (prominent actions) */
--ds-size-control-sm: 32px; /* Small control (compact density) */
--ds-size-control-md: 40px; /* Medium control (standard density) */
--ds-size-control-lg: 48px; /* Large control (spacious density) */
--ds-size-hit-area: 40px; /* Minimum touch target size (WCAG) */
```

**Use for:** Checkbox, radio, switch, buttons, icon sizing, and other interactive components. Defaults match Material Design 3 specifications.

---

## Typography Tokens

### Type Scale (15 styles)

MD3 provides a complete typographic scale with 5 categories.

#### Display - Large, Expressive Headlines

```css
/* Display Large */
--md-sys-typescale-display-large-font-family: "Roboto";
--md-sys-typescale-display-large-font-weight: 400;
--md-sys-typescale-display-large-size: 57px;
--md-sys-typescale-display-large-line-height: 64px;
--md-sys-typescale-display-large-letter-spacing: -0.25px;

/* Display Medium */
--md-sys-typescale-display-medium-size: 45px;
--md-sys-typescale-display-medium-line-height: 52px;

/* Display Small */
--md-sys-typescale-display-small-size: 36px;
--md-sys-typescale-display-small-line-height: 44px;
```

**Use for:** Hero sections, marketing headlines, splash screens

#### Headline - High-Emphasis Text

```css
/* Headline Large */
--md-sys-typescale-headline-large-size: 32px;
--md-sys-typescale-headline-large-line-height: 40px;

/* Headline Medium */
--md-sys-typescale-headline-medium-size: 28px;
--md-sys-typescale-headline-medium-line-height: 36px;

/* Headline Small */
--md-sys-typescale-headline-small-size: 24px;
--md-sys-typescale-headline-small-line-height: 32px;
```

**Use for:** Page titles, section headers, dialog titles

#### Title - Medium-Emphasis Text

```css
/* Title Large */
--md-sys-typescale-title-large-size: 22px;
--md-sys-typescale-title-large-line-height: 28px;

/* Title Medium */
--md-sys-typescale-title-medium-size: 16px;
--md-sys-typescale-title-medium-line-height: 24px;
--md-sys-typescale-title-medium-font-weight: 500;

/* Title Small */
--md-sys-typescale-title-small-size: 14px;
--md-sys-typescale-title-small-line-height: 20px;
--md-sys-typescale-title-small-font-weight: 500;
```

**Use for:** Card titles, list section headers, app bar titles

#### Body - Main Content Text

```css
/* Body Large */
--md-sys-typescale-body-large-size: 16px;
--md-sys-typescale-body-large-line-height: 24px;

/* Body Medium */
--md-sys-typescale-body-medium-size: 14px;
--md-sys-typescale-body-medium-line-height: 20px;

/* Body Small */
--md-sys-typescale-body-small-size: 12px;
--md-sys-typescale-body-small-line-height: 16px;
```

**Use for:** Paragraphs, list items, descriptions

#### Label - UI Text

```css
/* Label Large */
--md-sys-typescale-label-large-size: 14px;
--md-sys-typescale-label-large-line-height: 20px;
--md-sys-typescale-label-large-font-weight: 500;

/* Label Medium */
--md-sys-typescale-label-medium-size: 12px;
--md-sys-typescale-label-medium-line-height: 16px;
--md-sys-typescale-label-medium-font-weight: 500;

/* Label Small */
--md-sys-typescale-label-small-size: 11px;
--md-sys-typescale-label-small-line-height: 16px;
--md-sys-typescale-label-small-font-weight: 500;
```

**Use for:** Button text, tabs, input labels, captions

### Usage Guidelines

**Type Scale Mapping:**

- `<h1>` → Display Large or Headline Large
- `<h2>` → Headline Medium or Large
- `<h3>` → Headline Small or Title Large
- `<h4>` → Title Large or Medium
- `<h5>` → Title Medium or Small
- `<h6>` → Title Small
- `<p>` → Body Large or Medium
- `<button>` → Label Large
- `<caption>` → Body Small or Label Medium

---

## Elevation Tokens

### 6-Level Elevation System

MD3 uses a simplified 6-level elevation system with surface tints for dark mode.

```css
--md-sys-elevation-level0: none;

--md-sys-elevation-level1:
  0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);

--md-sys-elevation-level2:
  0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);

--md-sys-elevation-level3:
  0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15);

--md-sys-elevation-level4:
  0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15);

--md-sys-elevation-level5:
  0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
```

Users can also reference via alias tokens:

```css
--ds-shadow-none: var(--md-sys-elevation-level0);
--ds-shadow-1: var(--md-sys-elevation-level1);
--ds-shadow-2: var(--md-sys-elevation-level2);
--ds-shadow-3: var(--md-sys-elevation-level3);
--ds-shadow-4: var(--md-sys-elevation-level5);
```

### Elevation Mapping

| Level | dp  | Use Case                               |
| ----- | --- | -------------------------------------- |
| 0     | 0   | Default surface, no elevation          |
| 1     | 1   | Elevated button, cards at rest         |
| 2     | 3   | Filled button hover, FAB at rest       |
| 3     | 6   | FAB hover, modal overlays, search bars |
| 4     | 8   | Navigation drawers                     |
| 5     | 12  | Dialog windows                         |

### Dark Mode Surface Tints

In dark mode, elevated surfaces receive a primary color tint:

```css
[data-theme="dark"] {
  /* Level 1: 5% opacity overlay */
  /* Level 2: 8% opacity overlay */
  /* Level 3: 11% opacity overlay */
  /* Level 4: 12% opacity overlay */
  /* Level 5: 14% opacity overlay */
}
```

---

## Motion Tokens

### Duration Tokens (16 tokens)

MD3 provides granular duration tokens for different interaction types.

#### Short Durations (50-200ms)

```css
--md-sys-motion-duration-short1: 50ms; /* Icon state changes */
--md-sys-motion-duration-short2: 100ms; /* Small UI elements, checkboxes */
--md-sys-motion-duration-short3: 150ms; /* Hover state transitions */
--md-sys-motion-duration-short4: 200ms; /* Button state changes */
```

**Use for:** Icon animations, checkbox toggles, hover states, small element transitions

#### Medium Durations (250-400ms)

```css
--md-sys-motion-duration-medium1: 250ms; /* Dropdown menus */
--md-sys-motion-duration-medium2: 300ms; /* Tooltips, snackbars */
--md-sys-motion-duration-medium3: 350ms; /* Small dialogs */
--md-sys-motion-duration-medium4: 400ms; /* Medium dialogs, bottom sheets */
```

**Use for:** Dropdowns, tooltips, small modals, panel transitions

#### Long Durations (450-600ms)

```css
--md-sys-motion-duration-long1: 450ms; /* Navigation drawers */
--md-sys-motion-duration-long2: 500ms; /* Large dialogs */
--md-sys-motion-duration-long3: 550ms; /* Full-screen dialogs */
--md-sys-motion-duration-long4: 600ms; /* Complex page transitions */
```

**Use for:** Drawer animations, large modals, full-screen transitions

#### Extra Long Durations (700-1000ms)

```css
--md-sys-motion-duration-extra-long1: 700ms; /* Page transitions */
--md-sys-motion-duration-extra-long2: 800ms; /* Tab switching with content */
--md-sys-motion-duration-extra-long3: 900ms; /* Complex route changes */
--md-sys-motion-duration-extra-long4: 1000ms; /* Full app state changes */
```

**Use for:** Page transitions, view switching, major state changes

### Easing Curves (4 curves)

#### Standard

```css
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
```

**Use for:** General transitions, movements, state changes

#### Emphasized

```css
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
```

**Note:** Per MD3 specification, Emphasized uses the same curve as Standard. Use this token in code for semantic intent even when the curve is identical; it may differ in future theme customizations.

**Use for:** Important transitions that need extra attention

#### Emphasized Decelerate

```css
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
```

**Use for:** Elements entering the screen, expanding animations

#### Emphasized Accelerate

```css
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
```

**Use for:** Elements exiting the screen, collapsing animations

### Usage Example

```css
.button {
  transition: background-color var(--md-sys-motion-duration-short2)
    var(--md-sys-motion-easing-standard);
}

.dialog {
  animation: slideIn var(--md-sys-motion-duration-medium3)
    var(--md-sys-motion-easing-emphasized-decelerate);
}
```

---

## State Layer Tokens

State layers provide interactive feedback with consistent opacity values.

```css
--md-sys-state-hover-opacity: 0.08; /* Hover/mouseover */
--md-sys-state-focus-opacity: 0.12; /* Focus visible */
--md-sys-state-pressed-opacity: 0.12; /* Active/pressed */
--md-sys-state-dragged-opacity: 0.16; /* Drag and drop */
```

### Usage Pattern

```css
.interactive-element {
  position: relative;
}

.interactive-element::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short2);
}

.interactive-element:hover::before {
  opacity: var(--md-sys-state-hover-opacity);
}

.interactive-element:focus-visible::before {
  opacity: var(--md-sys-state-focus-opacity);
}

.interactive-element:active::before {
  opacity: var(--md-sys-state-pressed-opacity);
}
```

---

## Naming and Migration Policy

This document also serves as the token naming and migration reference.

### Stable Token Prefixes

- `--md-ref-*` for source/reference values.
- `--md-sys-*` for semantic system tokens used by components.
- `--ds-*` for design-system utilities such as spacing, sizing, radius, focus rings, and z-index.

### Preferred Authoring Pattern

- Use semantic tokens in component code whenever possible.
- Use reference tokens for theme construction, not direct component styling.
- Prefer logical CSS properties in docs and examples (`inline-size`, `block-size`, `margin-inline`, `padding-block`).

### Legacy Alias Policy

- Legacy aliases may remain temporarily when they protect compatibility.
- New work should target the canonical names documented here.
- If a token must be renamed, keep backward compatibility for at least two minor versions where practical.

### Migration Guidance

If token names or families change in the future:

1. Announce the change in [ROADMAP.md](./ROADMAP.md).
2. Document the old and new token names here.
3. Prefer additive migrations first, then remove deprecated names in a major cleanup.

### Quick Do / Don't

- Do use `--md-sys-color-*` for component fills, text, and borders.
- Do use `--ds-size-*` and `--ds-space-*` for sizing and layout rhythm.
- Don't hardcode hex values in reusable components.
- Don't introduce new token families when an existing semantic token already fits.

---

## Shape Tokens

### Border Radius Scale

MD3 shape tokens follow a consistent scale:

````

```css
--md-sys-shape-corner-extra-small: 4px; /* Small elements */
--md-sys-shape-corner-small: 8px; /* Buttons, chips */
--md-sys-shape-corner-medium: 12px; /* Cards, inputs */
--md-sys-shape-corner-large: 16px; /* Large surfaces */
--md-sys-shape-corner-extra-large: 28px; /* FABs, dialogs */
--md-sys-shape-corner-full: 9999px; /* Fully rounded pills */
````

### Component Mapping

| Component    | Shape Token                                |
| ------------ | ------------------------------------------ |
| Button       | `--md-sys-shape-corner-small` (8px)        |
| Chip         | `--md-sys-shape-corner-small` (8px)        |
| Card         | `--md-sys-shape-corner-medium` (12px)      |
| Dialog       | `--md-sys-shape-corner-extra-large` (28px) |
| FAB          | `--md-sys-shape-corner-large` (16px)       |
| Text Field   | `--md-sys-shape-corner-small` (8px)        |
| Bottom Sheet | `--md-sys-shape-corner-large` (16px)       |

---

## Additional Resources

- **[MD3 Design Tokens Overview](https://m3.material.io/foundations/design-tokens/overview)**
- **[Color System](https://m3.material.io/styles/color/system/overview)**
- **[Typography Scale](https://m3.material.io/styles/typography/type-scale-tokens)**
- **[Elevation Levels](https://m3.material.io/styles/elevation/overview)**
- **[Motion Guidelines](https://m3.material.io/styles/motion/overview)**

---

**Last Updated:** December 2025
**MD3 Version:** Material Design 3 (2024)

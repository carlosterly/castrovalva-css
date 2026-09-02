# DS Icon

Material Symbols wrapper component for consistent icon rendering, sizing, and accessibility.

## Basic Usage

```html
<ds-icon name="home"></ds-icon>
```

## Attributes

- `name`: icon glyph name.
- `variant`: `outlined`, `filled`, `rounded`, `sharp`.
- `size`: `small`, `medium`, `large`, `xlarge`, or numeric pixel value.
- `color`: CSS color value.
- `weight`: font weight from 100-700.
- `grade`: optical grade from -25 to 200.
- `fill`: 0 or 1.
- `optical-size`: optical size from 20-48.
- `label`: accessible label for meaningful icons.

## Properties

- `name`
- `variant`
- `size`
- `color`
- `weight`
- `grade`
- `fill`
- `opticalSize`
- `label`

## Methods

- `getSizeConfig()`
- `getVariantClass()`
- `getFontVariationSettings()`

## Events

- No custom events are emitted.

## Accessibility

- Decorative icons default to `role="presentation"` and `aria-hidden="true"`.
- Labeled icons use `role="img"` and `aria-label`.

## CSS Parts

- `icon`

## CSS Custom Properties

- `--ds-icon-size-small`
- `--ds-icon-size-medium`
- `--ds-icon-size-large`
- `--ds-icon-size-xlarge`
- `--icon-font-family`

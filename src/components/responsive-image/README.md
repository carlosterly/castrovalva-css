# DS Responsive Image

Responsive image component with lazy loading, art direction support, and error states.

## Basic Usage

```html
<ds-responsive-image
  src="image.jpg"
  alt="Landscape"
  aspect-ratio="4/3"></ds-responsive-image>
```

## Attributes

- `src`: primary image URL.
- `srcset`: responsive source candidates.
- `sizes`: source-size descriptors for srcset.
- `alt`: alternative text.
- `lazy`: enables IntersectionObserver lazy loading.
- `aspect-ratio`: container ratio string (e.g. `16/9`).
- `fit`: `cover`, `contain`, `fill`, `scale-down`, `none`.

## Properties

- `src`
- `srcset`
- `sizes`
- `alt`
- `lazy`
- `aspectRatio`
- `fit`
- `loaded` (read-only)
- `error` (read-only)

## Methods

- `reload()` — resets loading state and retries.

## Events

- `image-loading` with detail `{ src }`
- `image-loaded` with detail `{ src }`
- `image-error` with detail `{ src }`

## Accessibility

- Keeps image semantics with `role="img"`.
- Supports explicit `alt` text for screen readers.
- Error fallback displays readable status text.

## CSS Custom Properties

- `--ds-responsive-image-loading-padding` (default `var(--ds-space-4)`)
- `--ds-responsive-image-loading-gap` (default `var(--ds-space-2)`)
- `--ds-responsive-image-icon-size` (default `var(--ds-size-icon-lg)`)
- `--ds-responsive-image-error-title-margin` (default `var(--ds-space-2)`)
- `--ds-responsive-image-error-message-margin` (default `var(--ds-space-1)`)

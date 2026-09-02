# Carousel

Material Design 3 carousel component for horizontally browsing related content.

## Import

```javascript
import "../src/components/carousel/carousel.js";
```

## Basic Usage

```html
<ds-carousel show-navigation show-indicators>
  <img src="slide1.jpg" alt="Slide 1" />
  <img src="slide2.jpg" alt="Slide 2" />
  <img src="slide3.jpg" alt="Slide 3" />
</ds-carousel>
```

## Attributes

| Attribute            | Type    | Default     | Description                           |
| -------------------- | ------- | ----------- | ------------------------------------- |
| `variant`            | string  | `contained` | `contained`, `uncontained`, or `hero` |
| `show-navigation`    | boolean | `false`     | Shows previous/next buttons           |
| `show-indicators`    | boolean | `false`     | Shows slide indicators                |
| `auto-play`          | boolean | `false`     | Enables autoplay                      |
| `auto-play-interval` | number  | `5000`      | Interval in ms for autoplay           |
| `loop`               | boolean | `false`     | Enables looping across bounds         |

## Properties

| Property           | Type    | Description                            |
| ------------------ | ------- | -------------------------------------- |
| `variant`          | string  | Gets/sets variant                      |
| `showNavigation`   | boolean | Gets/sets navigation visibility        |
| `showIndicators`   | boolean | Gets/sets indicator visibility         |
| `autoPlay`         | boolean | Gets/sets autoplay state               |
| `autoPlayInterval` | number  | Gets/sets autoplay interval            |
| `loop`             | boolean | Gets/sets looping behavior             |
| `currentIndex`     | number  | Current active slide index (read only) |

## Methods

| Method             | Parameters      | Description               |
| ------------------ | --------------- | ------------------------- |
| `next()`           | none            | Moves to next slide       |
| `previous()`       | none            | Moves to previous slide   |
| `goToSlide(index)` | `index: number` | Moves to a specific slide |

## Events

| Event                | Detail             | Description                         |
| -------------------- | ------------------ | ----------------------------------- |
| `ds-carousel:change` | `{ index, total }` | Fired when active slide changes     |
| `ds-carousel:scroll` | `{ index, total }` | Fired while scrolling updates index |

## CSS Parts

- `container`
- `viewport`
- `navigation`
- `nav-button`
- `indicators`
- `indicator`

## Sizing Defaults

Carousel defaults are mapped to global size tokens and spacing tokens:

- `--ds-carousel-nav-button-size: var(--ds-size-control-lg)`
- `--ds-carousel-nav-icon-size: var(--ds-size-icon-lg)`
- `--ds-carousel-gap-contained: var(--ds-space-4)`
- `--ds-carousel-gap-uncontained: var(--ds-space-2)`
- `--ds-carousel-padding-contained: var(--ds-space-4)`

No `size` attribute is added; use existing variant and CSS custom properties.

## Accessibility

- Supports ArrowLeft and ArrowRight keyboard navigation.
- Exposes `role="region"` with `aria-label="Carousel"` on container.
- Navigation buttons use descriptive `aria-label` values.
- Indicators expose tablist and selected-state semantics.

## Demo

See `docs/components/carousel.html`.

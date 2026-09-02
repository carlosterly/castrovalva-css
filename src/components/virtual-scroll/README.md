# Virtual Scroll

Material Design 3 virtual scroll component for high-performance rendering of long fixed-height lists.

## Import

```javascript
import "../src/components/virtual-scroll/virtual-scroll.js";
```

## Basic Usage

```html
<ds-virtual-scroll item-height="48" buffer="5"></ds-virtual-scroll>

<script>
  const virtualScroll = document.querySelector("ds-virtual-scroll");
  virtualScroll.setItems(
    Array.from({ length: 1000 }, (_, i) => ({ label: `Item ${i + 1}` })),
  );
</script>
```

## Attributes

| Attribute       | Type   | Default | Description                               |
| --------------- | ------ | ------- | ----------------------------------------- |
| `item-height`   | number | `48`    | Row height in pixels                      |
| `buffer`        | number | `5`     | Overscan rows before and after viewport   |
| `scroll-offset` | number | `0`     | Initial or programmatic `scrollTop` value |

## Methods

| Method                                  | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| `setItems(items)`                       | Sets list data and resets scroll to top        |
| `getVisibleItems()`                     | Returns currently rendered item slice          |
| `scrollToIndex(index, align = 'start')` | Scrolls to an index (`start`, `center`, `end`) |
| `focusItem(index)`                      | Scrolls to and focuses a rendered row          |

## Events

| Event           | Detail                                                                     | Description                        |
| --------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| `scroll-change` | `{ startIdx, endIdx, scrollTop, visibleCount, viewportCount, totalCount }` | Fired when range or scroll updates |

## Sizing Defaults

The component maps its default row-height sizing to global size tokens:

- `--ds-virtual-scroll-item-height: var(--ds-size-control-lg)`
- `--ds-virtual-scroll-focus-width: var(--ds-focus-ring-width)`
- `--ds-virtual-scroll-focus-color: var(--ds-focus-ring-color)`

No `size` attribute is added; use `item-height` and CSS custom properties for control.

## Accessibility

- Supports Arrow Up/Down, Home, End, Page Up, and Page Down.
- Rendered rows are keyboard focusable.
- Uses listbox semantics for the item container.
- Shows visible focus styling for keyboard navigation.

## Notes

- Virtual scroll assumes fixed row heights for performance.
- Increase `buffer` for smoother fast scrolling.
- Use `scroll-offset` to restore list position after navigation.

## Demo

See `docs/components/virtual-scroll.html`.

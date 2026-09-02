# Card

Material Design 3 card component for grouping related content and actions.

## Source

Implemented in `src/components/ds-card.js` as `<ds-card>`.

## Import

```javascript
import "../src/components/ds-card.js";
```

## Basic Usage

```html
<ds-card variant="elevated">
  <span slot="title">Card Title</span>
  <span slot="subhead">Subhead</span>
  <p>Card content...</p>
  <div slot="actions">
    <ds-button variant="text">Action</ds-button>
  </div>
</ds-card>
```

## Attributes

| Attribute     | Type    | Default    | Description                                       |
| ------------- | ------- | ---------- | ------------------------------------------------- |
| `variant`     | string  | `elevated` | Card variant: `elevated`, `filled`, `outlined`    |
| `interactive` | boolean | `false`    | Enables click/keyboard activation for entire card |

## Properties

| Property      | Type    | Description                |
| ------------- | ------- | -------------------------- |
| `variant`     | string  | Gets/sets card variant     |
| `interactive` | boolean | Gets/sets interactive mode |

## Slots

- `media` - Top media area
- `title` - Title text
- `subhead` - Supporting text
- `header-action` - Optional action in header
- default slot - Main content
- `actions` - Bottom actions row

## Events

| Event           | Detail | Description                              |
| --------------- | ------ | ---------------------------------------- |
| `ds-card:click` | none   | Fired when interactive card is activated |

## Sizing Defaults

Card sizing defaults map to global tokens:

- `--ds-card-touch-target-size: var(--ds-size-hit-area)`
- `--ds-card-padding: var(--ds-space-4)`
- `--ds-card-action-gap: var(--ds-space-2)`

A `size` attribute is not added; use existing variant and CSS custom properties for layout tuning.

## Accessibility

- Interactive cards set `role="button"` and `tabindex="0"`.
- Keyboard activation supported with Enter and Space.
- Maintain meaningful content hierarchy and alt text for media.

## Demo

See `docs/components/card.html`.

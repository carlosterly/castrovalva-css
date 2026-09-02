# Button Group

Material Design 3 button group component for organizing related actions with flexible layout options and consistent spacing.

## Usage

```html
<ds-button-group>
  <ds-button>One</ds-button>
  <ds-button>Two</ds-button>
  <ds-button>Three</ds-button>
</ds-button-group>
```

## API

### Attributes

| Attribute     | Type      | Default        | Description                                                                                  |
| ------------- | --------- | -------------- | -------------------------------------------------------------------------------------------- |
| `variant`     | `string`  | `'connected'`  | Button group variant: `connected` (2dp gap), `standard` (8dp gap), or `segmented` (outlined) |
| `orientation` | `string`  | `'horizontal'` | Layout direction: `horizontal` or `vertical`                                                 |
| `disabled`    | `boolean` | `false`        | Disables all buttons in the group                                                            |
| `selection`   | `string`  | `'none'`       | Selection mode: `none`, `single`, `multi`, or `required`                                     |

### Slots

| Slot      | Description              |
| --------- | ------------------------ |
| (default) | Button elements to group |

### CSS Parts

| Part        | Description                |
| ----------- | -------------------------- |
| `container` | The main container element |

### CSS Custom Properties

| Property                | Default | Description                                    |
| ----------------------- | ------- | ---------------------------------------------- |
| `--ds-button-group-gap` | varies  | Custom gap between buttons (overrides variant) |

### Events

| Event    | Detail      | Description                  |
| -------- | ----------- | ---------------------------- |
| `change` | `{ value }` | Fired when selection changes |

## Accessibility

- **Keyboard Navigation**:
  - `Tab` - Move focus between buttons
  - `Shift+Tab` - Move focus backwards
  - `Enter` / `Space` - Activate focused button
  - `Arrow Keys` - Navigate between buttons (connected variant)

- **ARIA Attributes**:
  - `role="group"` - Identifies button group container
  - `aria-label` - Provides accessible name for the group
  - Child buttons maintain individual ARIA attributes

- **Screen Reader Support**:
  - Announces button group as a grouped collection
  - Announces each button individually with its label
  - Announces disabled state when applied to group
  - Each button's state changes are announced

- **Focus Management**:
  - Individual button focus rings remain visible
  - Connected variant shows visual relationship between buttons
  - Meets WCAG 2.2 focus visible requirements

## Examples

### Horizontal Button Group

```html
<ds-button-group>
  <ds-button>Left</ds-button>
  <ds-button>Center</ds-button>
  <ds-button>Right</ds-button>
</ds-button-group>
```

### Vertical Button Group

```html
<ds-button-group orientation="vertical">
  <ds-button>Top</ds-button>
  <ds-button>Middle</ds-button>
  <ds-button>Bottom</ds-button>
</ds-button-group>
```

### Standard Spacing Variant

```html
<ds-button-group variant="standard">
  <ds-button>Button 1</ds-button>
  <ds-button>Button 2</ds-button>
  <ds-button>Button 3</ds-button>
</ds-button-group>
```

### Disabled Button Group

```html
<ds-button-group disabled>
  <ds-button>Disabled 1</ds-button>
  <ds-button>Disabled 2</ds-button>
  <ds-button>Disabled 3</ds-button>
</ds-button-group>
```

### Segmented Variant

```html
<ds-button-group variant="segmented">
  <ds-button>One</ds-button>
  <ds-button>Two</ds-button>
  <ds-button>Three</ds-button>
</ds-button-group>
```

### Mixed Button Variants

```html
<ds-button-group>
  <ds-button variant="filled">Filled</ds-button>
  <ds-button variant="outlined">Outlined</ds-button>
  <ds-button variant="text">Text</ds-button>
</ds-button-group>
```

### Connected Selection (Single)

```html
<ds-button-group selection="single">
  <ds-button value="day">Day</ds-button>
  <ds-button value="week">Week</ds-button>
  <ds-button value="month">Month</ds-button>
</ds-button-group>
```

### Connected Selection (Multi)

```html
<ds-button-group selection="multi">
  <ds-button value="bold">Bold</ds-button>
  <ds-button value="italic">Italic</ds-button>
  <ds-button value="underline">Underline</ds-button>
</ds-button-group>
```

## Styling with CSS

### Custom Gap Between Buttons

```css
ds-button-group {
  --ds-button-group-gap: 12px;
}
```

### Vertical Spacing

```css
ds-button-group[orientation="vertical"] {
  gap: 16px;
}
```

### Full Width Button Group

```css
ds-button-group {
  width: 100%;
}

ds-button-group ds-button {
  flex: 1;
}
```

## Material Design 3 Specification

[Button - Material Design 3](https://m3.material.io/components/buttons)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration from M2

Key differences from Material Design 2:

- New color system with dynamic color support
- Simplified spacing model (2dp vs 8dp instead of multiple options)
- Updated shape tokens for button corners
- Enhanced keyboard navigation support
- Improved accessibility with ARIA attributes

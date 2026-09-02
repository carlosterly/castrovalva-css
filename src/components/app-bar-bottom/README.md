# Bottom App Bar

Material Design 3 bottom app bar for primary and secondary actions at the bottom of the screen.

## Usage

```html
<ds-app-bar-bottom>
  <button slot="actions" aria-label="Search" class="material-symbols-outlined">
    search
  </button>
  <button slot="actions" aria-label="More" class="material-symbols-outlined">
    more_vert
  </button>
</ds-app-bar-bottom>
```

### With FAB Cutout

```html
<ds-app-bar-bottom variant="with-fab">
  <button
    slot="fab"
    aria-label="Add"
    class="fab-button material-symbols-outlined">
    add
  </button>
  <button
    slot="actions"
    aria-label="Favorites"
    class="material-symbols-outlined">
    favorite
  </button>
  <button slot="actions" aria-label="Music" class="material-symbols-outlined">
    music_note
  </button>
</ds-app-bar-bottom>
```

### Programmatic Handling

```javascript
const bar = document.querySelector("ds-app-bar-bottom");
bar.querySelectorAll('[slot="actions"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("Action clicked:", btn.getAttribute("aria-label"));
  });
});
```

## API

### Attributes

| Attribute | Type     | Default      | Description                              |
| --------- | -------- | ------------ | ---------------------------------------- |
| `variant` | `string` | `'standard'` | Layout variant: `standard` or `with-fab` |

### Events

| Event | Detail | Description                                 |
| ----- | ------ | ------------------------------------------- |
| —     | —      | No custom events; listen to slotted buttons |

### Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `actions` | Trailing action buttons (right-aligned)          |
| `fab`     | Center FAB element (only for `with-fab` variant) |

### CSS Parts

| Part        | Description                        |
| ----------- | ---------------------------------- |
| `container` | App bar container                  |
| `fab-area`  | FAB cutout area (with-fab variant) |
| `actions`   | Trailing actions region            |

### CSS Custom Properties

| Property              | Default                          | Description          |
| --------------------- | -------------------------------- | -------------------- |
| `--ds-app-bar-bg`     | `var(--md-sys-color-surface)`    | Background color     |
| `--ds-app-bar-color`  | `var(--md-sys-color-on-surface)` | Foreground color     |
| `--ds-app-bar-shadow` | `0 4px 12px rgba(0,0,0,0.12)`    | Box shadow/elevation |

## Accessibility

- **Keyboard Navigation**: Tab to focus; Enter/Space to activate actions
- **ARIA**: Uses `role="contentinfo"`; ensure action/FAB buttons have `aria-label`
- **Screen Readers**: Announces button labels via `aria-label`
- **Focus Indicators**: Visible focus rings/states follow MD3 guidance

## MD3 Specification

[Bottom App Bar — Material Design 3](https://m3.material.io/components/bottom-app-bar)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### Standard

```html
<ds-app-bar-bottom>
  <button slot="actions" aria-label="Delete" class="material-symbols-outlined">
    delete
  </button>
  <button slot="actions" aria-label="Edit" class="material-symbols-outlined">
    edit
  </button>
</ds-app-bar-bottom>
```

### With FAB

```html
<ds-app-bar-bottom variant="with-fab">
  <button
    slot="fab"
    aria-label="Create"
    class="fab-button material-symbols-outlined">
    create
  </button>
  <button
    slot="actions"
    aria-label="Settings"
    class="material-symbols-outlined">
    settings
  </button>
</ds-app-bar-bottom>
```

### Logging Actions

```javascript
const bar = document.getElementById("my-bar");
bar.querySelectorAll('[slot="actions"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.getAttribute("aria-label");
    document.getElementById("log").textContent = `Action: ${label}`;
  });
});
```

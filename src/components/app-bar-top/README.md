# Top App Bar

Material Design 3 top app bar component for displaying application title, navigation, and actions with support for multiple layout variants.

## Usage

```html
<ds-app-bar-top title="Mail" nav-icon="menu">
  <button slot="actions" aria-label="Search" class="material-symbols-outlined">
    search
  </button>
  <button slot="actions" aria-label="More" class="material-symbols-outlined">
    more_vert
  </button>
</ds-app-bar-top>
```

### Medium Variant with Subtitle

```html
<ds-app-bar-top
  variant="medium"
  title="Project"
  subtitle="Q4 plan"
  nav-icon="arrow_back">
  <button slot="actions" aria-label="Share" class="material-symbols-outlined">
    share
  </button>
</ds-app-bar-top>
```

### Large Variant with Custom Navigation

```html
<ds-app-bar-top variant="large" title="Analytics" subtitle="Weekly Performance">
  <button slot="navigation" aria-label="Menu" class="material-symbols-outlined">
    menu
  </button>
  <button slot="actions" aria-label="Refresh" class="material-symbols-outlined">
    refresh
  </button>
  <button slot="actions" aria-label="Export" class="material-symbols-outlined">
    file_download
  </button>
</ds-app-bar-top>
```

## API

### Attributes

| Attribute  | Type      | Default   | Description                                             |
| ---------- | --------- | --------- | ------------------------------------------------------- |
| `variant`  | `string`  | `'small'` | Layout variant: `small`, `center`, `medium`, `large`    |
| `title`    | `string`  | —         | Title text (fallback when no `slot="title"`)            |
| `subtitle` | `string`  | —         | Subtitle text (medium/large only; hidden when scrolled) |
| `nav-icon` | `string`  | —         | Material Symbol name for fallback navigation button     |
| `scrolled` | `boolean` | `false`   | Collapses to small height and hides subtitle            |

### Properties

The component reflects attributes as properties. Set `scrolled` programmatically:

```javascript
const appBar = document.querySelector("ds-app-bar-top");
appBar.scrolled = true; // Collapse the app bar
appBar.variant = "medium"; // Change variant
```

### Events

| Event                   | Detail | Description                               |
| ----------------------- | ------ | ----------------------------------------- |
| `ds-app-bar:navigation` | —      | Fired when fallback nav button is clicked |

### Slots

| Slot         | Description                                        |
| ------------ | -------------------------------------------------- |
| `navigation` | Leading navigation control (drawer, back button)   |
| `actions`    | Trailing action buttons                            |
| `title`      | Custom title content (overrides `title` attribute) |
| `subtitle`   | Custom subtitle (medium/large only)                |
| (default)    | Title text fallback                                |

### CSS Parts

| Part         | Description                |
| ------------ | -------------------------- |
| `container`  | App bar container          |
| `navigation` | Leading navigation region  |
| `title`      | Title text wrapper         |
| `subtitle`   | Subtitle text              |
| `actions`    | Trailing actions region    |
| `nav-button` | Fallback navigation button |

### CSS Custom Properties

| Property                       | Default                     | Description           |
| ------------------------------ | --------------------------- | --------------------- |
| `--ds-app-bar-bg`              | `--md-sys-color-surface`    | Background color      |
| `--ds-app-bar-color`           | `--md-sys-color-on-surface` | Text color            |
| `--ds-app-bar-shadow`          | `none`                      | Box shadow/elevation  |
| `--ds-app-bar-hover-color`     | `--md-sys-color-on-surface` | Hover state color     |
| `--ds-app-bar-hover-opacity`   | `0.08`                      | Hover state opacity   |
| `--ds-app-bar-pressed-opacity` | `0.12`                      | Pressed state opacity |

## Accessibility

### Keyboard Navigation

- **Tab** – Focus navigation and action buttons in order
- **Enter / Space** – Activate focused button
- Navigation and action slots should contain focusable controls (buttons, links)

### Screen Reader Support

- App bar has `role="banner"` to identify it as a page landmark
- Fallback navigation button has `aria-label="Navigation"`
- Custom navigation/action buttons must have proper `aria-label` attributes
- Title and subtitle are read as static text content

### Focus Management

- Visible focus indicators on all interactive controls
- Fallback nav button includes Material Design 3 focus ring
- Custom slotted controls inherit focus styling from parent theme

### High Contrast Mode

- All text meets WCAG AA contrast requirements (4.5:1 minimum)
- Focus indicators remain visible in Windows High Contrast mode
- Icons scale appropriately with system text size

## Examples

### Center-Aligned Title

```html
<ds-app-bar-top variant="center" title="Gallery" nav-icon="arrow_back">
  <button
    slot="actions"
    aria-label="Favorite"
    class="material-symbols-outlined">
    favorite
  </button>
</ds-app-bar-top>
```

### Scrollable Content with Collapse

```html
<ds-app-bar-top
  id="app-bar"
  variant="large"
  title="Documents"
  subtitle="Recent">
  <button slot="actions" aria-label="Search" class="material-symbols-outlined">
    search
  </button>
</ds-app-bar-top>

<script>
  const appBar = document.getElementById("app-bar");
  document.addEventListener("scroll", () => {
    appBar.scrolled = window.scrollY > 0;
  });
</script>
```

### Custom Navigation Drawer

```html
<ds-app-bar-top title="Menu" nav-icon="menu">
  <button
    slot="navigation"
    aria-label="Close drawer"
    class="material-symbols-outlined">
    menu_open
  </button>
  <button
    slot="actions"
    aria-label="Settings"
    class="material-symbols-outlined">
    settings
  </button>
</ds-app-bar-top>
```

## Material Design 3 Specification

This component follows the [Material Design 3 Top App Bar guidelines](https://m3.material.io/components/top-app-bar/overview).

- **Small**: 64px height, default layout
- **Center**: Title centered, 64px height
- **Medium**: Title at bottom, 112px collapsed height
- **Large**: Large title area, 152px collapsed height
- **Scroll behavior**: Collapses to small height when `scrolled` attribute is applied

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari 16+
- Edge (latest)

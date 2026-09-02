# Navigation Drawer

Material Design 3 navigation drawer for app navigation. Provides modal and standard variants supporting both mobile and desktop experiences with smooth animations, focus management, and accessibility features.

## Usage

```html
<ds-navigation-drawer variant="modal">
  <div slot="header">
    <h3>Menu</h3>
  </div>
  <ds-nav-item icon="home" active>Home</ds-nav-item>
  <ds-nav-item icon="search">Search</ds-nav-item>
  <ds-nav-item icon="settings">Settings</ds-nav-item>
</ds-navigation-drawer>
```

## API

### Navigation Drawer Attributes

| Attribute     | Type      | Default                      | Description                                  |
| ------------- | --------- | ---------------------------- | -------------------------------------------- |
| `variant`     | `string`  | `modal`                      | Drawer type: `modal` (overlay) or `standard` |
| `position`    | `string`  | `left`                       | Drawer position: `left` or `right`           |
| `open`        | `boolean` | `false`                      | Opens/closes the drawer                      |
| `persistent`  | `boolean` | `false`                      | Persists drawer state in localStorage        |
| `storage-key` | `string`  | `ds-navigation-drawer-state` | Custom localStorage key                      |

### Navigation Drawer Methods

| Method     | Description          |
| ---------- | -------------------- |
| `show()`   | Opens the drawer     |
| `close()`  | Closes the drawer    |
| `toggle()` | Toggles drawer state |

### Navigation Drawer Events

| Event                        | Detail | Description              |
| ---------------------------- | ------ | ------------------------ |
| `ds-navigation-drawer:open`  | —      | Fired when drawer opens  |
| `ds-navigation-drawer:close` | —      | Fired when drawer closes |

### Navigation Drawer Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| (default) | Main content area (typically nav items) |
| `header`  | Optional header content                 |

### Navigation Drawer CSS Parts

| Part        | Description                |
| ----------- | -------------------------- |
| `container` | Main drawer container      |
| `scrim`     | Overlay/scrim (modal only) |
| `content`   | Content area for nav items |
| `header`    | Header slot area           |

### Navigation Item Attributes

| Attribute  | Type      | Default | Description                |
| ---------- | --------- | ------- | -------------------------- |
| `href`     | `string`  | `''`    | Link destination           |
| `icon`     | `string`  | `''`    | Material Symbol icon name  |
| `active`   | `boolean` | `false` | Highlights as current page |
| `disabled` | `boolean` | `false` | Disables the item          |

### Navigation Item Events

| Event               | Detail                              | Description             |
| ------------------- | ----------------------------------- | ----------------------- |
| `ds-nav-item:click` | `{ href: string, active: boolean }` | Fired when item clicked |

### CSS Custom Properties

| Property                       | Default               | Description         |
| ------------------------------ | --------------------- | ------------------- |
| `--ds-navigation-drawer-width` | `360px`               | Drawer width        |
| `--md-sys-z-index-drawer`      | `100`                 | Z-index stacking    |
| `--md-sys-color-scrim`         | `rgba(0, 0, 0, 0.32)` | Scrim overlay color |

## Examples

### Modal Drawer (Mobile)

```html
<ds-button id="open-drawer">Open Menu</ds-button>

<ds-navigation-drawer id="drawer" variant="modal">
  <div slot="header">
    <h3 style="margin: 0">Navigation</h3>
  </div>
  <ds-nav-item icon="home" active>Home</ds-nav-item>
  <ds-nav-item icon="search">Search</ds-nav-item>
  <ds-nav-item icon="settings">Settings</ds-nav-item>
</ds-navigation-drawer>

<script>
  document.getElementById("open-drawer").addEventListener("click", () => {
    document.getElementById("drawer").show();
  });
</script>
```

### Standard Drawer (Desktop)

```html
<div style="display: flex;">
  <ds-navigation-drawer variant="standard" open>
    <div slot="header">
      <h3 style="margin: 0">Navigation</h3>
    </div>
    <ds-nav-item icon="dashboard" active>Dashboard</ds-nav-item>
    <ds-nav-item icon="analytics">Analytics</ds-nav-item>
    <ds-nav-item icon="reports">Reports</ds-nav-item>
  </ds-navigation-drawer>

  <div style="flex: 1; padding: 24px;">
    <h1>Main Content</h1>
  </div>
</div>
```

### Interactive Navigation with State

```javascript
const drawer = document.getElementById("drawer");
const navItems = drawer.querySelectorAll("ds-nav-item");

navItems.forEach((item) => {
  item.addEventListener("ds-nav-item:click", (e) => {
    // Remove active from all items
    navItems.forEach((nav) => nav.removeAttribute("active"));
    // Set clicked item as active
    item.setAttribute("active", "");
    // Auto-close modal drawer
    if (drawer.getAttribute("variant") === "modal") {
      drawer.close();
    }
  });
});
```

### Right-Positioned Drawer

```html
<ds-navigation-drawer id="right-drawer" variant="modal" position="right">
  <div slot="header">
    <h3 style="margin: 0">Menu</h3>
  </div>
  <ds-nav-item icon="notifications">Notifications</ds-nav-item>
  <ds-nav-item icon="account_circle">Account</ds-nav-item>
  <ds-nav-item icon="logout">Sign Out</ds-nav-item>
</ds-navigation-drawer>
```

## Accessibility

### Keyboard Navigation

- **Tab** - Move focus to next focusable element within drawer
- **Shift+Tab** - Move focus to previous focusable element
- **Escape** - Close modal drawer and restore previous focus
- **Arrow Keys** - Navigate within nav items (if supported by item)
- **Enter/Space** - Activate focused nav item

### ARIA Attributes

- `role="navigation"` - Identifies drawer as navigation region
- `aria-hidden="true/false"` - Hides drawer from screen readers when closed
- `aria-current="page"` - Marks active navigation item
- `aria-disabled="true"` - Marks disabled navigation items
- `aria-label` - Provides accessible name for navigation region

### Screen Reader Support

- Announces drawer open/close events
- Announces navigation item labels and icon names
- Announces active state with `aria-current="page"`
- Announces disabled state with `aria-disabled`
- Provides context for modal scrim overlay

### Focus Management

- **Focus Trap** (Modal): Focus remains within drawer when open
- **Focus Restoration** (Modal): Returns focus to trigger button when closed
- **Focus Indicators**: Visible 2px outline meeting WCAG 2.2 requirements
- **Initial Focus**: First focusable element receives focus when drawer opens

## Persistent State

Save drawer state across page reloads:

```html
<ds-navigation-drawer
  variant="standard"
  persistent
  storage-key="app-nav-drawer-state">
  <!-- Content -->
</ds-navigation-drawer>
```

## MD3 Specification

[Navigation Drawer - Material Design 3](https://m3.material.io/components/navigation-drawer)

## Browser Support

| Browser | Minimum Version | Notes        |
| ------- | --------------- | ------------ |
| Chrome  | 90+             | Full support |
| Firefox | 88+             | Full support |
| Safari  | 14+             | Full support |
| Edge    | 90+             | Full support |

## Implementation Notes

### Variants

**Modal Drawer**: Recommended for mobile/tablet layouts. Overlays content with a semi-transparent scrim (32% opacity per MD3 spec). Includes focus trap and Escape key handling.

**Standard Drawer**: Recommended for desktop layouts. Persistent side drawer that takes up space in the layout. No scrim overlay.

### Animation

- Drawer opens/closes with smooth slide animation (300ms)
- Uses Material Design 3 easing curves for natural motion
- Scrim fades in/out with opacity transition

### Positioning

- **Left** (default): Drawer slides in from left edge
- **Right**: Drawer slides in from right edge
- Both positions work with modal and standard variants

### Custom Width

Override default 360px width with CSS custom property:

```html
<ds-navigation-drawer style="--ds-navigation-drawer-width: 280px;">
  <!-- Compact drawer -->
</ds-navigation-drawer>
```

## Migration from M2

Key differences if upgrading from Material Design 2:

- New `position` attribute for left/right placement (M2 only supported left)
- Scrim uses 32% opacity (matches M3 specification)
- Focus trap automatically enabled for modal variant
- Persistent state uses `persistent` attribute instead of prop
- Event names changed to use custom event format: `ds-navigation-drawer:open`

# Advanced Menu

Material Design 3 advanced menu component for mega menus and cascading hierarchical submenus with intelligent positioning and keyboard navigation.

## Usage

```html
<ds-advanced-menu variant="menu" placement="bottom-start">
  <ds-button slot="trigger" variant="filled">Menu</ds-button>
  <div slot="menu" role="menu">
    <button type="button" role="menuitem">File</button>
    <button type="button" role="menuitem" aria-haspopup="menu">
      Share
      <span class="material-symbols-outlined">chevron_right</span>
    </button>
    <div role="menu" style="display: none">
      <button type="button" role="menuitem">Copy link</button>
      <button type="button" role="menuitem">Invite</button>
    </div>
  </div>
</ds-advanced-menu>
```

## API

### Attributes

| Attribute             | Type      | Default        | Description                                                                          |
| --------------------- | --------- | -------------- | ------------------------------------------------------------------------------------ |
| `variant`             | `string`  | `menu`         | Menu pattern: `menu` (cascading) or `mega` (multi-column)                            |
| `placement`           | `string`  | `bottom-start` | Anchor position with auto-flip: `bottom-start`, `top-start`, `bottom-end`, `top-end` |
| `offset`              | `number`  | `8`            | Pixel gap between trigger and menu surface                                           |
| `hover-open`          | `boolean` | `false`        | Enable hover intent for desktop triggers                                             |
| `open-delay`          | `number`  | `120`          | Milliseconds to wait before opening on hover                                         |
| `close-delay`         | `number`  | `180`          | Milliseconds to wait before closing on hover exit                                    |
| `submenu-open-delay`  | `number`  | `120`          | Delay for opening child submenus on hover                                            |
| `submenu-close-delay` | `number`  | `200`          | Delay/tolerance for closing child submenus on hover                                  |
| `collision-padding`   | `number`  | `12`           | Viewport padding in pixels for flip/fallback calculations                            |
| `open`                | `boolean` | `false`        | Reflective attribute indicating open state                                           |

### Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| `trigger` | Trigger element (button, link) that opens the menu     |
| `menu`    | Main menu content; for cascading, use nested menus     |
| `submenu` | Optional nested menu content for hierarchical patterns |

### Events

| Event           | Detail                        | Description                                                 |
| --------------- | ----------------------------- | ----------------------------------------------------------- |
| `menu-open`     | `{ anchor, placement }`       | Fired when root menu opens                                  |
| `menu-close`    | `{ reason }`                  | Fired when menu closes (click, escape, blur, outside-click) |
| `submenu-open`  | `{ item, level, breadcrumb }` | Fired when child submenu opens                              |
| `submenu-close` | `{ item, level }`             | Fired when child submenu closes                             |
| `menu-action`   | `{ value, meta, breadcrumb }` | Fired when actionable item activated                        |

### CSS Parts

| Part          | Description                           |
| ------------- | ------------------------------------- |
| `panel`       | Main menu surface container           |
| `backdrop`    | Scrim overlay for dismissal           |
| `submenu`     | Nested submenu container              |
| `breadcrumb`  | Breadcrumb navigation display         |
| `back-button` | Auto-generated back button in submenu |

### CSS Custom Properties

| Property                         | Default                               | Description              |
| -------------------------------- | ------------------------------------- | ------------------------ |
| `--md-sys-color-surface`         | `var(--md-sys-color-surface)`         | Menu background color    |
| `--md-sys-color-on-surface`      | `var(--md-sys-color-on-surface)`      | Menu text color          |
| `--md-sys-color-scrim`           | `rgba(0, 0, 0, 0.32)`                 | Backdrop overlay opacity |
| `--md-sys-color-primary`         | `var(--md-sys-color-primary)`         | Highlight/ripple color   |
| `--md-sys-color-outline-variant` | `var(--md-sys-color-outline-variant)` | Divider color            |

## Keyboard Navigation

- **Arrow Up/Down** - Navigate menu items within current level
- **Arrow Right** - Open submenu for parent item (respects RTL)
- **Arrow Left** - Close current submenu and return to parent
- **Home** - Jump to first item in menu
- **End** - Jump to last item in menu
- **Enter / Space** - Activate focused menu item
- **Escape** - Close submenu or root menu (with breadcrumb awareness)
- **Typeahead** - Jump to item starting with typed character (optional, depends on implementation)

## Accessibility

- **Keyboard Navigation**:
  - Full arrow key support (↑↓←→) for navigating between levels
  - Home/End jump to first/last items
  - Enter/Space activates items
  - Escape closes submenu-aware (breadcrumb tracking)
  - Typeahead support for jumping to items by first letter

- **ARIA Attributes**:
  - `role="menu"` and `role="menuitem"` on elements
  - `aria-expanded` reflects open/closed state on trigger
  - `aria-haspopup="menu"` on parent items with submenus
  - `aria-hidden="true/false"` on menu surfaces
  - Automatic `aria-label` announcements for breadcrumb navigation

- **Screen Reader Support**:
  - Announces menu open/close state
  - Announces breadcrumb path through cascading submenus
  - Auto-generated back buttons announced as "Back: parent-item-name"
  - Menu items announced with their label and icon names filtered

- **Focus Management**:
  - Focus trap active while menu open
  - Focus returns to trigger when menu closes
  - Focus visible indicators per WCAG 2.2 AA (using `--md-sys-color-primary`)
  - Visible focus ring with 2px outline and 2px offset

## Examples

### Basic Cascading Menu

```html
<ds-advanced-menu variant="menu" placement="bottom-start">
  <ds-button slot="trigger" variant="outlined">File Menu</ds-button>
  <div slot="menu" role="menu" style="display: grid; gap: 6px">
    <button type="button" role="menuitem" data-menu-action="new">
      <span class="material-symbols-outlined">note_add</span>
      New File
    </button>
    <button type="button" role="menuitem" aria-haspopup="menu">
      <span class="material-symbols-outlined">share</span>
      Share
      <span class="material-symbols-outlined">chevron_right</span>
    </button>
    <div role="menu" style="display: none">
      <button type="button" role="menuitem">Copy link</button>
      <button type="button" role="menuitem">Invite teammate</button>
    </div>
  </div>
</ds-advanced-menu>
```

### Mega Menu (Multi-Column)

```html
<ds-advanced-menu variant="mega" placement="bottom-start">
  <ds-button slot="trigger" variant="filled">Products</ds-button>
  <div
    slot="menu"
    role="menu"
    style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px">
    <section>
      <h3>Platform</h3>
      <ul role="presentation">
        <li role="menuitem">Components</li>
        <li role="menuitem">Design Tokens</li>
        <li role="menuitem">Theming</li>
      </ul>
    </section>
    <section>
      <h3>Data</h3>
      <ul role="presentation">
        <li role="menuitem">Tables</li>
        <li role="menuitem">Analytics</li>
      </ul>
    </section>
  </div>
</ds-advanced-menu>
```

### With Hover Intent (Desktop)

```html
<ds-advanced-menu
  variant="menu"
  placement="bottom-start"
  hover-open
  open-delay="120"
  close-delay="180">
  <ds-button slot="trigger" variant="text">Hover me</ds-button>
  <div slot="menu" role="menu">
    <!-- Menu items -->
  </div>
</ds-advanced-menu>
```

### Event Handling

```javascript
const menu = document.querySelector("ds-advanced-menu");

menu.addEventListener("menu-open", (e) => {
  console.log("Menu opened at:", e.detail.placement);
});

menu.addEventListener("submenu-open", (e) => {
  console.log("Submenu level:", e.detail.level, "Path:", e.detail.breadcrumb);
});

menu.addEventListener("menu-action", (e) => {
  console.log("Action triggered:", e.detail.value);
  console.log("Breadcrumb path:", e.detail.breadcrumb);
});

menu.addEventListener("menu-close", (e) => {
  console.log("Menu closed. Reason:", e.detail.reason);
});
```

## Features

- **Mega Menu Pattern** - Multi-column layouts for content-rich menus
- **Cascading Submenus** - Hierarchical nested menus with automatic positioning
- **Smart Positioning** - Auto-flips and repositions to stay within viewport
- **Breadcrumb Navigation** - Visual path through menu hierarchy
- **Auto Back Buttons** - Automatically generated with Material Symbols icons
- **Keyboard Navigation** - Full arrow/escape support with breadcrumb awareness
- **Hover Intent** - Desktop hover-to-open with configurable delays
- **Ripple Effects** - Visual feedback on menu items with Material Design animation
- **Focus Management** - Proper focus trap and restoration
- **RTL Support** - Right-to-left layout aware arrow navigation

## CSS Anchor Positioning

The component uses modern CSS Anchor Positioning API when available (with fallback):

```css
--ds-advanced-menu-trigger /* Anchor point for positioning */
position-anchor: --ds-advanced-menu-trigger;
inset: anchor(bottom start) var(--offset);
```

Fallback positioning uses fixed positioning with calculated offsets for browsers without Anchor Positioning support.

## MD3 Specification

[Menu - Material Design 3](https://m3.material.io/components/menus)  
[Navigation - Material Design 3](https://m3.material.io/foundations/navigation)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** CSS Anchor Positioning (Chrome 125+, Safari 18+) provides optimal positioning. Other browsers use fallback fixed positioning.

## Migration Notes

This component supersedes simple menu patterns by providing:

- Hierarchical submenu support (not available in basic menus)
- Intelligent viewport collision detection
- Breadcrumb-aware keyboard navigation
- Auto-generated back buttons for cascading menus
- Ripple effect integration for visual feedback

## Related Components

- [Button](../button) - Trigger elements
- [Menu](../menu) - Base menu component
- [Navigation Drawer](../navigation-drawer) - Related navigation pattern

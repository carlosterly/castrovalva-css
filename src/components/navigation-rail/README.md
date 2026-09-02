# Navigation Rail

Material Design 3 vertical navigation for switching between top-level destinations on tablet and desktop. Supports 3-7 destinations with optional header and FAB.

## Usage

```html
<ds-navigation-rail>
  <ds-navigation-rail-item icon="home" value="home" active
    >Home</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="search" value="search"
    >Search</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="favorite" value="favorites"
    >Favorites</ds-navigation-rail-item
  >
</ds-navigation-rail>
```

### With Header and FAB

```html
<ds-navigation-rail>
  <div slot="header" aria-hidden="true">☰</div>
  <ds-navigation-rail-item icon="home" value="home" active
    >Home</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="work" value="work"
    >Work</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="person" value="profile"
    >Profile</ds-navigation-rail-item
  >
  <ds-fab slot="fab" icon="add"></ds-fab>
</ds-navigation-rail>
```

### Event Handling

```javascript
const rail = document.querySelector("ds-navigation-rail");

rail.addEventListener("ds-navigation-rail:select", (e) => {
  console.log("Selected:", e.detail.value);
  console.log("Label:", e.detail.label);
  navigateTo(e.detail.value);
});
```

## API

### DSNavigationRail

The container component for navigation rail destinations.

#### Attributes

| Attribute | Type | Default | Description                                  |
| --------- | ---- | ------- | -------------------------------------------- |
| —         | —    | —       | No attributes; container manages child items |

#### Events

| Event                       | Detail                             | Description                          |
| --------------------------- | ---------------------------------- | ------------------------------------ |
| `ds-navigation-rail:select` | `{ value: string, label: string }` | Fired when a destination is selected |

#### Slots

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| (default) | Container for `ds-navigation-rail-item` elements   |
| `header`  | Optional content above destinations (logo, menu)   |
| `fab`     | Optional floating action button below destinations |

#### CSS Parts

| Part           | Description                   |
| -------------- | ----------------------------- |
| `container`    | The navigation rail container |
| `destinations` | Wrapper for destination items |

### DSNavigationRailItem

Individual navigation destination item.

#### Attributes

| Attribute  | Type      | Default     | Description                             |
| ---------- | --------- | ----------- | --------------------------------------- |
| `value`    | `string`  | `undefined` | Value associated with this destination  |
| `icon`     | `string`  | `undefined` | Material Symbol icon name               |
| `label`    | `string`  | `undefined` | Destination label (or use slot content) |
| `active`   | `boolean` | `false`     | Whether this destination is active      |
| `disabled` | `boolean` | `false`     | Whether this destination is disabled    |
| `badge`    | `string`  | `undefined` | Badge content (number or text)          |

#### Events

| Event                           | Detail                             | Description                                  |
| ------------------------------- | ---------------------------------- | -------------------------------------------- |
| `ds-navigation-rail-item:click` | `{ value: string, label: string }` | Fired when item is clicked (if not disabled) |

#### Slots

| Slot      | Description        |
| --------- | ------------------ |
| (default) | Label text content |

#### CSS Parts

| Part        | Description                      |
| ----------- | -------------------------------- |
| `container` | The item container button        |
| `icon`      | The icon element                 |
| `label`     | The label text                   |
| `indicator` | The active indicator             |
| `badge`     | The badge element (when present) |

### CSS Custom Properties

| Property                               | Default                                   | Description                 |
| -------------------------------------- | ----------------------------------------- | --------------------------- |
| `--ds-navigation-rail-hover-color`     | `var(--md-sys-color-on-surface, #1D1B20)` | Hover state layer color     |
| `--ds-navigation-rail-hover-opacity`   | `0.08`                                    | Hover state layer opacity   |
| `--ds-navigation-rail-pressed-opacity` | `0.12`                                    | Pressed state layer opacity |
| `--ds-navigation-rail-active-bg`       | `var(--md-sys-color-secondary-container)` | Active indicator background |

## JavaScript API

### Listening to Selection Events

```javascript
const rail = document.querySelector("ds-navigation-rail");

rail.addEventListener("ds-navigation-rail:select", (e) => {
  console.log("Selected:", e.detail.value);
  console.log("Label:", e.detail.label);
  navigateTo(e.detail.value);
});
```

### Programmatically Setting Active Item

```javascript
const items = document.querySelectorAll("ds-navigation-rail-item");

// Set second item as active
items[1].active = true;
```

### Updating Badges Dynamically

```javascript
const notificationsItem = document.querySelector('[value="notifications"]');

// Update badge count
notificationsItem.badge = "5";

// Remove badge
notificationsItem.badge = "";
```

## Styling

### Using CSS Parts

```css
/* Customize the rail container */
ds-navigation-rail::part(container) {
  background: var(--md-sys-color-surface-container);
  border-right: 2px solid var(--md-sys-color-primary);
}

/* Customize item appearance */
ds-navigation-rail-item::part(container) {
  padding: 16px;
}

/* Customize icon */
ds-navigation-rail-item::part(icon) {
  font-size: 28px;
}

/* Customize active indicator */
ds-navigation-rail-item::part(indicator) {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

/* Customize badge */
ds-navigation-rail-item::part(badge) {
  background: var(--md-sys-color-error);
}
```

### Custom Colors

```css
ds-navigation-rail {
  --md-sys-color-surface: #1a1a2e;
  --md-sys-color-on-surface: #ffffff;
  --md-sys-color-secondary-container: #667eea;
}
```

## MD3 Specification

[Navigation Rail — Material Design 3](https://m3.material.io/components/navigation-rail)

## Accessibility

- **Role:** Rail has `role="navigation"` for proper semantics
- **Tabs:** Each item has `role="tab"` for tab-based navigation pattern
- **ARIA Selected:** Active items have `aria-selected="true"`
- **ARIA Disabled:** Disabled items have `aria-disabled="true"`
- **ARIA Labels:** Each item includes descriptive `aria-label`
- **Keyboard:** Navigate with Tab key, activate with Enter or Space
- **Focus Indicators:** Clear focus outlines for keyboard navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### Basic Three Destinations

```html
<ds-navigation-rail>
  <ds-navigation-rail-item icon="home" value="home" active
    >Home</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="search" value="search"
    >Search</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="person" value="profile"
    >Profile</ds-navigation-rail-item
  >
</ds-navigation-rail>
```

### With Badges

```html
<ds-navigation-rail>
  <ds-navigation-rail-item icon="home" value="home" active
    >Home</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="notifications" value="notifications" badge="5"
    >Alerts</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="chat" value="messages" badge="12"
    >Messages</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="person" value="profile"
    >Profile</ds-navigation-rail-item
  >
</ds-navigation-rail>
```

### Complete with Header and FAB

```html
<ds-navigation-rail>
  <div slot="header" style="font-weight: 700">NR</div>
  <ds-navigation-rail-item icon="home" value="home" active
    >Home</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="event" value="calendar"
    >Calendar</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="work" value="work"
    >Work</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="person" value="profile"
    >Profile</ds-navigation-rail-item
  >
  <ds-fab slot="fab" icon="add"></ds-fab>
</ds-navigation-rail>
```

### Event Handling with Navigation

```javascript
const rail = document.querySelector("ds-navigation-rail");
const contentArea = document.querySelector("#content");

rail.addEventListener("ds-navigation-rail:select", (e) => {
  // Update content based on selection
  contentArea.innerHTML = `<h2>${e.detail.label}</h2>`;

  // Update URL or router
  history.pushState({}, "", `/${e.detail.value}`);
});
```

## Best Practices

### ✅ Do

- **Use 3-7 destinations** - Optimal range for navigation rails
- **Always have one active** - One destination should always be selected
- **Use clear icons** - Icons should be universally recognized
- **Keep labels short** - 1-2 words maximum
- **Header for branding** - Use header slot for logos or menu triggers
- **Badge for notifications** - Use badges to indicate new content
- **Desktop/tablet first** - Rails are designed for larger screens

### ❌ Don't

- **Don't exceed 7 destinations** - More than 7 becomes crowded
- **Don't use on mobile** - Use navigation bar for mobile devices
- **Don't use without labels** - Icon-only navigation is less accessible
- **Don't change destinations frequently** - Navigation should be stable
- **Don't use for secondary navigation** - Reserve for top-level destinations

## Common Use Cases

### Email Client

```html
<ds-navigation-rail>
  <div slot="header">📧</div>
  <ds-navigation-rail-item icon="inbox" value="inbox" active
    >Inbox</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="send" value="sent"
    >Sent</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="drafts" value="drafts" badge="3"
    >Drafts</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="star" value="starred"
    >Starred</ds-navigation-rail-item
  >
  <ds-fab slot="fab" icon="edit"></ds-fab>
</ds-navigation-rail>
```

### Project Management

```html
<ds-navigation-rail>
  <div slot="header" aria-hidden="true">☰</div>
  <ds-navigation-rail-item icon="dashboard" value="dashboard" active
    >Dashboard</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="assignment" value="tasks" badge="7"
    >Tasks</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="people" value="team"
    >Team</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="event" value="calendar"
    >Calendar</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="analytics" value="reports"
    >Reports</ds-navigation-rail-item
  >
  <ds-fab slot="fab" icon="add"></ds-fab>
</ds-navigation-rail>
```

### Media Library

```html
<ds-navigation-rail>
  <ds-navigation-rail-item icon="home" value="home" active
    >Home</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="library_music" value="library"
    >Library</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="favorite" value="favorites"
    >Favorites</ds-navigation-rail-item
  >
  <ds-navigation-rail-item icon="person" value="profile"
    >Profile</ds-navigation-rail-item
  >
</ds-navigation-rail>
```

## License

MIT License - see LICENSE file for details

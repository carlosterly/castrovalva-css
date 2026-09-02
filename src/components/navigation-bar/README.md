# Navigation Bar

📱 Bottom navigation bars allow movement between primary destinations in an app. Ideal for mobile, appearing at the bottom of the screen with 3-5 destinations.

## Features

- 📱 **Bottom Navigation** - Fixed to the bottom of the viewport
- 🎯 **3-5 Destinations** - Supports the recommended 3-5 primary destinations
- 🎨 **Active Indicator** - Smooth animation with scale effect
- 🔔 **Badge Support** - Display notification counts or dots
- ♿ **Accessible** - Full ARIA support and keyboard navigation
- 🎭 **Shadow DOM** - Encapsulated styles with CSS parts for customization
- 🌈 **Material Design 3** - Built with MD3 design tokens
- 🔄 **State Management** - Automatic active/inactive state handling

## Installation

```bash
npm install castrovalva
```

## Basic Usage

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="search" value="search"
    >Search</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

## With Badges

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="notifications" value="notifications" badge="5">
    Notifications
  </ds-navigation-bar-item>
  <ds-navigation-bar-item icon="chat" value="messages" badge="12">
    Messages
  </ds-navigation-bar-item>
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

## Five Destinations (Maximum)

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="search" value="search"
    >Search</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="favorite" value="favorites"
    >Favorites</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="notifications" value="notifications" badge="3">
    Notifications
  </ds-navigation-bar-item>
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

## Disabled State

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="search" value="search"
    >Search</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="favorite" value="favorites" disabled>
    Favorites
  </ds-navigation-bar-item>
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

## API

### DSNavigationBar

The container component for navigation items.

#### Attributes

| Attribute | Type | Default | Description                                  |
| --------- | ---- | ------- | -------------------------------------------- |
| —         | —    | —       | No attributes; container manages child items |

#### Events

| Event                      | Detail                             | Description                          |
| -------------------------- | ---------------------------------- | ------------------------------------ |
| `ds-navigation-bar:select` | `{ value: string, label: string }` | Fired when a destination is selected |

#### Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| (default) | Container for `ds-navigation-bar-item` elements |

#### CSS Parts

| Part        | Description                  |
| ----------- | ---------------------------- |
| `container` | The navigation bar container |

### DSNavigationBarItem

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

| Event                          | Detail                             | Description                                  |
| ------------------------------ | ---------------------------------- | -------------------------------------------- |
| `ds-navigation-bar-item:click` | `{ value: string, label: string }` | Fired when item is clicked (if not disabled) |

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

## JavaScript API

### Listening to Selection Events

```javascript
const navBar = document.querySelector("ds-navigation-bar");

navBar.addEventListener("ds-navigation-bar:select", (e) => {
  console.log("Selected:", e.detail.value);
  console.log("Label:", e.detail.label);

  // Navigate to the selected destination
  navigateTo(e.detail.value);
});
```

### Programmatically Setting Active Item

```javascript
const items = document.querySelectorAll("ds-navigation-bar-item");

// Set third item as active
items[2].active = true;
```

### Updating Badges Dynamically

```javascript
const notificationsItem = document.querySelector('[value="notifications"]');

// Update badge count
notificationsItem.badge = "7";

// Remove badge
notificationsItem.badge = "";
```

### Getting Active Item

```javascript
const navBar = document.querySelector("ds-navigation-bar");
const activeItem = navBar.querySelector("ds-navigation-bar-item[active]");

console.log("Current active:", activeItem.value);
```

## Styling

### Using CSS Parts

```css
/* Customize the navigation bar container */
ds-navigation-bar::part(container) {
  background: linear-gradient(to right, #667eea 0%, #764ba2 100%);
  border-top: 2px solid var(--md-sys-color-primary);
}

/* Customize item appearance */
ds-navigation-bar-item::part(container) {
  padding: 16px;
}

/* Customize icon size */
ds-navigation-bar-item::part(icon) {
  font-size: 28px;
}

/* Customize label text */
ds-navigation-bar-item::part(label) {
  font-weight: 600;
  text-transform: uppercase;
}

/* Customize active indicator */
ds-navigation-bar-item::part(indicator) {
  height: 3px;
  background: linear-gradient(to right, #667eea, #764ba2);
}

/* Customize badge appearance */
ds-navigation-bar-item::part(badge) {
  background: red;
  color: white;
}
```

### Custom Colors

```css
ds-navigation-bar {
  --md-sys-color-surface-container: #1a1a2e;
  --md-sys-color-on-surface: #ffffff;
  --md-sys-color-on-surface-variant: #9ca3af;
  --md-sys-color-secondary-container: #667eea;
}
```

### Custom Indicator Animation

```css
ds-navigation-bar-item::part(indicator) {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## MD3 Specification

[Navigation Bar — Material Design 3](https://m3.material.io/components/navigation-bar)

## Accessibility

- **Role:** Navigation bar has `role="navigation"` for proper semantics
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

### Basic Usage

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="search" value="search"
    >Search</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

### With Badges and Event Handling

```html
<ds-navigation-bar id="nav">
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="notifications" value="notifications" badge="5"
    >Notifications</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

```javascript
document
  .getElementById("nav")
  .addEventListener("ds-navigation-bar:select", (e) => {
    console.log("Selected:", e.detail.value, e.detail.label);
  });
```

### Programmatic Badge Update

```javascript
const notifItem = document.querySelector('[value="notifications"]');
notifItem.badge = "12"; // Update badge count
```

## Best Practices

### ✅ Do

- **Use 3-5 destinations** - This is the optimal range for bottom navigation
- **Always have one active** - One destination should always be selected
- **Use clear icons** - Icons should be universally recognized
- **Keep labels short** - 1-2 words maximum
- **Badge for notifications** - Use badges to indicate new content or messages
- **Mobile-first** - Bottom navigation is designed for mobile experiences

### ❌ Don't

- **Don't exceed 5 destinations** - More than 5 becomes crowded and confusing
- **Don't use without labels** - Icon-only navigation is less accessible
- **Don't change destinations frequently** - Navigation should be stable
- **Don't use for desktop** - Use navigation drawer or rail for larger screens
- **Don't use for secondary navigation** - Reserve for top-level destinations only

## Common Use Cases

### Main App Navigation

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="explore" value="explore"
    >Explore</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="library" value="library"
    >Library</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

### Social Media App

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="feed" active
    >Feed</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="search" value="search"
    >Search</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="add_circle" value="create"
    >Create</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="favorite" value="activity" badge="8"
    >Activity</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="person" value="profile"
    >Profile</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

### Shopping App

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="storefront" value="shop" active
    >Shop</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="category" value="categories"
    >Categories</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="shopping_cart" value="cart" badge="3"
    >Cart</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="person" value="account"
    >Account</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

### Music Player App

```html
<ds-navigation-bar>
  <ds-navigation-bar-item icon="home" value="home" active
    >Home</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="search" value="search"
    >Search</ds-navigation-bar-item
  >
  <ds-navigation-bar-item icon="library_music" value="library"
    >Library</ds-navigation-bar-item
  >
</ds-navigation-bar>
```

## License

MIT License - see LICENSE file for details

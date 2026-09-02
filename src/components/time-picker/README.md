# Time Picker Component

A Material Design 3 time picker component that provides an intuitive clock interface for selecting time with support for both 12-hour and 24-hour formats.

## Features

- 📅 **Clock Interface**: Visual clock with selectable hours and minutes
- 🕐 **12/24 Hour Format**: Supports both 12-hour (with AM/PM) and 24-hour formats
- 🎯 **Precision Selection**: Minutes selectable in 5-minute intervals
- ⌨️ **Keyboard Support**: Full keyboard navigation (Escape to close)
- ♿ **Accessible**: ARIA labels, keyboard navigation, screen reader support
- 🎨 **Material Design 3**: Full MD3 styling with design tokens
- 📱 **Responsive**: Works on all device sizes
- 🎭 **Shadow DOM**: Encapsulated styles that won't conflict
- 🔄 **Event-Driven**: Custom events for open, close, and change

## Installation

```bash
npm install castrovalva
```

## Basic Usage

```html
<!-- Simple time picker -->
<ds-time-picker label="Select Time"></ds-time-picker>

<!-- With initial value (24-hour format HH:mm) -->
<ds-time-picker label="Meeting Time" value="14:30"></ds-time-picker>

<!-- 24-hour format -->
<ds-time-picker
  label="Departure Time"
  value="18:45"
  hour12="false"></ds-time-picker>

<!-- Disabled state -->
<ds-time-picker label="Time" value="09:00" disabled></ds-time-picker>

<!-- Required field -->
<ds-time-picker label="Appointment Time" required></ds-time-picker>
```

## Attributes

| Attribute  | Type    | Default         | Description                             |
| ---------- | ------- | --------------- | --------------------------------------- |
| `value`    | string  | `''`            | Selected time in HH:mm format (24-hour) |
| `label`    | string  | `'Select time'` | Label text for the input field          |
| `disabled` | boolean | `false`         | Disables the time picker                |
| `required` | boolean | `false`         | Marks the field as required             |
| `hour12`   | boolean | `true`          | Use 12-hour format with AM/PM selector  |
| `locale`   | string  | `'en-US'`       | Locale for time formatting              |

## Events

### `ds-time-picker:change`

Fired when time selection changes.

```javascript
timePicker.addEventListener("ds-time-picker:change", (event) => {
  console.log("Selected time:", event.detail.value); // "14:30"
  console.log("Hour:", event.detail.hour); // 2
  console.log("Minute:", event.detail.minute); // 30
  console.log("Period:", event.detail.period); // "PM" (or null in 24-hour mode)
});
```

**Event Detail:**

```typescript
{
  value: string; // HH:mm format (24-hour)
  hour: number; // Selected hour (12 or 24-hour depending on format)
  minute: number; // Selected minute
  period: "AM" | "PM" | null; // Period (null in 24-hour format)
}
```

### `ds-time-picker:open`

Fired when the clock opens.

```javascript
timePicker.addEventListener("ds-time-picker:open", () => {
  console.log("Clock opened");
});
```

### `ds-time-picker:close`

Fired when the clock closes.

```javascript
timePicker.addEventListener("ds-time-picker:close", () => {
  console.log("Clock closed");
});
```

## Methods

### `openClock()`

Opens the clock dropdown programmatically.

```javascript
const timePicker = document.querySelector("ds-time-picker");
timePicker.openClock();
```

### `closeClock()`

Closes the clock dropdown programmatically.

```javascript
timePicker.closeClock();
```

### `selectHour(hour)`

Selects a specific hour programmatically.

```javascript
// Select 3 (will switch to minute selection)
timePicker.selectHour(3);
```

### `selectMinute(minute)`

Selects a specific minute and closes the clock.

```javascript
// Select 30 minutes
timePicker.selectMinute(30);
```

### `togglePeriod()`

Toggles between AM and PM (12-hour format only).

```javascript
timePicker.togglePeriod();
```

## CSS Parts

Style internal elements using `::part()`:

```css
/* Style the input field */
ds-time-picker::part(input) {
  border: 2px solid blue;
  border-radius: 8px;
}

/* Style the clock dropdown */
ds-time-picker::part(clock) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

Available parts:

- `input` - The input field element
- `clock` - The clock dropdown container

## CSS Custom Properties

| Property                              | Default                       | Description              |
| ------------------------------------- | ----------------------------- | ------------------------ |
| `--ds-time-picker-width`              | `280px`                       | Width of the input       |
| `--ds-time-picker-input-padding-y`    | `var(--ds-space-4)`           | Input vertical padding   |
| `--ds-time-picker-input-padding-x`    | `var(--ds-space-4)`           | Input horizontal padding |
| `--ds-time-picker-input-icon-padding` | `var(--ds-space-12)`          | Right padding for icon   |
| `--ds-time-picker-label-offset-x`     | `var(--ds-space-4)`           | Label left offset        |
| `--ds-time-picker-label-padding-x`    | `var(--ds-space-1)`           | Label horizontal padding |
| `--ds-time-picker-label-bg`           | `var(--md-sys-color-surface)` | Label background color   |
| `--ds-time-picker-icon-offset-x`      | `var(--ds-space-3)`           | Icon right offset        |
| `--ds-time-picker-icon-size`          | `var(--ds-size-icon-lg)`      | Clock icon size          |
| `--ds-time-picker-clock-padding`      | `var(--ds-space-6)`           | Clock padding            |
| `--ds-time-picker-clock-width`        | `320px`                       | Clock min width          |
| `--ds-time-picker-clock-header-gap`   | `var(--ds-space-6)`           | Header spacing           |
| `--ds-time-picker-mode-gap`           | `var(--ds-space-2)`           | Hour/minute gap          |
| `--ds-time-picker-period-gap`         | `var(--ds-space-1)`           | AM/PM button gap         |
| `--ds-time-picker-period-padding-y`   | `var(--ds-space-2)`           | AM/PM vertical padding   |
| `--ds-time-picker-period-padding-x`   | `var(--ds-space-3)`           | AM/PM horizontal padding |
| `--ds-time-picker-clock-face-size`    | `256px`                       | Clock face size          |
| `--ds-time-picker-number-size`        | `var(--ds-size-hit-area)`     | Clock number button size |
| `--ds-time-picker-number-font-size`   | `var(--ds-size-icon-sm)`      | Clock number font size   |

## JavaScript API

### Getting/Setting Value

```javascript
const timePicker = document.querySelector("ds-time-picker");

// Get current value (HH:mm format)
console.log(timePicker.value); // "14:30"

// Set value
timePicker.value = "09:15";

// Clear value
timePicker.value = "";
```

### Changing Format

```javascript
// Switch to 24-hour format
timePicker.hour12 = false;

// Switch to 12-hour format
timePicker.hour12 = true;
```

### State Management

```javascript
// Disable
timePicker.disabled = true;

// Mark as required
timePicker.required = true;

// Change label
timePicker.label = "Start Time";
```

## Styling with Design Tokens

The component uses Material Design 3 design tokens:

```css
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-outline: #79747e;
}
```

## Accessibility

### Keyboard Support

- **Escape**: Closes the clock dropdown
- **Tab**: Navigates through focusable elements
- **Enter/Space**: Selects focused time value
- **Click**: Selects hour/minute values

### Screen Reader Support

- Input has descriptive ARIA label from `label` attribute
- Clock has `role="dialog"` for proper announcement
- Hour and minute buttons have descriptive `aria-label` attributes
- Required state is properly announced
- Disabled state prevents interaction

### ARIA Attributes

```html
<!-- Input automatically gets aria-label -->
<ds-time-picker label="Meeting Time"></ds-time-picker>
<!-- Input will have aria-label="Meeting Time" -->

<!-- Clock dialog has proper role -->
<!-- Clock buttons have descriptive labels like "3 hours", "30 minutes" -->
```

## Best Practices

### Format Selection

```javascript
// Use 12-hour format for consumer apps
<ds-time-picker label="Alarm Time" hour12="true"></ds-time-picker>

// Use 24-hour format for international or professional contexts
<ds-time-picker label="Flight Departure" hour12="false"></ds-time-picker>
```

### Form Integration

```javascript
const form = document.querySelector("form");
const timePicker = document.querySelector("ds-time-picker");

timePicker.addEventListener("ds-time-picker:change", (e) => {
  // Update hidden input for form submission
  document.getElementById("timeInput").value = e.detail.value;
});

form.addEventListener("submit", (e) => {
  if (!timePicker.value) {
    e.preventDefault();
    alert("Please select a time");
  }
});
```

### Validation

```javascript
const timePicker = document.querySelector("ds-time-picker");

timePicker.addEventListener("ds-time-picker:change", (e) => {
  const time = e.detail.value;
  const [hours, minutes] = time.split(":").map(Number);

  // Validate business hours (9 AM - 5 PM)
  if (hours < 9 || hours >= 17) {
    alert("Please select a time during business hours (9 AM - 5 PM)");
    timePicker.value = "";
  }
});
```

### Time Ranges

```javascript
// Set minimum/maximum times (custom logic)
const startPicker = document.querySelector("#start-time");
const endPicker = document.querySelector("#end-time");

startPicker.addEventListener("ds-time-picker:change", (e) => {
  // Ensure end time is after start time
  if (endPicker.value && endPicker.value < e.detail.value) {
    endPicker.value = "";
    alert("End time must be after start time");
  }
});
```

## Common Use Cases

### Appointment Booking

```html
<form id="appointment-form">
  <ds-time-picker label="Appointment Time" required id="appointment-time">
  </ds-time-picker>
  <button type="submit">Book Appointment</button>
</form>

<script>
  const form = document.getElementById("appointment-form");
  const timePicker = document.getElementById("appointment-time");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (timePicker.value) {
      console.log("Booking at:", timePicker.value);
    }
  });
</script>
```

### Alarm Clock

```html
<div class="alarm-settings">
  <ds-time-picker label="Wake Up Time" hour12="true"> </ds-time-picker>
</div>
```

### Schedule Builder

```html
<div class="schedule">
  <div class="time-slot">
    <ds-time-picker label="Start Time" hour12="false"></ds-time-picker>
    <ds-time-picker label="End Time" hour12="false"></ds-time-picker>
  </div>
</div>
```

### International Flight Times

```html
<div class="flight-times">
  <ds-time-picker label="Departure (Local)" hour12="false" locale="en-GB">
  </ds-time-picker>
  <ds-time-picker label="Arrival (Local)" hour12="false" locale="en-GB">
  </ds-time-picker>
</div>
```

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile browsers: ✅ iOS Safari, Chrome Mobile

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

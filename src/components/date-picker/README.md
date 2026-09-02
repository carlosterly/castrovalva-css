# Date Picker Component

A Material Design 3 date picker component with calendar interface for selecting dates.

## Features

- ✅ Calendar view with month/year navigation
- ✅ Single date selection
- ✅ Min/max date constraints
- ✅ Today highlighting
- ✅ Disabled state
- ✅ Required field support
- ✅ Localization support
- ✅ Keyboard navigation (Escape to close)
- ✅ Accessible with ARIA labels
- ✅ Material Design 3 styling
- ✅ Custom CSS parts for styling

## Installation

```bash
npm install castrovalva
```

## Usage

### Basic Example

```html
<ds-date-picker label="Select a date"></ds-date-picker>
```

### With Initial Value

```html
<ds-date-picker label="Event date" value="2024-12-25"></ds-date-picker>
```

### With Date Constraints

```html
<!-- Future dates only -->
<ds-date-picker label="Appointment date" min="2025-01-01"></ds-date-picker>

<!-- Past dates only -->
<ds-date-picker label="Birth date" max="2024-12-31"></ds-date-picker>

<!-- Date range -->
<ds-date-picker
  label="Select within December 2024"
  min="2024-12-01"
  max="2024-12-31"></ds-date-picker>
```

### Disabled and Required States

```html
<!-- Disabled -->
<ds-date-picker label="Disabled picker" disabled></ds-date-picker>

<!-- Required -->
<ds-date-picker label="Required date" required></ds-date-picker>
```

### With Localization

```html
<ds-date-picker label="Date" value="2024-12-25" locale="de-DE"></ds-date-picker>
```

## API Reference

### Attributes

| Attribute  | Type    | Default       | Description                                  |
| ---------- | ------- | ------------- | -------------------------------------------- |
| `value`    | string  | ''            | Selected date in YYYY-MM-DD format           |
| `min`      | string  | undefined     | Minimum selectable date in YYYY-MM-DD format |
| `max`      | string  | undefined     | Maximum selectable date in YYYY-MM-DD format |
| `label`    | string  | 'Select date' | Label text for the input field               |
| `disabled` | boolean | false         | Disables the date picker                     |
| `required` | boolean | false         | Marks the field as required                  |
| `locale`   | string  | 'en-US'       | Locale for date formatting                   |

### Events

| Event                   | Detail                          | Description                   |
| ----------------------- | ------------------------------- | ----------------------------- |
| `ds-date-picker:change` | `{ value: string, date: Date }` | Fired when a date is selected |
| `ds-date-picker:open`   | none                            | Fired when calendar opens     |
| `ds-date-picker:close`  | none                            | Fired when calendar closes    |

### Methods

| Method             | Parameters | Description                     |
| ------------------ | ---------- | ------------------------------- |
| `openCalendar()`   | none       | Opens the calendar dropdown     |
| `closeCalendar()`  | none       | Closes the calendar dropdown    |
| `selectDate(date)` | date: Date | Programmatically selects a date |
| `previousMonth()`  | none       | Navigates to previous month     |
| `nextMonth()`      | none       | Navigates to next month         |

### CSS Parts

| Part       | Description                     |
| ---------- | ------------------------------- |
| `input`    | The input field element         |
| `calendar` | The calendar dropdown container |
| `day`      | Calendar day buttons            |

## JavaScript API

### Listening to Events

```javascript
const picker = document.querySelector("ds-date-picker");

picker.addEventListener("ds-date-picker:change", (e) => {
  console.log("Selected date:", e.detail.value);
  console.log("Date object:", e.detail.date);
});

picker.addEventListener("ds-date-picker:open", () => {
  console.log("Calendar opened");
});

picker.addEventListener("ds-date-picker:close", () => {
  console.log("Calendar closed");
});
```

### Programmatic Control

```javascript
const picker = document.querySelector("ds-date-picker");

// Set value
picker.value = "2024-12-25";

// Set constraints
picker.min = "2024-01-01";
picker.max = "2024-12-31";

// Open/close calendar
picker.openCalendar();
picker.closeCalendar();

// Select a date programmatically
picker.selectDate(new Date("2024-12-25"));

// Navigate months
picker.previousMonth();
picker.nextMonth();

// Check disabled state
console.log(picker.isDateDisabled(new Date("2024-01-01")));
```

## Styling

### Custom Styling with CSS Parts

```css
ds-date-picker::part(input) {
  border-width: 2px;
  border-radius: 8px;
}

ds-date-picker::part(calendar) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### CSS Custom Properties

| Property                              | Default                       | Description              |
| ------------------------------------- | ----------------------------- | ------------------------ |
| `--ds-date-picker-width`              | `280px`                       | Width of the input       |
| `--ds-date-picker-input-padding-y`    | `var(--ds-space-4)`           | Input vertical padding   |
| `--ds-date-picker-input-padding-x`    | `var(--ds-space-4)`           | Input horizontal padding |
| `--ds-date-picker-input-icon-padding` | `var(--ds-space-12)`          | Right padding for icon   |
| `--ds-date-picker-label-offset-x`     | `var(--ds-space-4)`           | Label left offset        |
| `--ds-date-picker-label-padding-x`    | `var(--ds-space-1)`           | Label horizontal padding |
| `--ds-date-picker-label-bg`           | `var(--md-sys-color-surface)` | Label background color   |
| `--ds-date-picker-icon-offset-x`      | `var(--ds-space-3)`           | Icon right offset        |
| `--ds-date-picker-icon-size`          | `var(--ds-size-icon-lg)`      | Calendar icon size       |
| `--ds-date-picker-calendar-width`     | `320px`                       | Calendar min width       |
| `--ds-date-picker-calendar-padding`   | `var(--ds-space-4)`           | Calendar padding         |
| `--ds-date-picker-calendar-gap`       | `var(--ds-space-1)`           | Calendar grid gap        |
| `--ds-date-picker-header-gap`         | `var(--ds-space-4)`           | Header bottom spacing    |
| `--ds-date-picker-nav-size`           | `var(--ds-size-hit-area)`     | Navigation button size   |
| `--ds-date-picker-day-header-padding` | `var(--ds-space-2)`           | Day header padding       |
| `--ds-date-picker-day-font-size`      | `var(--ds-size-icon-sm)`      | Day number font size     |

## Accessibility

- **Keyboard Support:** Escape key closes the calendar
- **ARIA Labels:** All interactive elements have proper labels
- **Screen Readers:** Calendar uses dialog role
- **Focus Management:** Clear focus indicators
- **Date Announcements:** Each day includes full date information

## Best Practices

1. **Always provide clear labels** - Tell users what the date represents
2. **Use constraints** - Prevent invalid date selection with min/max
3. **Consider locale** - Format dates appropriately for the user's region
4. **Mark required fields** - Use the required attribute and show asterisk
5. **Provide feedback** - Show today's date and selected date clearly
6. **Reasonable ranges** - Don't overwhelm users with too many date options

## Common Use Cases

### Appointment Booking

```html
<ds-date-picker
  label="Select appointment date"
  min="${new Date().toISOString().split('T')[0]}"></ds-date-picker>
```

### Birth Date

```html
<ds-date-picker
  label="Date of birth"
  max="${new Date().toISOString().split('T')[0]}"
  required></ds-date-picker>
```

### Date Range Filter

```html
<ds-date-picker label="From date" id="from-date"></ds-date-picker>

<ds-date-picker label="To date" id="to-date"></ds-date-picker>

<script>
  const fromDate = document.getElementById("from-date");
  const toDate = document.getElementById("to-date");

  fromDate.addEventListener("ds-date-picker:change", (e) => {
    toDate.min = e.detail.value;
  });
</script>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires browsers with Web Components support.

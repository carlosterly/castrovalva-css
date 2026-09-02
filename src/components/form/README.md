# DS Form Component

A Material Design 3 form wrapper component for managing form state, validation, and submission.

## Overview

`ds-form` is a container component that groups form inputs and provides unified validation, error handling, and data collection. It eliminates the need to manually validate each field and coordinate their states.

## Features

- ✅ **Automatic field detection** - Finds and manages all form inputs automatically
- ✅ **Built-in validation** - Required fields, email, URL, pattern, length constraints
- ✅ **Field state tracking** - Tracks touched, dirty, and validation states
- ✅ **Error management** - Collects and displays field errors
- ✅ **Event system** - Custom events for submit, reset, change, and validity
- ✅ **Public API** - Methods to get/set values, validate, and manage form state
- ✅ **Material Design 3** - Full MD3 token integration
- ✅ **Accessible** - WCAG 2.1 AA compliant

## Installation

Import the component:

```javascript
import "../src/components/form/form.js";
```

## Basic Usage

```html
<ds-form name="signup">
  <ds-text-field name="email" type="email" required></ds-text-field>

  <ds-text-field
    name="password"
    type="password"
    required
    minlength="8"></ds-text-field>

  <ds-checkbox name="agree" required>I agree to the terms</ds-checkbox>

  <ds-button type="submit">Sign Up</ds-button>
</ds-form>
```

## Supported Form Fields

The component automatically detects and manages these form input types:

- `ds-text-field` - Text, email, password, number, tel, URL inputs
- `ds-textarea` - Multi-line text input
- `ds-checkbox` - Checkbox control
- `ds-radio` - Radio button control
- `ds-switch` - Toggle switch
- `ds-slider` - Range slider
- `ds-select` - Select dropdown (future)
- `ds-date-picker` - Date selection
- `ds-time-picker` - Time selection

## Attributes

### Form Attributes

| Attribute    | Type    | Description                 |
| ------------ | ------- | --------------------------- |
| `name`       | string  | Form name for submission    |
| `novalidate` | boolean | Disable built-in validation |

### Field Attributes

| Attribute | Type | Description |
| `name` | string | **Required** - Field identifier |
| `required` | boolean/string | Mark field as required; use string for custom error message |
| `type` | string | Input type (text, email, password, url, number, tel, etc.) |
| `pattern` | string | Regex pattern for validation |
| `minlength` | number | Minimum character length |
| `maxlength` | number | Maximum character length |

## API

### Methods

#### `getValues()`

Returns all form field values as an object.

```javascript
const form = document.querySelector("ds-form");
const values = form.getValues();
// { email: "user@example.com", password: "secret123", agree: true }
```

#### `getValue(name)`

Get a specific field value.

```javascript
const email = form.getValue("email");
```

#### `setValue(name, value)`

Set a field value programmatically.

```javascript
form.setValue("email", "newemail@example.com");
```

#### `validate()`

Validate all form fields. Returns true if valid.

```javascript
if (form.validate()) {
  console.log("Form is valid!");
}
```

#### `isValid()`

Check if form is currently valid without re-validating.

```javascript
if (form.isValid()) {
  // Submit
}
```

#### `getErrors()`

Get all field errors.

```javascript
const errors = form.getErrors();
// { email: "Invalid email address" }
```

#### `getTouched()`

Get fields that have been focused/blurred.

```javascript
const touched = form.getTouched();
// Set { "email", "password" }
```

#### `getDirty()`

Get fields that have been modified.

```javascript
const dirty = form.getDirty();
// Set { "email", "password" }
```

#### `markTouched(name)`

Mark a specific field as touched.

```javascript
form.markTouched("email");
```

#### `markAllTouched()`

Mark all fields as touched (useful before validation).

```javascript
form.markAllTouched();
```

#### `submit()`

Validate the form. Same as `validate()`.

```javascript
const isValid = form.submit();
```

#### `reset()`

Reset all form fields to initial values and clear state.

```javascript
form.reset();
```

## Events

### `ds-form:submit`

Fired when form is submitted with valid data.

```javascript
form.addEventListener("ds-form:submit", (event) => {
  console.log("Form data:", event.detail.values);
  // event.detail.values = { email: "...", password: "...", agree: true }
});
```

### `ds-form:change`

Fired when any field value changes.

```javascript
form.addEventListener("ds-form:change", (event) => {
  console.log("Field changed:", event.detail.name, event.detail.value);
  console.log("All values:", event.detail.values);
});
```

### `ds-form:reset`

Fired when form is reset.

```javascript
form.addEventListener("ds-form:reset", (event) => {
  console.log("Form has been reset");
});
```

### `ds-form:validity-change`

Fired when overall form validity changes.

```javascript
form.addEventListener("ds-form:validity-change", (event) => {
  console.log("Form is valid:", event.detail.isValid);
  // Disable/enable submit button based on validity
});
```

## Validation

To bypass internal validation, set the `novalidate` attribute on `ds-form`.

### Built-in Validation Rules

#### Required Field

```html
<ds-text-field name="email" required></ds-text-field>

<!-- Custom error message -->
<ds-text-field
  name="email"
  required="Email address is required"></ds-text-field>
```

#### Email

```html
<ds-text-field name="email" type="email" required></ds-text-field>
```

#### URL

```html
<ds-text-field name="website" type="url" required></ds-text-field>
```

#### Pattern

```html
<ds-text-field name="code" pattern="^[A-Z]{3}\d{3}$" required></ds-text-field>
```

#### Length Constraints

```html
<ds-text-field
  name="password"
  type="password"
  minlength="8"
  maxlength="128"
  required></ds-text-field>
```

### Validation States

Fields have three validation states:

1. **Untouched/Clean**: No errors shown until user interacts
2. **Touched**: Errors shown after user leaves field
3. **Dirty**: Errors shown as user types

This provides better UX by not showing validation errors before the user has a chance to enter data.

## Examples

### Complete Form with Submission

```html
<ds-form id="signupForm">
  <h2>Sign Up</h2>

  <ds-text-field name="firstName" required label="First Name"></ds-text-field>

  <ds-text-field name="lastName" required label="Last Name"></ds-text-field>

  <ds-text-field
    name="email"
    type="email"
    required
    label="Email Address"></ds-text-field>

  <ds-text-field
    name="password"
    type="password"
    required
    minlength="8"
    label="Password"></ds-text-field>

  <ds-text-field
    name="confirmPassword"
    type="password"
    required
    label="Confirm Password"></ds-text-field>

  <ds-checkbox name="newsletter">Subscribe to our newsletter</ds-checkbox>

  <ds-checkbox name="terms" required="You must accept the terms"
    >I agree to the Terms of Service</ds-checkbox
  >

  <div style="display: flex; gap: 8px; margin-top: 16px;">
    <ds-button type="submit">Sign Up</ds-button>
    <ds-button variant="secondary" id="resetBtn">Clear</ds-button>
  </div>
</ds-form>

<script>
  const form = document.getElementById("signupForm");
  const resetBtn = document.getElementById("resetBtn");

  form.addEventListener("ds-form:submit", (event) => {
    const data = event.detail.values;
    console.log("Submitting:", data);

    // Send to server
    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  });

  form.addEventListener("ds-form:validity-change", (event) => {
    // Disable submit button if form is invalid
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = !event.detail.isValid;
  });

  resetBtn.addEventListener("click", () => form.reset());
</script>
```

### Dynamic Form Fields

```javascript
const form = document.querySelector("ds-form");

// Add field dynamically
const newField = document.createElement("ds-text-field");
newField.setAttribute("name", "phone");
newField.setAttribute("type", "tel");
form.appendChild(newField);

// Form automatically detects and manages the new field
```

### Programmatic Form Control

```javascript
const form = document.querySelector("ds-form");

// Set values programmatically
form.setValue("email", "user@example.com");
form.setValue("subscribe", true);

// Get values
const formData = form.getValues();

// Check validation
if (form.validate()) {
  // Process form
} else {
  // Show errors
  console.log(form.getErrors());
}

// Reset
form.reset();
```

## CSS Parts

| Part            | Description           |
| --------------- | --------------------- |
| `container`     | Main form container   |
| `error-summary` | Error summary section |

### Custom Styling

```css
ds-form::part(container) {
  background: var(--my-form-bg);
  border-radius: 12px;
}

ds-form::part(error-summary) {
  background: var(--my-error-bg);
  color: var(--my-error-color);
}
```

## Accessibility

- ✅ Semantic HTML form element
- ✅ Field labels and error messages properly associated
- ✅ ARIA attributes for validation states
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Error announcements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Related Components

- [`ds-text-field`](../text-field/README.md) - Text input field
- [`ds-checkbox`](../checkbox/README.md) - Checkbox control
- [`ds-radio`](../radio/README.md) - Radio button
- [`ds-switch`](../switch/README.md) - Toggle switch
- [`ds-button`](../button/README.md) - Submit/reset button

## References

- [HTML Form Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [ARIA Forms](https://www.w3.org/WAI/tutorials/forms/)

# Bottom Sheet Component

Material Design 3 bottom sheet for displaying content and actions that slide in from the bottom of the screen.

## Overview

The bottom sheet is a container that presents content and actions in a modal interface that slides up from the bottom. It supports two variants:

- **Standard**: Can be dismissed by swiping down, clicking outside, or pressing Escape
- **Modal**: Requires explicit close action, cannot be dismissed by background click

## Usage

### Basic Example

```html
<ds-bottom-sheet id="mySheet">
  <div slot="header">
    <h2>Sheet Title</h2>
  </div>
  <p>Your content here</p>
  <div slot="actions">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</ds-bottom-sheet>

<script>
  const sheet = document.getElementById("mySheet");
  sheet.open = true; // Opens the sheet
  sheet.close(); // Closes the sheet
</script>
```

### Standard Variant (Default)

```html
<ds-bottom-sheet variant="standard" open>
  <p>This sheet can be dismissed by swiping or clicking outside</p>
</ds-bottom-sheet>
```

### Modal Variant

```html
<ds-bottom-sheet variant="modal" open>
  <div slot="header">
    <h2>Important Action</h2>
  </div>
  <p>This sheet requires explicit confirmation</p>
  <div slot="actions">
    <button onclick="this.closest('ds-bottom-sheet').open = false">
      Confirm
    </button>
  </div>
</ds-bottom-sheet>
```

### With Drag-to-Dismiss Disabled

```html
<ds-bottom-sheet draggable="false" open>
  <p>Cannot be dismissed by dragging</p>
</ds-bottom-sheet>
```

### Custom Drag Threshold

```html
<ds-bottom-sheet drag-threshold="150" open>
  <p>Must drag 150px to dismiss</p>
</ds-bottom-sheet>
```

## API Reference

### Attributes

| Attribute        | Type                    | Default      | Description                                   |
| ---------------- | ----------------------- | ------------ | --------------------------------------------- |
| `variant`        | `"standard" \| "modal"` | `"standard"` | Sheet behavior variant                        |
| `open`           | `boolean`               | `false`      | Whether the sheet is visible                  |
| `draggable`      | `boolean`               | `true`       | Allow drag-to-dismiss (standard variant only) |
| `drag-threshold` | `number`                | `100`        | Pixels to drag before dismissing              |

### Properties

| Property    | Type         | Description                      |
| ----------- | ------------ | -------------------------------- |
| `variant`   | `string`     | Get/set the sheet variant        |
| `open`      | `boolean`    | Get/set the open state           |
| `draggable` | `boolean`    | Get/set draggable behavior       |
| `show()`    | `() => void` | Open the sheet programmatically  |
| `close()`   | `() => void` | Close the sheet programmatically |

### Events

| Event                   | Detail                 | Description             |
| ----------------------- | ---------------------- | ----------------------- |
| `ds-bottom-sheet:open`  | `{}`                   | Fired when sheet opens  |
| `ds-bottom-sheet:close` | `{}`                   | Fired when sheet closes |
| `ds-bottom-sheet:drag`  | `{ progress: number }` | Fired during drag (0-1) |

### Slots

| Slot        | Description                         |
| ----------- | ----------------------------------- |
| `(default)` | Main content area                   |
| `header`    | Optional header/title area          |
| `actions`   | Optional footer with action buttons |

### CSS Parts

| Part        | Description                    |
| ----------- | ------------------------------ |
| `container` | Outer wrapper with flex layout |
| `scrim`     | Background overlay             |
| `sheet`     | Main sheet container           |
| `header`    | Header slot wrapper            |
| `content`   | Main content area              |
| `actions`   | Actions slot wrapper           |

### CSS Custom Properties

| Property                               | Default                     | Description                 |
| -------------------------------------- | --------------------------- | --------------------------- |
| `--ds-bottom-sheet-max-width`          | `640px`                     | Maximum width of the sheet  |
| `--ds-bottom-sheet-max-height`         | `90vh`                      | Maximum height of the sheet |
| `--ds-bottom-sheet-header-padding`     | `var(--ds-space-6)`         | Header padding              |
| `--ds-bottom-sheet-content-padding`    | `var(--ds-space-6)`         | Content padding             |
| `--ds-bottom-sheet-actions-padding`    | `var(--ds-space-6)`         | Actions area padding        |
| `--ds-bottom-sheet-actions-gap`        | `var(--ds-space-3)`         | Actions item gap            |
| `--ds-bottom-sheet-drag-handle-width`  | `var(--ds-size-control-sm)` | Drag handle width           |
| `--ds-bottom-sheet-drag-handle-height` | `4px`                       | Drag handle height          |

## Accessibility

### Keyboard Navigation

- **Tab** - Move focus through interactive elements
- **Shift+Tab** - Move focus backward
- **Escape** - Close standard variant (not modal)
- **Enter/Space** - Activate buttons within the sheet
- **Touch drag** - Dismiss standard variant (mobile)

### ARIA Attributes

- `role="dialog"` - Identifies the element as a dialog
- `aria-modal="true"` - Indicates modal behavior
- `aria-labelledby` - References header element (when applicable)

### Screen Reader Support

- Sheet announces as a dialog/modal when opened
- Focus automatically returns to the trigger element when closed
- Drag handle is visually indicated in standard variant
- All interactive elements are accessible via keyboard

### Features

- ✅ Semantic HTML with proper dialog structure
- ✅ Focus management and restoration
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ High contrast mode support
- ✅ Respects `prefers-reduced-motion` setting
- ✅ Touch-friendly drag handle

## Styling & Customization

### Custom Width and Height

```html
<style>
  ds-bottom-sheet {
    --ds-bottom-sheet-max-width: 800px;
    --ds-bottom-sheet-max-height: 95vh;
  }
</style>
<ds-bottom-sheet open>
  <p>Larger sheet</p>
</ds-bottom-sheet>
```

### Styling Internal Parts

```html
<style>
  ds-bottom-sheet::part(sheet) {
    background: var(--my-custom-bg);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  ds-bottom-sheet::part(header) {
    border-color: var(--my-custom-border);
    padding: 32px;
  }

  ds-bottom-sheet::part(actions) {
    gap: 16px;
  }
</style>
```

### Dark Mode Support

The component automatically adapts to light and dark color schemes using Material Design 3 tokens:

- `--md-sys-color-surface` for background
- `--md-sys-color-on-surface` for text
- `--md-sys-color-outline-variant` for borders
- `--md-sys-elevation-level3` for shadow

## Examples

### Confirmation Dialog

```html
<ds-bottom-sheet id="confirmSheet" variant="modal">
  <div slot="header">
    <h2>Confirm Action</h2>
  </div>
  <p>Are you sure you want to proceed? This action cannot be undone.</p>
  <div slot="actions">
    <button id="cancelBtn">Cancel</button>
    <button
      id="confirmBtn"
      style="background-color: var(--md-sys-color-error);">
      Confirm
    </button>
  </div>
</ds-bottom-sheet>

<script>
  document.getElementById("cancelBtn").addEventListener("click", () => {
    document.getElementById("confirmSheet").open = false;
  });

  document.getElementById("confirmBtn").addEventListener("click", () => {
    // Handle confirmation
    document.getElementById("confirmSheet").open = false;
  });
</script>
```

### List Selection

```html
<ds-bottom-sheet id="selectSheet">
  <div slot="header">
    <h2>Select Option</h2>
  </div>
  <div id="optionsList"></div>
</ds-bottom-sheet>

<script>
  const options = ["Option 1", "Option 2", "Option 3"];
  const list = document.getElementById("optionsList");

  options.forEach((option) => {
    const item = document.createElement("div");
    item.textContent = option;
    item.style.padding = "16px";
    item.style.borderBottom = "1px solid #ccc";
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      console.log("Selected:", option);
      document.getElementById("selectSheet").open = false;
    });
    list.appendChild(item);
  });
</script>
```

### Multi-Step Form

```html
<ds-bottom-sheet id="formSheet">
  <div slot="header">
    <h2 id="formTitle">Step 1 of 3</h2>
  </div>
  <div id="formContent"></div>
  <div slot="actions">
    <button id="prevBtn" style="display:none;">Back</button>
    <button id="nextBtn">Next</button>
  </div>
</ds-bottom-sheet>

<script>
  let step = 1;
  const steps = [
    { title: "Step 1 of 3", content: "Form step 1 content" },
    { title: "Step 2 of 3", content: "Form step 2 content" },
    { title: "Step 3 of 3", content: "Form step 3 content - Submit" },
  ];

  function updateStep() {
    document.getElementById("formTitle").textContent = steps[step - 1].title;
    document.getElementById("formContent").textContent =
      steps[step - 1].content;
    document.getElementById("prevBtn").style.display =
      step > 1 ? "block" : "none";
    document.getElementById("nextBtn").textContent =
      step === 3 ? "Submit" : "Next";
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (step < 3) {
      step++;
      updateStep();
    } else {
      document.getElementById("formSheet").open = false;
    }
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (step > 1) {
      step--;
      updateStep();
    }
  });

  updateStep();
</script>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Material Design 3 Reference

- [Bottom Sheets - Material Design 3](https://m3.material.io/components/bottom-sheets)
- [Dialog patterns](https://m3.material.io/components/dialogs)
- [Motion Tokens](https://m3.material.io/foundations/motion)

## Related Components

- [`<ds-dialog>`](dialog.html) - For center-screen modal dialogs
- [`<ds-snackbar>`](snackbar.html) - For brief notifications
- [`<ds-navigation-drawer>`](navigation-drawer.html) - For navigation panels

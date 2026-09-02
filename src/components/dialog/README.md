# Dialog (`ds-dialog`)

Material Design 3 modal dialog component for confirmations, alerts, and full-screen task flows.

## Import

```js
import "./src/components/ds-dialog.js";
```

## Basic Usage

```html
<ds-dialog id="example" variant="basic">
  <span slot="title">Settings</span>
  <p>Update your preferences.</p>
  <div slot="actions">
    <button type="button">Cancel</button>
    <button type="button">Save</button>
  </div>
</ds-dialog>
```

```js
const dialog = document.getElementById("example");
dialog.show();
dialog.close();
```

## Attributes

| Attribute                   | Type                                  | Default   | Description                                           |
| --------------------------- | ------------------------------------- | --------- | ----------------------------------------------------- |
| `variant`                   | `"basic" \| "alert" \| "full-screen"` | `"basic"` | Visual and layout variant.                            |
| `open`                      | boolean                               | `false`   | Controls visibility of the dialog.                    |
| `dismiss-on-backdrop-click` | boolean                               | `true`    | Backdrop click closes dialog unless set to `"false"`. |
| `dismiss-on-esc`            | boolean                               | `true`    | Escape key closes dialog unless set to `"false"`.     |

## Properties

| Property  | Type      | Description               |
| --------- | --------- | ------------------------- |
| `variant` | `string`  | Gets/sets dialog variant. |
| `open`    | `boolean` | Gets/sets open state.     |

## Methods

| Method    | Description                                                 |
| --------- | ----------------------------------------------------------- |
| `show()`  | Opens the dialog, locks body scroll, and traps focus.       |
| `close()` | Closes the dialog, restores focus, and unlocks body scroll. |

## Events

| Event               | Description                                   |
| ------------------- | --------------------------------------------- |
| `ds-dialog:open`    | Fired when the dialog opens.                  |
| `ds-dialog:close`   | Fired when the dialog closes.                 |
| `ds-dialog:confirm` | Fired when default confirm button is clicked. |

## Slots

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `title`   | Dialog title content.                         |
| `icon`    | Optional icon for full-screen variant header. |
| `actions` | Action controls area.                         |
| default   | Main content body.                            |

## CSS Custom Properties

| Property                        | Default                           | Description                                   |
| ------------------------------- | --------------------------------- | --------------------------------------------- |
| `--ds-dialog-close-button-size` | `var(--ds-size-control-md, 40px)` | Close button size.                            |
| `--ds-dialog-icon-size`         | `var(--ds-size-icon-lg, 24px)`    | Full-screen header icon size.                 |
| `--ds-dialog-action-gap`        | `var(--ds-space-2, 8px)`          | Gap between action controls.                  |
| `--ds-dialog-header-gap`        | `var(--ds-space-4, 16px)`         | Header spacing between title/icon/actions.    |
| `--ds-dialog-padding`           | `var(--ds-space-6, 24px)`         | Dialog body padding for basic/alert variants. |

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`.
- Traps keyboard focus within dialog while open.
- Restores focus to previously focused element on close.
- Supports Escape dismissal when enabled.

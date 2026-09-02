# FAB Component

Material Design 3 Floating Action Button for promoting a primary action with optional Speed Dial actions.

## Usage

```html
<ds-fab position="none">
  <ds-icon>add</ds-icon>
</ds-fab>

<ds-fab size="extended" label="Compose" position="none">
  <ds-icon>edit</ds-icon>
</ds-fab>
```

## Attributes

| Attribute    | Type    | Default        | Description                                                     |
| ------------ | ------- | -------------- | --------------------------------------------------------------- |
| `size`       | string  | `default`      | `small`, `default`, `large`, or `extended`.                     |
| `color`      | string  | `primary`      | `primary`, `secondary`, `tertiary`, or `surface`.               |
| `label`      | string  | `null`         | Text label for extended FABs.                                   |
| `position`   | string  | `bottom-right` | `bottom-right`, `bottom-left`, `top-right`, `top-left`, `none`. |
| `lowered`    | boolean | `false`        | Reduces elevation when overlays appear.                         |
| `disabled`   | boolean | `false`        | Disables interaction.                                           |
| `speed-dial` | boolean | `false`        | Enables Speed Dial mode.                                        |

## Properties

| Property | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| `isOpen` | boolean | Read-only open state for Speed Dial. |

## Events

| Event                 | Detail              | Description                                |
| --------------------- | ------------------- | ------------------------------------------ |
| `ds-fab:click`        | `{ size, color }`   | Fired when a standard FAB is clicked.      |
| `ds-fab:open`         | `-`                 | Fired when Speed Dial opens.               |
| `ds-fab:close`        | `-`                 | Fired when Speed Dial closes.              |
| `ds-fab-action:click` | `{ action, index }` | Fired when a Speed Dial action is clicked. |

## Methods

| Method              | Description                          |
| ------------------- | ------------------------------------ |
| `addAction(action)` | Add a Speed Dial action.             |
| `clearActions()`    | Remove all Speed Dial actions.       |
| `open()`            | Open the Speed Dial menu.            |
| `close()`           | Close the Speed Dial menu.           |
| `toggle()`          | Toggle Speed Dial open/closed state. |

## CSS Custom Properties

| Property                    | Default                     | Description                            |
| --------------------------- | --------------------------- | -------------------------------------- |
| `--ds-fab-size-sm`          | `var(--ds-size-control-md)` | Small FAB size.                        |
| `--ds-fab-size-md`          | `56px`                      | Default FAB size.                      |
| `--ds-fab-size-lg`          | `96px`                      | Large FAB size.                        |
| `--ds-fab-icon-size-sm`     | `var(--ds-size-icon-lg)`    | Icon size for small FABs.              |
| `--ds-fab-icon-size-md`     | `var(--ds-size-icon-lg)`    | Icon size for default/extended FABs.   |
| `--ds-fab-icon-size-lg`     | `36px`                      | Icon size for large FABs.              |
| `--ds-fab-extended-padding` | `20px`                      | Horizontal padding for extended FABs.  |
| `--ds-fab-extended-gap`     | `12px`                      | Gap between icon and label (extended). |
| `--ds-fab-action-size`      | `var(--ds-size-control-md)` | Speed Dial action button size.         |
| `--ds-fab-action-gap`       | `16px`                      | Spacing between Speed Dial actions.    |
| `--ds-fab-action-offset`    | `72px`                      | Vertical offset for Speed Dial stack.  |
| `--ds-fab-action-radius`    | `12px`                      | Corner radius for Speed Dial buttons.  |

## Speed Dial Example

```javascript
const fab = document.querySelector("ds-fab");

fab.setAttribute("speed-dial", "");
fab.addAction({ icon: "edit", label: "Edit" });
fab.addAction({ icon: "share", label: "Share" });

fab.addEventListener("ds-fab-action:click", (event) => {
  console.log(event.detail.action.label);
});
```

## Accessibility

- Keyboard accessible with Tab navigation.
- Enter or Space triggers the action.
- Uses `aria-label` from `label` or fallback text.
- Disabled state blocks pointer and keyboard input.

## MD3 Reference

[Floating Action Button - Material Design 3](https://m3.material.io/components/floating-action-button)

# DS Menu

Material Design 3 anchored menu component with keyboard navigation and selectable menu items.

## Components

- ds-menu: menu surface and interaction controller
- ds-menu-item: individual action row, divider row, or selected state row

## Basic Usage

```html
<ds-button id="menu-trigger">Open Menu</ds-button>
<ds-menu anchor="menu-trigger">
  <ds-menu-item>Profile</ds-menu-item>
  <ds-menu-item>Settings</ds-menu-item>
  <ds-menu-item divider></ds-menu-item>
  <ds-menu-item>Sign out</ds-menu-item>
</ds-menu>
```

## Attributes

### ds-menu

- anchor: string, ID of the anchor element
- open: boolean, opens menu when present

### ds-menu-item

- disabled: boolean, disables item interaction
- selected: boolean, marks item as selected
- divider: boolean, renders divider row
- keep-open: boolean, prevents auto-close after click

## Events

- ds-menu:open
- ds-menu:close
- ds-menu:select with detail { item }

## Methods

- open()
- close()
- toggle()

## Slots

### ds-menu-item

- default: item label text
- leading: icon or leading visual
- trailing: shortcuts, counts, or hints

## Keyboard Support

- ArrowDown: focus next item
- ArrowUp: focus previous item
- Enter or Space: select focused item
- Escape: close menu
- Tab: close menu

## Sizing Tokens

Menu sizing defaults map to global tokens and can be overridden with CSS custom properties:

- --ds-menu-item-min-height (defaults to --ds-size-control-lg)
- --ds-menu-item-leading-size (defaults to --ds-size-icon-lg)
- --ds-menu-container-padding-block (defaults to --ds-space-2)

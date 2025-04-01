# API

## z-menu <span class="api-type-label component">Component</span>

A dropdown menu component that supports custom triggers and menu items.

### Properties

| Property       | Description               | Type                                           | Default      |
| -------------- | ------------------------- | ---------------------------------------------- | ------------ |
| `[isOpen]`     | Controls menu visibility  | `boolean`                                      | `false`      |
| `[zSize]`      | Size of the menu dropdown | `default\|sm\|lg`                              | `default`    |
| `[zPlacement]` | Menu dropdown position    | `bottom-start\|bottom-end\|top-start\|top-end` | `bottom-end` |

### Content Projection Slots

| Slot           | Description                    |
| -------------- | ------------------------------ |
| `menu-trigger` | Element that triggers the menu |
| `<default>`    | Menu items content             |

## z-menu-item <span class="api-type-label component">Component</span>

Individual clickable items within the menu.

### Properties

| Property     | Description            | Type      | Default |
| ------------ | ---------------------- | --------- | ------- |
| `[disabled]` | Disables the menu item | `boolean` | `false` |

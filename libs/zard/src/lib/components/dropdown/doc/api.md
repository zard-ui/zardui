# API

## z-dropdown <span class="api-type-label component">Component</span>

A dropdown component that supports custom triggers and dropdown items.

### Properties

| Property       | Description                  | Type                                           | Default      |
| -------------- | ---------------------------- | ---------------------------------------------- | ------------ |
| `[isOpen]`     | Controls dropdown visibility | `boolean`                                      | `false`      |
| `[zSize]`      | Size of the dropdown         | `default\|sm\|lg`                              | `default`    |
| `[zPlacement]` | Dropdown position            | `bottom-start\|bottom-end\|top-start\|top-end` | `bottom-end` |

### Content Projection Slots

| Slot               | Description                        |
| ------------------ | ---------------------------------- |
| `dropdown-trigger` | Element that triggers the dropdown |
| `<default>`        | Dropdown items content             |

## z-dropdown-item <span class="api-type-label component">Component</span>

Individual clickable items within the dropdown.

### Properties

| Property     | Description                | Type      | Default |
| ------------ | -------------------------- | --------- | ------- |
| `[disabled]` | Disables the dropdown item | `boolean` | `false` |

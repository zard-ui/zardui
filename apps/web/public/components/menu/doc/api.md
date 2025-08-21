# Menu API

## z-menu

The main menu container component.

| Property             | Type                                             | Default      | Description                                |
| -------------------- | ------------------------------------------------ | ------------ | ------------------------------------------ |
| `zMode`              | `"horizontal" \| "vertical" \| "inline"`         | `"vertical"` | The display mode of the menu               |
| `zTheme`             | `"light" \| "dark"`                              | `"light"`    | The theme style of the menu                |
| `zInlineCollapsed`   | `boolean`                                        | `false`      | Whether the inline menu is collapsed       |
| `zSelectable`        | `boolean`                                        | `true`       | Whether menu items can be selected         |
| `zOpenKeys`          | `string[]`                                       | `[]`         | Array of currently opened submenu keys     |
| `zSelectedKeys`      | `string[]`                                       | `[]`         | Array of currently selected menu item keys |
| `(zOpenChange)`      | `EventEmitter<string[]>`                         | -            | Emitted when submenu open state changes    |
| `(zSelectionChange)` | `EventEmitter<string[]>`                         | -            | Emitted when menu item selection changes   |
| `(zItemClick)`       | `EventEmitter<{key: string, item: HTMLElement}>` | -            | Emitted when a menu item is clicked        |
| `class`              | `ClassValue`                                     | `''`         | Additional CSS classes                     |

## z-menu-item

Directive for menu items.

| Property    | Type               | Default | Description                         |
| ----------- | ------------------ | ------- | ----------------------------------- |
| `zKey`      | `string`           | `''`    | Unique identifier for the menu item |
| `zDisabled` | `boolean`          | `false` | Whether the menu item is disabled   |
| `zSelected` | `boolean`          | `false` | Whether the menu item is selected   |
| `zTitle`    | `string`           | `''`    | Title text for the menu item        |
| `zIcon`     | `string`           | `''`    | Icon to display in the menu item    |
| `zLevel`    | `1 \| 2 \| 3 \| 4` | `1`     | Nesting level for indentation       |
| `class`     | `ClassValue`       | `''`    | Additional CSS classes              |

## z-submenu

Component for creating nested submenus.

| Property        | Type                    | Default  | Description                             |
| --------------- | ----------------------- | -------- | --------------------------------------- |
| `zKey`          | `string`                | `''`     | Unique identifier for the submenu       |
| `zTitle`        | `string`                | `''`     | Title text for the submenu              |
| `zIcon`         | `string`                | `''`     | Icon to display in the submenu header   |
| `zOpen`         | `boolean`               | `false`  | Whether the submenu is open             |
| `zDisabled`     | `boolean`               | `false`  | Whether the submenu is disabled         |
| `zPopupOffset`  | `[number, number]`      | `[0, 0]` | Offset for popup positioning [x, y]     |
| `zLevel`        | `number`                | `1`      | Nesting level for indentation           |
| `(zOpenChange)` | `EventEmitter<boolean>` | -        | Emitted when submenu open state changes |
| `class`         | `ClassValue`            | `''`     | Additional CSS classes                  |

## z-menu-group

Component for grouping related menu items.

| Property | Type         | Default | Description                   |
| -------- | ------------ | ------- | ----------------------------- |
| `zTitle` | `string`     | `''`    | Title text for the menu group |
| `zLevel` | `number`     | `1`     | Nesting level for indentation |
| `class`  | `ClassValue` | `''`    | Additional CSS classes        |

## z-menu-divider

Directive for visual separation between menu items.

| Property | Type         | Default | Description            |
| -------- | ------------ | ------- | ---------------------- |
| `class`  | `ClassValue` | `''`    | Additional CSS classes |

# 🚀 New Component: [Component] Menu

## 📖 Description

The `Menu` is a versatile navigation component used for displaying hierarchical navigation options. It supports multiple modes including horizontal navigation, vertical navigation, and inline submenu display. The menu is essential for website navigation, helping users jump between different sections quickly. It includes support for top navigation, side navigation, collapsible inline menus, and dropdown submenus. The component is perfect for building complex navigation systems with multi-level menu structures, similar to ng-zorro's comprehensive menu implementation.

## 🎨 References

- shadcn/ui: [Navigation Menu UI](https://ui.shadcn.com/docs/components/navigation-menu) | [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/navigation-menu.tsx)
- ng-zorro: [Menu UI](https://ng.ant.design/components/menu/en) | [Source Code](https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components/menu)

## 📦 Expected API

### **z-menu (Component)**

| Name                 | Type                                     | Required | Description                                    |
| -------------------- | ---------------------------------------- | -------- | ---------------------------------------------- |
| `zMode`              | `"horizontal" \| "vertical" \| "inline"` | No       | The display mode of the menu                   |
| `zTheme`             | `"light" \| "dark"`                      | No       | The theme style of the menu                    |
| `zInlineCollapsed`   | `boolean`                                | No       | Specifies whether the inline menu is collapsed |
| `zSelectable`        | `boolean`                                | No       | Whether menu items can be selected             |
| `zOpenKeys`          | `string[]`                               | No       | Array of currently opened submenu keys         |
| `zSelectedKeys`      | `string[]`                               | No       | Array of currently selected menu item keys     |
| `(zOpenChange)`      | `EventEmitter<string[]>`                 | No       | Emitted when submenu open state changes        |
| `(zSelectionChange)` | `EventEmitter<string[]>`                 | No       | Emitted when menu item selection changes       |
| `(zItemClick)`       | `EventEmitter<{key: string, item: any}>` | No       | Emitted when a menu item is clicked            |

### **z-menu-item (Directive)**

| Name        | Type      | Required | Description                         |
| ----------- | --------- | -------- | ----------------------------------- |
| `zKey`      | `string`  | No       | Unique identifier for the menu item |
| `zDisabled` | `boolean` | No       | Whether the menu item is disabled   |
| `zSelected` | `boolean` | No       | Whether the menu item is selected   |
| `zTitle`    | `string`  | No       | Title text for the menu item        |
| `zIcon`     | `string`  | No       | Icon to display in the menu item    |

### **z-submenu (Component)**

| Name            | Type                    | Required | Description                             |
| --------------- | ----------------------- | -------- | --------------------------------------- |
| `zKey`          | `string`                | No       | Unique identifier for the submenu       |
| `zTitle`        | `string`                | No       | Title text for the submenu              |
| `zIcon`         | `string`                | No       | Icon to display in the submenu header   |
| `zOpen`         | `boolean`               | No       | Whether the submenu is open             |
| `zDisabled`     | `boolean`               | No       | Whether the submenu is disabled         |
| `zPopupOffset`  | `[number, number]`      | No       | Offset for popup positioning            |
| `(zOpenChange)` | `EventEmitter<boolean>` | No       | Emitted when submenu open state changes |

### **z-menu-group (Component)**

| Name     | Type     | Required | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `zTitle` | `string` | No       | Title text for the menu group |

### **z-menu-divider (Directive)**

| Name | Type | Required | Description                       |
| ---- | ---- | -------- | --------------------------------- |
| -    | -    | -        | Visual divider between menu items |

## ✅ Acceptance Criteria

- [ ] Matches the ng-zorro menu references and functionality
- [ ] Includes comprehensive unit tests for all components and directives
- [ ] Responsive and accessible (a11y) with proper ARIA attributes
- [ ] Supports dark mode theming
- [ ] Properly handles horizontal, vertical, and inline menu modes
- [ ] Supports collapsible inline menus with smooth animations
- [ ] Implements keyboard navigation (arrow keys, enter, escape)
- [ ] Supports nested submenus with proper positioning
- [ ] Handles menu item selection and highlighting
- [ ] Provides proper TypeScript definitions
- [ ] Includes comprehensive documentation and examples
- [ ] Supports custom icons and content projection
- [ ] Handles router integration for navigation

**Labels:** enhancement

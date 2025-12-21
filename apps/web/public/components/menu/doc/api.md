# Menu API Reference

## Components

### z-menu-label <span class="api-type-label component">Component</span>

Label component for grouping menu items.

| Property  | Description                     | Type         | Default |
| --------- | ------------------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes          | `ClassValue` | `''`    |
| `[inset]` | Adds left padding for alignment | `boolean`    | `false` |

### z-menu-shortcut <span class="api-type-label component">Component</span>

Component for displaying keyboard shortcuts in menu items.

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

## Directives

### z-menu <span class="api-type-label directive">Directive</span>

The trigger directive that opens the menu when interacted with.

| Property            | Description                              | Type                 | Default        |
| ------------------- | ---------------------------------------- | -------------------- | -------------- |
| `[zMenuTriggerFor]` | Reference to the menu template           | `TemplateRef<void>`  | `required`     |
| `[zDisabled]`       | Whether the trigger is disabled          | `boolean`            | `false`        |
| `[zTrigger]`        | How the menu is triggered                | `'click' \| 'hover'` | `'click'`      |
| `[zHoverDelay]`     | Delay in ms before closing on hover exit | `number`             | `100`          |
| `[zPlacement]`      | Menu position relative to trigger        | `ZardMenuPlacement`  | `'bottomLeft'` |

### z-context-menu <span class="api-type-label directive">Directive</span>

The trigger directive that opens context menu

| Property                   | Description                           | Type                | Default    |
| -------------------------- | ------------------------------------- | ------------------- | ---------- |
| `[zContextMenuTriggerFor]` | Reference to the context menu content | `TemplateRef<void>` | `required` |

### z-menu-content <span class="api-type-label directive">Directive</span>

Container directive for menu items.

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

### z-menu-item <span class="api-type-label directive">Directive</span>

Individual menu item directive.

| Property              | Description                    | Type           | Default |
| --------------------- | ------------------------------ | -------------- | ------- |
| `[zDisabled]`         | Whether the item is disabled   | `boolean`      | `false` |
| `[zInset]`            | Add left padding for alignment | `boolean`      | `false` |
| `[class]`             | Additional CSS classes         | `ClassValue`   | `''`    |
| `[menuItemTriggered]` | Emits when item is clicked     | `EventEmitter` |         |

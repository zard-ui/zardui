# Menu API Reference

## Directives

### z-menu

The trigger directive that opens the menu when interacted with.

| Property            | Description                              | Type                 | Default        |
| ------------------- | ---------------------------------------- | -------------------- | -------------- |
| `[zMenuTriggerFor]` | Reference to the menu template           | `TemplateRef`        | `required`     |
| `[zDisabled]`       | Whether the trigger is disabled          | `boolean`            | `false`        |
| `[zTrigger]`        | How the menu is triggered                | `'click' \| 'hover'` | `'click'`      |
| `[zHoverDelay]`     | Delay in ms before closing on hover exit | `number`             | `100`          |
| `[zPlacement]`      | Menu position relative to trigger        | `ZardMenuPlacement`  | `'bottomLeft'` |

### z-menu-content

Container directive for menu items.

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

### z-menu-item

Individual menu item directive.

| Property              | Description                    | Type           | Default |
| --------------------- | ------------------------------ | -------------- | ------- |
| `[zDisabled]`         | Whether the item is disabled   | `boolean`      | `false` |
| `[zInset]`            | Add left padding for alignment | `boolean`      | `false` |
| `[class]`             | Additional CSS classes         | `ClassValue`   | `''`    |
| `[menuItemTriggered]` | Emits when item is clicked     | `EventEmitter` |         |

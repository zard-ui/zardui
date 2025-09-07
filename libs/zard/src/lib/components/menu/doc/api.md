# Menu API Reference

## Directives

### z-menu

The trigger directive that opens the menu when interacted with.

| Input           | Type               | Default  | Description                              |
| --------------- | ------------------ | -------- | ---------------------------------------- |
| zMenuTriggerFor | TemplateRef        | required | Reference to the menu template           |
| zDisabled       | boolean            | false    | Whether the trigger is disabled          |
| zTrigger        | 'click' \| 'hover' | 'click'  | How the menu is triggered                |
| zHoverDelay     | number             | 100      | Delay in ms before closing on hover exit |

### z-menu-content

Container directive for menu items.

| Input | Type       | Default | Description            |
| ----- | ---------- | ------- | ---------------------- |
| class | ClassValue | ''      | Additional CSS classes |

### z-menu-item

Individual menu item directive.

| Input     | Type       | Default | Description                    |
| --------- | ---------- | ------- | ------------------------------ |
| zDisabled | boolean    | false   | Whether the item is disabled   |
| zInset    | boolean    | false   | Add left padding for alignment |
| class     | ClassValue | ''      | Additional CSS classes         |

| Output            | Type         | Description                |
| ----------------- | ------------ | -------------------------- |
| menuItemTriggered | EventEmitter | Emits when item is clicked |

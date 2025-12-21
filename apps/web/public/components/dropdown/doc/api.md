# API

## z-dropdown (Directive) <span class="api-type-label directive">Directive</span>

A dropdown trigger directive that handles dropdown interactions.

### Properties

| Property          | Description                        | Type                               | Default   |
| ----------------- | ---------------------------------- | ---------------------------------- | --------- |
| `[zDropdownMenu]` | Reference to dropdown menu content | `ZardDropdownMenuContentComponent` | -         |
| `[zTrigger]`      | Trigger type for dropdown          | `'click' \| 'hover'`               | `'click'` |
| `[zDisabled]`     | Disables the dropdown trigger      | `boolean`                          | `false`   |

## z-dropdown-menu <span class="api-type-label component">Component</span>

Legacy dropdown component with built-in overlay management.

### Properties

| Property     | Description            | Type         | Default |
| ------------ | ---------------------- | ------------ | ------- |
| `[class]`    | Additional CSS classes | `ClassValue` | `''`    |
| `[disabled]` | Disables the dropdown  | `boolean`    | `false` |

### Events

| Event          | Description                         | Type      |
| -------------- | ----------------------------------- | --------- |
| `(openChange)` | Emitted when dropdown state changes | `boolean` |

### Content Projection Slots

| Slot                 | Description                        |
| -------------------- | ---------------------------------- |
| `[dropdown-trigger]` | Element that triggers the dropdown |
| `<default>`          | Dropdown items content             |

## z-dropdown-menu-content <span class="api-type-label component">Component</span>

Container for dropdown menu items with proper accessibility attributes.

### Properties

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

## z-dropdown-menu-item <span class="api-type-label component">Component</span>

Individual clickable items within the dropdown menu.

### Properties

| Property     | Description                     | Type                         | Default     |
| ------------ | ------------------------------- | ---------------------------- | ----------- |
| `[variant]`  | Visual variant of the item      | `'default' \| 'destructive'` | `'default'` |
| `[inset]`    | Adds left padding for alignment | `boolean`                    | `false`     |
| `[disabled]` | Disables the dropdown item      | `boolean`                    | `false`     |
| `[class]`    | Additional CSS classes          | `ClassValue`                 | `''`        |

## ZardDropdownService <span class="api-type-label service">Service</span>

Global service for managing dropdown state and interactions.

### Methods

| Method     | Description                 | Parameters                                                                                           |
| ---------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `toggle()` | Toggles dropdown visibility | `triggerElement: ElementRef`, `template: TemplateRef<unknown>`, `viewContainerRef: ViewContainerRef` |
| `open()`   | Opens the dropdown          | `triggerElement: ElementRef`, `template: TemplateRef<unknown>`, `viewContainerRef: ViewContainerRef` |
| `close()`  | Closes the dropdown         | -                                                                                                    |

### Properties

| Property   | Description            | Type              |
| ---------- | ---------------------- | ----------------- |
| `isOpen()` | Current dropdown state | `Signal<boolean>` |

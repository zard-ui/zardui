# Context Menu

The context menu component provides a right-click menu that reuses the same menu content structure and supports the same mouse and keyboard interactivity as the regular menu components.

## Usage

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZardDividerComponent } from '@zard/divider';
import { ZardDropdownMenuShortcutComponent } from '@zard/dropdown';
import { ZardIconComponent } from '@zard/icon';
import { ZardMenuImports } from '@zard/menu';

@Component({
  selector: 'z-demo-context-menu',
  imports: [ZardMenuImports, ZardDividerComponent, ZardIconComponent, ZardDropdownMenuShortcutComponent],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="contextMenu"
      class="flex h-38 w-75 items-center justify-center rounded-md border border-dashed text-sm"
    >
      Right click here
    </div>

    <ng-template #contextMenu>
      <div z-menu-content class="w-48">
        <button type="button" z-menu-item (click)="log('Back')">
          Back
          <z-dropdown-menu-shortcut>⌘[</z-dropdown-menu-shortcut>
        </button>
        <button type="button" z-menu-item (click)="log('Forward')" zDisabled>
          Forward
          <z-dropdown-menu-shortcut>⌘]</z-dropdown-menu-shortcut>
        </button>
        <button type="button" z-menu-item (click)="log('Reload')">
          Reload
          <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
        </button>
        <z-divider zSpacing="sm" />
        <button
          type="button"
          z-menu-item
          z-menu
          [zMenuTriggerFor]="moreTools"
          zPlacement="rightTop"
          class="justify-between"
        >
          <div class="flex items-center">More Tools</div>
          <z-icon zType="chevron-right" />
        </button>
      </div>
    </ng-template>

    <ng-template #moreTools>
      <div z-menu-content class="w-48">
        <button type="button" z-menu-item (click)="log('Save Page')">Save Page...</button>
        <button type="button" z-menu-item (click)="log('Create Shortcut')">Create Shortcut...</button>
        <button type="button" z-menu-item (click)="log('Name Window')">Name Window...</button>
        <z-divider zSpacing="sm" />
        <button type="button" z-menu-item (click)="log('Developer Tools')">Developer Tools</button>
        <z-divider zSpacing="sm" />
        <button type="button" z-menu-item zType="destructive" (click)="log('Delete')">Delete</button>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoContextMenu {
  log(item: string) {
    console.log('Navigate to:', item);
  }
}
```

## API

### ZardContextMenuDirective

#### Inputs

| Input                    | Type                | Default                                                      | Description                                          |
| ------------------------ | ------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| `zContextMenuTriggerFor` | `TemplateRef`       | **Required**. Template reference to the context menu content |
| `zDisabled`              | `boolean`           | `false`                                                      | Whether the context menu is disabled                 |
| `zPlacement`             | `ZardMenuPlacement` | `'bottomRight'`                                              | Position of the context menu relative to the trigger |

#### Methods

| Method                                         | Parameters           | Description                                                                       |
| ---------------------------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| `open(coordinates?: { x: number; y: number })` | Optional coordinates | Programmatically open the context menu at specified coordinates or element center |
| `close()`                                      | -                    | Programmatically close the context menu                                           |

## Accessibility

The context menu component follows WCAG AA accessibility guidelines:

### Keyboard Support

- **ContextMenu key**: Opens the context menu at the default position
- **Shift + F10**: Opens the context menu at the default position
- **Escape**: Closes the context menu (handled by CDK)
- **Arrow keys**: Navigate between menu items (handled by CDK)
- **Enter/Space**: Activate focused menu item (handled by CDK)

### Screen Reader Support

- Proper ARIA attributes are automatically applied by the underlying CDK menu
- Menu items have appropriate roles and states announced
- Disabled state is properly communicated to screen readers

### Focus Management

- Focus is automatically managed when the menu opens and closes
- Focus returns to the trigger element when menu is closed
- Keyboard-only users can fully operate the context menu

## Features

- **Reuses existing menu structure**: Leverages all existing menu components (`z-menu-content`, `z-menu-item`, etc.)
- **Mouse interaction**: Right-click to open at cursor position
- **Keyboard interaction**: ContextMenu key or Shift+F10 to open at element center
- **Positioning**: Supports all menu placement options (bottomLeft, bottomRight, topLeft, topRight, etc.)
- **Nested menus**: Supports submenu functionality through existing menu triggers
- **Disabled state**: Can be disabled to prevent context menu from opening
- **Programmatic control**: Open/close methods for programmatic control

## Browser Support

The context menu works in all modern browsers that support the following:

- `contextmenu` event
- `keydown` event
- ARIA attributes (for accessibility)

## Notes

- The context menu automatically prevents the default browser context menu when right-clicking
- When disabled, the context menu prevents default behavior but doesn't open
- Position is calculated automatically based on cursor position for mouse events
- Keyboard triggers open the menu at the center of the trigger element
- All styling and behavior is inherited from the existing menu system

```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardDropdownMenuShortcutComponent } from '../../dropdown/dropdown-shortcut.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'z-demo-context-menu',
  imports: [ZardMenuModule, ZardDividerComponent, ZardIconComponent, ZardDropdownMenuShortcutComponent],
  standalone: true,
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
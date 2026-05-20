import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideCopy,
  lucideShare,
  lucideTrash,
  lucideTriangleAlert,
  lucideUserRoundX,
  lucideVolumeOff,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator/separator.component';

@Component({
  selector: 'z-demo-button-group-dropdown',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardSeparatorComponent, ...ZardDropdownImports, NgIcon],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline">Follow</button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="icon"
        z-dropdown
        [zDropdownMenu]="menu"
        aria-label="More options"
      >
        <ng-icon name="lucideChevronDown" />
      </button>
      <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
        <z-dropdown-menu-item>
          <ng-icon name="lucideVolumeOff" />
          Mute Conversation
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCheck" />
          Mark as Read
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideTriangleAlert" />
          Report Conversation
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideUserRoundX" />
          Block User
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideShare" />
          Share Conversation
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCopy" />
          Copy Conversation
        </z-dropdown-menu-item>
        <z-separator class="my-1" />
        <z-dropdown-menu-item variant="destructive">
          <ng-icon name="lucideTrash" />
          Delete Conversation
        </z-dropdown-menu-item>
      </z-dropdown-menu-content>
    </z-button-group>
  `,
  viewProviders: [
    provideIcons({
      lucideChevronDown,
      lucideVolumeOff,
      lucideCheck,
      lucideTriangleAlert,
      lucideUserRoundX,
      lucideShare,
      lucideCopy,
      lucideTrash,
    }),
  ],
})
export class ZardDemoButtonGroupDropdownComponent {}

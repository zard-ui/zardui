import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-dropdown',
  imports: [ZardInputComponent, NgIcon, ZardDropdownImports, ...ZardInputGroupImports],
  viewProviders: [provideIcons({ lucideEllipsis, lucideChevronDown })],
  template: `
    <div class="grid w-full min-w-sm gap-4">
      <z-input-group>
        <input z-input placeholder="Enter file name" />
        <z-input-group-addon zAlign="inline-end">
          <button z-input-group-button zSize="icon-xs" aria-label="More" z-dropdown [zDropdownMenu]="moreMenu">
            <ng-icon name="lucideEllipsis" />
          </button>
          <z-dropdown-menu-content #moreMenu="zDropdownMenuContent">
            <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
            <z-dropdown-menu-item>Copy path</z-dropdown-menu-item>
            <z-dropdown-menu-item>Open location</z-dropdown-menu-item>
          </z-dropdown-menu-content>
        </z-input-group-addon>
      </z-input-group>

      <z-input-group class="[--radius:1rem]">
        <input z-input placeholder="Enter search query" />
        <z-input-group-addon zAlign="inline-end">
          <button z-input-group-button class="pr-1.5! text-xs" z-dropdown [zDropdownMenu]="searchMenu">
            Search In...
            <ng-icon name="lucideChevronDown" class="size-3" />
          </button>
          <z-dropdown-menu-content #searchMenu="zDropdownMenuContent" class="[--radius:0.95rem]">
            <z-dropdown-menu-item>Documentation</z-dropdown-menu-item>
            <z-dropdown-menu-item>Blog Posts</z-dropdown-menu-item>
            <z-dropdown-menu-item>Changelog</z-dropdown-menu-item>
          </z-dropdown-menu-content>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
})
export class ZardDemoInputGroupDropdownComponent {}

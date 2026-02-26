import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-block-button-group-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardButtonGroupComponent, ...ZardDropdownImports, ZardIconComponent],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button z-button zType="outline" zSize="sm" class="size-8!" aria-label="Go Back">
          <z-icon zType="arrow-left" />
        </button>
      </z-button-group>
      <z-button-group>
        <button z-button zType="outline" zSize="sm">Archive</button>
        <button z-button zType="outline" zSize="sm">Report</button>
      </z-button-group>
      <z-button-group>
        <button z-button zType="outline" zSize="sm">Snooze</button>
        <button
          z-button
          zType="outline"
          zSize="sm"
          class="size-8! rounded-r-md!"
          aria-label="More Options"
          z-dropdown
          [zDropdownMenu]="moreOptionsMenu"
        >
          <z-icon zType="ellipsis" />
        </button>
        <z-dropdown-menu-content #moreOptionsMenu="zDropdownMenuContent" zAlign="end" class="w-48 [--radius:1rem]">
          <z-dropdown-menu-item>
            <z-icon zType="mail" class="size-4" />
            Mark as Read
          </z-dropdown-menu-item>
          <z-dropdown-menu-item>
            <z-icon zType="archive" class="size-4" />
            Archive
          </z-dropdown-menu-item>
          <div class="bg-border my-1 h-px"></div>
          <z-dropdown-menu-item>
            <z-icon zType="clock" class="size-4" />
            Snooze
          </z-dropdown-menu-item>
          <z-dropdown-menu-item>
            <z-icon zType="calendar-plus" class="size-4" />
            Add to Calendar
          </z-dropdown-menu-item>
          <z-dropdown-menu-item>
            <z-icon zType="list-filter-plus" class="size-4" />
            Add to List
          </z-dropdown-menu-item>
          <z-dropdown-menu-item z-dropdown [zDropdownMenu]="labelSubmenu">
            <z-icon zType="tag" class="size-4" />
            <span class="flex-1">Label As...</span>
            <z-icon zType="chevron-right" class="size-4" />
          </z-dropdown-menu-item>
          <z-dropdown-menu-content #labelSubmenu="zDropdownMenuContent" zSide="right">
            <z-dropdown-menu-item (click)="label.set('personal')">
              @if (label() === 'personal') {
                <z-icon zType="circle-small" class="size-4 fill-current" />
              }
              Personal
            </z-dropdown-menu-item>
            <z-dropdown-menu-item (click)="label.set('work')">
              @if (label() === 'work') {
                <z-icon zType="circle-small" class="size-4 fill-current" />
              }
              Work
            </z-dropdown-menu-item>
            <z-dropdown-menu-item (click)="label.set('other')">
              @if (label() === 'other') {
                <z-icon zType="circle-small" class="size-4 fill-current" />
              }
              Other
            </z-dropdown-menu-item>
          </z-dropdown-menu-content>
          <div class="bg-border my-1 h-px"></div>
          <z-dropdown-menu-item class="text-red-500 focus:text-red-500">
            <z-icon zType="trash" class="size-4" />
            Trash
          </z-dropdown-menu-item>
        </z-dropdown-menu-content>
      </z-button-group>
    </z-button-group>
  `,
})
export class BlockButtonGroupToolbarComponent {
  readonly label = signal('personal');
}

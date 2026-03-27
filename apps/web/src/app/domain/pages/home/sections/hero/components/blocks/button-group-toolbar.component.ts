import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArchive,
  lucideCalendarPlus,
  lucideChevronRight,
  lucideCircle,
  lucideClock,
  lucideEllipsis,
  lucideListFilter,
  lucideMail,
  lucideTag,
  lucideTrash,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardDropdownImports } from '@zard/components/dropdown';

@Component({
  selector: 'z-block-button-group-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardButtonGroupComponent, ...ZardDropdownImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideEllipsis,
      lucideMail,
      lucideArchive,
      lucideClock,
      lucideCalendarPlus,
      lucideListFilter,
      lucideTag,
      lucideChevronRight,
      lucideCircle,
      lucideTrash,
    }),
  ],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button z-button zType="outline" zSize="sm" class="size-7!" aria-label="Go Back">
          <ng-icon name="lucideArrowLeft" />
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
          class="size-7! rounded-r-md!"
          aria-label="More Options"
          z-dropdown
          [zDropdownMenu]="moreOptionsMenu"
        >
          <ng-icon name="lucideEllipsis" />
        </button>
        <z-dropdown-menu-content #moreOptionsMenu="zDropdownMenuContent" zAlign="end" class="w-48 [--radius:1rem]">
          <z-dropdown-menu-item>
            <ng-icon name="lucideMail" class="size-4" />
            Mark as Read
          </z-dropdown-menu-item>
          <z-dropdown-menu-item>
            <ng-icon name="lucideArchive" class="size-4" />
            Archive
          </z-dropdown-menu-item>
          <div class="bg-border my-1 h-px"></div>
          <z-dropdown-menu-item>
            <ng-icon name="lucideClock" class="size-4" />
            Snooze
          </z-dropdown-menu-item>
          <z-dropdown-menu-item>
            <ng-icon name="lucideCalendarPlus" class="size-4" />
            Add to Calendar
          </z-dropdown-menu-item>
          <z-dropdown-menu-item>
            <ng-icon name="lucideListFilter" class="size-4" />
            Add to List
          </z-dropdown-menu-item>
          <z-dropdown-menu-item z-dropdown [zDropdownMenu]="labelSubmenu">
            <ng-icon name="lucideTag" class="size-4" />
            <span class="flex-1">Label As...</span>
            <ng-icon name="lucideChevronRight" class="size-4" />
          </z-dropdown-menu-item>
          <z-dropdown-menu-content #labelSubmenu="zDropdownMenuContent" zSide="right">
            <z-dropdown-menu-item (click)="label.set('personal')">
              @if (label() === 'personal') {
                <ng-icon name="lucideCircle" class="size-4 fill-current" />
              }
              Personal
            </z-dropdown-menu-item>
            <z-dropdown-menu-item (click)="label.set('work')">
              @if (label() === 'work') {
                <ng-icon name="lucideCircle" class="size-4 fill-current" />
              }
              Work
            </z-dropdown-menu-item>
            <z-dropdown-menu-item (click)="label.set('other')">
              @if (label() === 'other') {
                <ng-icon name="lucideCircle" class="size-4 fill-current" />
              }
              Other
            </z-dropdown-menu-item>
          </z-dropdown-menu-content>
          <div class="bg-border my-1 h-px"></div>
          <z-dropdown-menu-item class="text-red-500 focus:text-red-500">
            <ng-icon name="lucideTrash" class="size-4" />
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

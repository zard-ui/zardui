import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArchive,
  lucideCalendarPlus,
  lucideChevronRight,
  lucideClock,
  lucideEllipsis,
  lucideListFilter,
  lucideMailCheck,
  lucideTag,
  lucideTrash2,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardMenuImports } from '@zard/components/menu';

@Component({
  selector: 'z-block-button-group-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardButtonGroupComponent, ...ZardMenuImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideEllipsis,
      lucideMailCheck,
      lucideArchive,
      lucideClock,
      lucideCalendarPlus,
      lucideListFilter,
      lucideTag,
      lucideChevronRight,
      lucideTrash2,
    }),
  ],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button z-button zType="outline" zSize="icon-sm" aria-label="Go Back">
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
          zSize="icon-sm"
          class="rounded-r-md!"
          aria-label="More Options"
          z-menu
          [zMenuTriggerFor]="moreOptionsMenu"
          zPlacement="bottomRight"
        >
          <ng-icon name="lucideEllipsis" />
        </button>
        <ng-template #moreOptionsMenu>
          <div z-menu-content class="w-48 p-1 [&_[z-menu-item]]:gap-1.5">
            <button type="button" z-menu-item>
              <ng-icon name="lucideMailCheck" class="size-4" />
              Mark as Read
            </button>
            <button type="button" z-menu-item>
              <ng-icon name="lucideArchive" class="size-4" />
              Archive
            </button>
            <div class="bg-border my-1 h-px"></div>
            <button type="button" z-menu-item>
              <ng-icon name="lucideClock" class="size-4" />
              Snooze
            </button>
            <button type="button" z-menu-item>
              <ng-icon name="lucideCalendarPlus" class="size-4" />
              Add to Calendar
            </button>
            <button type="button" z-menu-item>
              <ng-icon name="lucideListFilter" class="size-4" />
              Add to List
            </button>
            <button type="button" z-menu-item class="justify-between">
              <div class="flex items-center gap-1.5">
                <ng-icon name="lucideTag" class="size-4" />
                <span>Label As...</span>
              </div>
              <ng-icon name="lucideChevronRight" class="size-4" />
            </button>
            <div class="bg-border my-1 h-px"></div>
            <button type="button" z-menu-item zType="destructive">
              <ng-icon name="lucideTrash2" class="size-4" />
              Trash
            </button>
          </div>
        </ng-template>
      </z-button-group>
    </z-button-group>
  `,
})
export class BlockButtonGroupToolbarComponent {}

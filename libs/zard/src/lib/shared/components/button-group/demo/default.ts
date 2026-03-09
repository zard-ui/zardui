import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideArrowLeft,
  lucideCalendarPlus,
  lucideCheck,
  lucideChevronRight,
  lucideClock,
  lucideEllipsis,
  lucideListFilterPlus,
  lucideTag,
  lucideTrash,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';

@Component({
  selector: 'z-demo-button-group-default',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardMenuImports, ZardDividerComponent],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button type="button" z-button zType="outline" aria-label="Go Back">
          <ng-icon name="lucideArrowLeft" />
        </button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Archive</button>
        <button type="button" z-button zType="outline">Report</button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Snooze</button>
        <button type="button" z-button zType="outline" z-menu [zMenuTriggerFor]="menu">
          <ng-icon name="lucideEllipsis" />

          <ng-template #menu>
            <div z-menu-content class="w-48">
              <button type="button" z-menu-item>
                <ng-icon name="lucideCheck" />
                Mark as Read
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="lucideArchive" />
                Archive
              </button>

              <z-divider zSpacing="sm" />

              <button type="button" z-menu-item>
                <ng-icon name="lucideClock" />
                Snooze
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="lucideCalendarPlus" />
                Add to Calendar
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="lucideListFilterPlus" />
                Add to List
              </button>
              <button
                type="button"
                z-menu-item
                z-menu
                [zMenuTriggerFor]="subMenu"
                zPlacement="rightTop"
                class="justify-between"
              >
                <div class="flex items-center">
                  <ng-icon name="tag" class="mr-1" />
                  Label as
                </div>
                <ng-icon name="lucideChevronRight" />

                <ng-template #subMenu>
                  <div z-menu-content class="w-48">
                    <button type="button" z-menu-item>Personal</button>
                    <button type="button" z-menu-item>Work</button>
                    <button type="button" z-menu-item>Other</button>
                  </div>
                </ng-template>
              </button>

              <z-divider zSpacing="sm" />

              <button type="button" z-menu-item class="text-red-500">
                <ng-icon name="lucideTrash" />
                Trash
              </button>
            </div>
          </ng-template>
        </button>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideEllipsis,
      lucideCheck,
      lucideArchive,
      lucideClock,
      lucideCalendarPlus,
      lucideListFilterPlus,
      lucideTag,
      lucideChevronRight,
      lucideTrash,
    }),
  ],
})
export class ZardDemoButtonGroupDefaultComponent {}

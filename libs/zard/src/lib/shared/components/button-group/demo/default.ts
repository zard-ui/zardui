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
import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator';

@Component({
  selector: 'z-demo-button-group-default',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardNavigationMenuImports, ZardSeparatorComponent],
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
        <button type="button" z-button zType="outline" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="menu">
          <ng-icon name="lucideEllipsis" />

          <ng-template #menu>
            <div z-navigation-menu-content class="w-48">
              <button type="button" z-navigation-menu-link>
                <ng-icon name="lucideCheck" />
                Mark as Read
              </button>
              <button type="button" z-navigation-menu-link>
                <ng-icon name="lucideArchive" />
                Archive
              </button>

              <z-separator class="my-2" />

              <button type="button" z-navigation-menu-link>
                <ng-icon name="lucideClock" />
                Snooze
              </button>
              <button type="button" z-navigation-menu-link>
                <ng-icon name="lucideCalendarPlus" />
                Add to Calendar
              </button>
              <button type="button" z-navigation-menu-link>
                <ng-icon name="lucideListFilterPlus" />
                Add to List
              </button>
              <button
                type="button"
                z-navigation-menu-link
                z-navigation-menu-trigger
                [zNavigationMenuTriggerFor]="subMenu"
                zPlacement="rightTop"
                class="justify-between"
              >
                <div class="flex items-center">
                  <ng-icon name="tag" class="mr-1" />
                  Label as
                </div>
                <ng-icon name="lucideChevronRight" />

                <ng-template #subMenu>
                  <div z-navigation-menu-content class="w-48">
                    <button type="button" z-navigation-menu-link>Personal</button>
                    <button type="button" z-navigation-menu-link>Work</button>
                    <button type="button" z-navigation-menu-link>Other</button>
                  </div>
                </ng-template>
              </button>

              <z-separator class="my-2" />

              <button type="button" z-navigation-menu-link class="text-red-500">
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

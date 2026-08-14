import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideArrowLeft,
  lucideCalendarPlus,
  lucideChevronRight,
  lucideClock,
  lucideEllipsis,
  lucideListFilter,
  lucideMailCheck,
  lucideTag,
  lucideTrash2,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator';

@Component({
  selector: 'z-demo-button-button-group',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardNavigationMenuImports, ZardSeparatorComponent],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Go Back">
          <ng-icon name="lucideArrowLeft" />
        </button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Archive</button>
        <button type="button" z-button zType="outline">Report</button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Snooze</button>
        <button
          type="button"
          z-button
          zType="outline"
          zSize="icon"
          aria-label="More Options"
          z-navigation-menu-trigger
          [zNavigationMenuTriggerFor]="menu"
        >
          <ng-icon name="lucideEllipsis" />

          <ng-template #menu>
            <div z-navigation-menu-content class="w-40">
              <button type="button" z-navigation-menu-link>
                <ng-icon name="lucideMailCheck" />
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
                <ng-icon name="lucideListFilter" />
                Add to List
              </button>
              <button
                type="button"
                z-navigation-menu-link
                z-navigation-menu-trigger
                [zNavigationMenuTriggerFor]="labelMenu"
                zPlacement="rightTop"
                class="justify-between"
              >
                <div class="flex items-center gap-2">
                  <ng-icon name="lucideTag" />
                  Label As...
                </div>
                <ng-icon name="lucideChevronRight" />

                <ng-template #labelMenu>
                  <div z-navigation-menu-content class="w-40">
                    <button type="button" z-navigation-menu-link>Personal</button>
                    <button type="button" z-navigation-menu-link>Work</button>
                    <button type="button" z-navigation-menu-link>Other</button>
                  </div>
                </ng-template>
              </button>

              <z-separator class="my-2" />

              <button type="button" z-navigation-menu-link class="text-destructive">
                <ng-icon name="lucideTrash2" />
                Trash
              </button>
            </div>
          </ng-template>
        </button>
      </z-button-group>
    </z-button-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
})
export class ZardDemoButtonButtonGroupComponent {}

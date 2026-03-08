```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';
import { ZardIconRegistry } from '@/shared/core/icons-registry';

@Component({
  selector: 'z-demo-button-group-default',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardMenuImports, ZardDividerComponent],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button type="button" z-button zType="outline" aria-label="Go Back">
          <ng-icon name="arrow-left" />
        </button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Archive</button>
        <button type="button" z-button zType="outline">Report</button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Snooze</button>
        <button type="button" z-button zType="outline" z-menu [zMenuTriggerFor]="menu">
          <ng-icon name="ellipsis" />

          <ng-template #menu>
            <div z-menu-content class="w-48">
              <button type="button" z-menu-item>
                <ng-icon name="check" />
                Mark as Read
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="archive" />
                Archive
              </button>

              <z-divider zSpacing="sm" />

              <button type="button" z-menu-item>
                <ng-icon name="clock" />
                Snooze
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="calendar-plus" />
                Add to Calendar
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="list-filter-plus" />
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
                <ng-icon name="chevron-right" />

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
                <ng-icon name="trash" />
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
      arrowLeft: ZardIconRegistry['arrow-left'],
      ellipsis: ZardIconRegistry.ellipsis,
      check: ZardIconRegistry.check,
      archive: ZardIconRegistry.archive,
      clock: ZardIconRegistry.clock,
      calendarPlus: ZardIconRegistry['calendar-plus'],
      listFilterPlus: ZardIconRegistry['list-filter-plus'],
      tag: ZardIconRegistry.tag,
      chevronRight: ZardIconRegistry['chevron-right'],
      trash: ZardIconRegistry.trash,
    }),
  ],
})
export class ZardDemoButtonGroupDefaultComponent {}

```
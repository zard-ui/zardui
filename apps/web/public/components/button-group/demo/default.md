```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';

@Component({
  selector: 'z-demo-button-group-default',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent, ZardMenuImports, ZardDividerComponent],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button type="button" z-button zType="outline" aria-label="Go Back">
          <i z-icon zType="arrow-left"></i>
        </button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Archive</button>
        <button type="button" z-button zType="outline">Report</button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Snooze</button>
        <button type="button" z-button zType="outline" z-menu [zMenuTriggerFor]="menu">
          <i z-icon zType="ellipsis"></i>

          <ng-template #menu>
            <div z-menu-content class="w-48">
              <button type="button" z-menu-item>
                <i z-icon zType="check"></i>
                Mark as Read
              </button>
              <button type="button" z-menu-item>
                <i z-icon zType="archive"></i>
                Archive
              </button>

              <z-divider zSpacing="sm" />

              <button type="button" z-menu-item>
                <i z-icon zType="clock"></i>
                Snooze
              </button>
              <button type="button" z-menu-item>
                <i z-icon zType="calendar-plus"></i>
                Add to Calendar
              </button>
              <button type="button" z-menu-item>
                <i z-icon zType="list-filter-plus"></i>
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
                  <i z-icon zType="tag" class="mr-1"></i>
                  Label as
                </div>
                <i z-icon zType="chevron-right"></i>

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
                <i z-icon zType="trash"></i>
                Trash
              </button>
            </div>
          </ng-template>
        </button>
      </z-button-group>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupDefaultComponent {}

```
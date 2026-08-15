import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-demo-navigation-menu-no-viewport',
  imports: [ZardNavigationMenuImports],
  template: `
    <z-navigation-menu [zViewport]="false">
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="overview">Overview</button>

          <ng-template #overview>
            <div z-navigation-menu-content>
              <ul class="w-56">
                <li><a z-navigation-menu-link href="#">Introduction</a></li>
                <li><a z-navigation-menu-link href="#">Installation</a></li>
                <li><a z-navigation-menu-link href="#">Theming</a></li>
              </ul>
            </div>
          </ng-template>
        </li>

        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="resources">Resources</button>

          <ng-template #resources>
            <div z-navigation-menu-content>
              <ul class="w-56">
                <li><a z-navigation-menu-link href="#">Blocks</a></li>
                <li><a z-navigation-menu-link href="#">Changelog</a></li>
                <li><a z-navigation-menu-link href="#">Contributing</a></li>
              </ul>
            </div>
          </ng-template>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNavigationMenuNoViewportComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-demo-navigation-menu-link',
  imports: [ZardNavigationMenuImports, RouterLink, RouterLinkActive],
  template: `
    <z-navigation-menu>
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <a
            z-navigation-menu-link
            routerLink="/docs/components/navigation-menu"
            routerLinkActive
            #navigationMenuLink="routerLinkActive"
            [zActive]="navigationMenuLink.isActive"
            [class]="triggerClass"
          >
            Navigation Menu
          </a>
        </li>
        <li z-navigation-menu-item>
          <a
            z-navigation-menu-link
            routerLink="/docs/components/dropdown"
            routerLinkActive
            #dropdownLink="routerLinkActive"
            [zActive]="dropdownLink.isActive"
            [class]="triggerClass"
          >
            Dropdown
          </a>
        </li>
        <li z-navigation-menu-item>
          <a
            z-navigation-menu-link
            routerLink="/docs/components/tabs"
            routerLinkActive
            #tabsLink="routerLinkActive"
            [zActive]="tabsLink.isActive"
            [class]="triggerClass"
          >
            Tabs
          </a>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNavigationMenuLinkComponent {
  protected readonly triggerClass = navigationMenuTriggerVariants();
}

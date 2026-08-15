import { ChangeDetectionStrategy, Component } from '@angular/core';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-demo-navigation-menu-simple',
  imports: [ZardNavigationMenuImports],
  template: `
    <z-navigation-menu>
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" zActive [class]="triggerClass">Overview</a>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Documentation</a>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Blocks</a>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Changelog</a>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNavigationMenuSimpleComponent {
  /** Reuses the trigger CVA so plain links keep the height and spacing of the bar. */
  protected readonly triggerClass = navigationMenuTriggerVariants();
}

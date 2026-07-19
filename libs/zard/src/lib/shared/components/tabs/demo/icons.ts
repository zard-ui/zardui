import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideAppWindow, lucideCode } from '@ng-icons/lucide';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-icons',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  standalone: true,
  template: `
    <div class="w-full max-w-md">
      <z-tab-group>
        <z-tab label="Preview" zIcon="lucideAppWindow" />
        <z-tab label="Code" zIcon="lucideCode" />
      </z-tab-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideAppWindow, lucideCode })],
})
export class ZardDemoTabsIconsComponent {}

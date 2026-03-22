```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardInputDirective } from '../../input/input.directive';
import { ZardInputGroupComponent } from '../input-group.component';

@Component({
  selector: 'z-demo-input-group-loading',
  imports: [ZardInputGroupComponent, ZardInputDirective, NgIcon],
  template: `
    <div class="flex flex-col space-y-4">
      <z-input-group [zAddonBefore]="search" zLoading>
        <input z-input type="text" placeholder="Search..." />
      </z-input-group>
    </div>

    <ng-template #search><ng-icon name="lucideSearch" /></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupLoadingComponent {}

```
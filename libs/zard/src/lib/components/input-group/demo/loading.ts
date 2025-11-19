import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardInputGroupComponent } from '../input-group.component';

@Component({
  selector: 'z-demo-input-group-loading',
  imports: [ZardInputGroupComponent, ZardInputDirective, ZardIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col space-y-4">
      <z-input-group [zAddonBefore]="search" zLoading>
        <input z-input type="text" placeholder="Search..." />
      </z-input-group>
    </div>

    <ng-template #search><z-icon zType="search" /></ng-template>
  `,
})
export class ZardDemoInputGroupLoadingComponent {}

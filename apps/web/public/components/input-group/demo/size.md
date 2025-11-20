```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '../../input/input.directive';
import { ZardInputGroupComponent } from '../input-group.component';

@Component({
  selector: 'z-demo-input-group-size',
  imports: [ZardInputGroupComponent, ZardInputDirective],
  template: `
    <div class="flex flex-col space-y-4">
      <z-input-group zSize="sm" zAddonBefore="https://" zAddonAfter=".com" class="mb-4">
        <input z-input placeholder="Small" [(value)]="smallValue" />
      </z-input-group>

      <z-input-group zSize="default" zAddonBefore="https://" zAddonAfter=".com" class="mb-4">
        <input z-input placeholder="Default" [(value)]="defaultValue" />
      </z-input-group>

      <z-input-group zSize="lg" zAddonBefore="https://" zAddonAfter=".com">
        <input z-input placeholder="Large" [(value)]="largeValue" />
      </z-input-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputGroupSizeComponent {
  smallValue = '';
  defaultValue = '';
  largeValue = '';
}

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '@ngzard/ui/input';
import { ZardInputGroupComponent } from '@ngzard/ui/input-group';

@Component({
  selector: 'z-demo-input-group-borderless',
  imports: [ZardInputGroupComponent, ZardInputDirective],
  template: `
    <div class="flex flex-col space-y-4">
      <z-input-group zAddonBefore="$" zAddonAfter="USD" class="border-0">
        <input z-input placeholder="0.00" type="number" />
      </z-input-group>

      <z-input-group zAddonBefore="https://" zAddonAfter=".com" class="border-0">
        <input z-input placeholder="example" />
      </z-input-group>

      <z-input-group zAddonBefore="@" class="border-0">
        <input z-input placeholder="username" />
      </z-input-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputGroupBorderlessComponent {}

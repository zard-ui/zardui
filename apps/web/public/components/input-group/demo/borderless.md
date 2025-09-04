```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputGroupComponent } from '../input-group.component';
import { ZardInputDirective } from '../../input/input.directive';

@Component({
  standalone: true,
  imports: [ZardInputGroupComponent, ZardInputDirective],
  template: `
    <div class="flex flex-col space-y-4">
      <z-input-group zPrefix="$" zSuffix="USD" [zBorderless]="true">
        <input z-input placeholder="0.00" type="number" />
      </z-input-group>

      <z-input-group zAddOnBefore="https://" zAddOnAfter=".com" [zBorderless]="true">
        <input z-input placeholder="example" />
      </z-input-group>

      <z-input-group zAddOnBefore="@" [zBorderless]="true">
        <input z-input placeholder="username" />
      </z-input-group>
    </div>
  `,
})
export class ZardDemoInputGroupBorderlessComponent {}

```
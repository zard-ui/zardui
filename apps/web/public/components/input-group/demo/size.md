```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputDirective } from '../../input/input.directive';
import { ZardInputGroupComponent } from '../input-group.component';

@Component({
  selector: 'z-demo-input-group-size',
  standalone: true,
  imports: [ZardInputGroupComponent, ZardInputDirective, FormsModule],
  template: `
    <div class="flex flex-col space-y-4">
      <z-input-group zSize="sm" zAddOnBefore="@" zAddOnAfter=".com" class="mb-4">
        <input z-input placeholder="Small" [(ngModel)]="smallValue" />
      </z-input-group>

      <z-input-group zSize="default" zAddOnBefore="@" zAddOnAfter=".com" class="mb-4">
        <input z-input placeholder="Default" [(ngModel)]="defaultValue" />
      </z-input-group>

      <z-input-group zSize="lg" zAddOnBefore="@" zAddOnAfter=".com">
        <input z-input placeholder="Large" [(ngModel)]="largeValue" />
      </z-input-group>
    </div>
  `,
})
export class ZardDemoInputGroupSizeComponent {
  smallValue = '';
  defaultValue = '';
  largeValue = '';
}

```

import { Component } from '@angular/core';

import { ZardInputGroupComponent } from '../input-group.component';
import { ZardInputDirective } from '../../input/input.directive';

@Component({
  standalone: true,
  imports: [ZardInputGroupComponent, ZardInputDirective],
  template: `
    <z-input-group zAddOnBefore="$" zSuffix="USD" [zStatus]="'error'">
      <input z-input type="number" placeholder="Error" />
    </z-input-group>
    <z-input-group zAddOnBefore="$" zSuffix="USD" [zStatus]="'warning'">
      <input z-input type="number" placeholder="Warning" />
    </z-input-group>
    <z-input-group zAddOnBefore="$" zSuffix="USD" [zStatus]="'success'">
      <input z-input type="number" placeholder="Success" />
    </z-input-group>
  `,
})
export class ZardDemoInputGroupStatusComponent {}

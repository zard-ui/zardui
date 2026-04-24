import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-disabled',
  imports: [ZardToggleComponent],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zAriaLabel="Toggle disabled" zDisabled>Disabled</z-toggle>
      <z-toggle zAriaLabel="Toggle disabled outline" zType="outline" zDisabled>Disabled</z-toggle>
    </div>
  `,
})
export class ZardDemoToggleDisabledComponent {}

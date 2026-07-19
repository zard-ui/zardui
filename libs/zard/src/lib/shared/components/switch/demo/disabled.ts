import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-disabled',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" data-disabled="true" class="w-fit">
      <z-switch zId="switch-disabled-unchecked" zDisabled />
      <label z-field-label for="switch-disabled-unchecked">Disabled</label>
    </div>
  `,
})
export class ZardDemoSwitchDisabledComponent {}

import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-invalid',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" data-invalid="true" class="max-w-sm">
      <div z-field-content>
        <label z-field-label for="switch-terms">Accept terms and conditions</label>
        <p z-field-description>You must accept the terms and conditions to continue.</p>
      </div>
      <z-switch zId="switch-terms" zInvalid />
    </div>
  `,
})
export class ZardDemoSwitchInvalidComponent {}

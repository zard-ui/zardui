import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-disabled',
  imports: [ZardCheckboxComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="mx-auto w-56">
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-checkbox zId="toggle-checkbox-disabled" zDisabled />
        <label z-field-label for="toggle-checkbox-disabled">Enable notifications</label>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxDisabledComponent {}

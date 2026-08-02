import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-invalid',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-56">
      <div z-field zOrientation="horizontal" data-invalid="true">
        <z-checkbox zId="terms-checkbox-invalid" [(ngModel)]="terms" zInvalid />
        <label z-field-label for="terms-checkbox-invalid">Accept terms and conditions</label>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxInvalidComponent {
  terms = false;
}

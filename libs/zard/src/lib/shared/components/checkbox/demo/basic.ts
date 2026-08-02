import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-basic',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-56">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-basic" [(ngModel)]="terms" />
        <label z-field-label for="terms-checkbox-basic">Accept terms and conditions</label>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxBasicComponent {
  terms = false;
}

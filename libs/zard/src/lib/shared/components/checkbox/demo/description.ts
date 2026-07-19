import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-description',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-72">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-desc" [(ngModel)]="terms" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-desc">Accept terms and conditions</label>
          <p z-field-description>By clicking this checkbox, you agree to the terms and conditions.</p>
        </div>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxDescriptionComponent {
  terms = true;
}

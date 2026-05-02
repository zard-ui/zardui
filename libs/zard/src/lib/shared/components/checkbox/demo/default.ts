import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-default',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox" [(ngModel)]="terms" />
        <label z-field-label for="terms-checkbox">Accept terms and conditions</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-2" [(ngModel)]="termsWithDesc" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-2">Accept terms and conditions</label>
          <p z-field-description>By clicking this checkbox, you agree to the terms.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-checkbox zId="toggle-checkbox" zDisabled />
        <label z-field-label for="toggle-checkbox">Enable notifications</label>
      </div>
      <label z-field-label>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="toggle-checkbox-2" [(ngModel)]="notifications" />
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>You can enable or disable notifications at any time.</p>
          </div>
        </div>
      </label>
    </div>
  `,
})
export class ZardDemoCheckboxDefaultComponent {
  terms = false;
  termsWithDesc = true;
  notifications = false;
}

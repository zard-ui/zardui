import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-invalid',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, FormsModule],
  template: `
    <fieldset z-field-set class="w-full max-w-xs">
      <legend z-field-legend zVariant="label">Notification Preferences</legend>
      <p z-field-description>Choose how you want to receive notifications.</p>
      <z-radio-group [(value)]="selected">
        <div z-field zOrientation="horizontal" data-invalid="true">
          <z-radio zId="invalid-email" value="email" zInvalid />
          <label z-field-label for="invalid-email" class="font-normal">Email only</label>
        </div>
        <div z-field zOrientation="horizontal" data-invalid="true">
          <z-radio zId="invalid-sms" value="sms" zInvalid />
          <label z-field-label for="invalid-sms" class="font-normal">SMS only</label>
        </div>
        <div z-field zOrientation="horizontal" data-invalid="true">
          <z-radio zId="invalid-both" value="both" zInvalid />
          <label z-field-label for="invalid-both" class="font-normal">Both Email & SMS</label>
        </div>
      </z-radio-group>
    </fieldset>
  `,
})
export class ZardDemoRadioGroupInvalidComponent {
  selected: unknown = 'email';
}

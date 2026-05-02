import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-required',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-required">
        Required Field
        <span class="text-destructive">*</span>
      </label>
      <input z-input id="input-required" placeholder="This field is required" required />
      <p z-field-description>This field must be filled out.</p>
    </div>
  `,
})
export class ZardDemoInputRequiredComponent {}

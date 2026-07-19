import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-invalid',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-invalid="true">
      <label z-field-label for="input-invalid">Invalid Input</label>
      <input z-input id="input-invalid" placeholder="Error" aria-invalid="true" />
      <p z-field-description>This field contains validation errors.</p>
    </div>
  `,
})
export class ZardDemoInputInvalidComponent {}

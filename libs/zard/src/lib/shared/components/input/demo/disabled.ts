import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-disabled',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-disabled="true">
      <label z-field-label for="input-demo-disabled">Email</label>
      <input z-input id="input-demo-disabled" type="email" placeholder="Email" disabled />
      <p z-field-description>This field is currently disabled.</p>
    </div>
  `,
})
export class ZardDemoInputDisabledComponent {}

import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-field',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-field-username">Username</label>
      <input z-input id="input-field-username" type="text" placeholder="Enter your username" />
      <p z-field-description>Choose a unique username for your account.</p>
    </div>
  `,
})
export class ZardDemoInputFieldComponent {}

import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-field-group',
  imports: [ZardInputComponent, ZardButtonComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="w-72">
      <div z-field>
        <label z-field-label for="fieldgroup-name">Name</label>
        <input z-input id="fieldgroup-name" placeholder="Jordan Lee" />
      </div>
      <div z-field>
        <label z-field-label for="fieldgroup-email">Email</label>
        <input z-input id="fieldgroup-email" type="email" placeholder="name@example.com" />
        <p z-field-description>We'll send updates to this address.</p>
      </div>
      <div z-field zOrientation="horizontal">
        <button z-button type="reset" zType="outline">Reset</button>
        <button z-button type="submit">Submit</button>
      </div>
    </div>
  `,
})
export class ZardDemoInputFieldGroupComponent {}

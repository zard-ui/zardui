import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-input-form',
  imports: [ZardInputComponent, ZardButtonComponent, ZardSelectImports, ...ZardFieldImports],
  template: `
    <form class="w-full min-w-sm">
      <div z-field-group>
        <div z-field>
          <label z-field-label for="form-name">Name</label>
          <input z-input id="form-name" type="text" placeholder="Evil Rabbit" required />
        </div>
        <div z-field>
          <label z-field-label for="form-email">Email</label>
          <input z-input id="form-email" type="email" placeholder="john@example.com" />
          <p z-field-description>We'll never share your email with anyone.</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div z-field>
            <label z-field-label for="form-phone">Phone</label>
            <input z-input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div z-field>
            <label z-field-label for="form-country">Country</label>
            <z-select id="form-country" [(zValue)]="country">
              <z-select-item zValue="us">United States</z-select-item>
              <z-select-item zValue="uk">United Kingdom</z-select-item>
              <z-select-item zValue="ca">Canada</z-select-item>
            </z-select>
          </div>
        </div>
        <div z-field>
          <label z-field-label for="form-address">Address</label>
          <input z-input id="form-address" type="text" placeholder="123 Main St" />
        </div>
        <div z-field zOrientation="horizontal">
          <button z-button type="button" zType="outline">Cancel</button>
          <button z-button type="submit">Submit</button>
        </div>
      </div>
    </form>
  `,
})
export class ZardDemoInputFormComponent {
  country = 'us';
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputDirective } from '@/shared/components/input/input.directive';

@Component({
  selector: 'z-demo-field-fieldset',
  imports: [...ZardFieldImports, ZardInputDirective],
  template: `
    <div class="w-full min-w-md">
      <fieldset z-field-set>
        <legend z-field-legend>Address Information</legend>
        <p z-field-description>We need your address to deliver your order.</p>

        <div z-field-group>
          <div z-field>
            <label z-field-label for="street">Street Address</label>
            <input z-input id="street" type="text" placeholder="123 Main St" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div z-field>
              <label z-field-label for="city">City</label>
              <input z-input id="city" type="text" placeholder="New York" />
            </div>
            <div z-field>
              <label z-field-label for="zip">Postal Code</label>
              <input z-input id="zip" type="text" placeholder="90502" />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldFieldsetComponent {}

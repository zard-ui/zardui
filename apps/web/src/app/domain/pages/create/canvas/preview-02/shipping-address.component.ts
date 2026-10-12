import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSelectImports } from '@zard/components/select/select.imports';

@Component({
  selector: 'z-preview-02-shipping-address',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ZardButtonComponent,
    ZardCardImports,
    ZardCheckboxComponent,
    ZardFieldImports,
    ZardInputComponent,
    ZardSelectImports,
  ],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Shipping Address" />
        <z-card-description zDescription="Where should we deliver?" />
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p2-shipping-street">Street address</label>
            <input z-input id="p2-shipping-street" placeholder="123 Main Street" />
          </z-field>
          <z-field>
            <label z-field-label for="p2-shipping-apt">Apt / Suite</label>
            <input z-input id="p2-shipping-apt" placeholder="Apt 4B" />
          </z-field>
          <z-field-group class="grid grid-cols-2">
            <z-field>
              <label z-field-label for="p2-shipping-city">City</label>
              <input z-input id="p2-shipping-city" placeholder="San Francisco" />
            </z-field>
            <z-field>
              <z-field-label>State</z-field-label>
              <z-select class="w-full" zValue="CA" aria-label="State">
                <z-select-group>
                  <z-select-item zValue="CA">California</z-select-item>
                  <z-select-item zValue="NY">New York</z-select-item>
                  <z-select-item zValue="TX">Texas</z-select-item>
                </z-select-group>
              </z-select>
            </z-field>
          </z-field-group>
          <z-field-group class="grid grid-cols-2">
            <z-field>
              <label z-field-label for="p2-shipping-zip">ZIP Code</label>
              <input z-input id="p2-shipping-zip" placeholder="94102" />
            </z-field>
            <z-field>
              <z-field-label>Country</z-field-label>
              <z-select class="w-full" zValue="US" aria-label="Country">
                <z-select-group>
                  <z-select-item zValue="US">United States</z-select-item>
                  <z-select-item zValue="CA">Canada</z-select-item>
                  <z-select-item zValue="UK">United Kingdom</z-select-item>
                </z-select-group>
              </z-select>
            </z-field>
          </z-field-group>
          <z-field zOrientation="horizontal">
            <z-checkbox zId="p2-shipping-save" [ngModel]="true" />
            <label z-field-label for="p2-shipping-save" class="font-normal">Save as default address</label>
          </z-field>
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
        <button type="button" z-button zSize="sm" class="ml-auto">Save Address</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02ShippingAddressComponent {}

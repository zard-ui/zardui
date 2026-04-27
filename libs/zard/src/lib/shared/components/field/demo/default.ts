import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-field-default',
  imports: [
    ...ZardFieldImports,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardSelectImports,
    FormsModule,
  ],
  template: `
    <div class="w-full min-w-md">
      <form>
        <div z-field-group>
          <fieldset z-field-set>
            <legend z-field-legend>Payment Method</legend>
            <p z-field-description>All transactions are secure and encrypted.</p>

            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-card-name">Name on Card</label>
                <input z-input id="checkout-card-name" placeholder="Evil Rabbit" required />
              </div>

              <div z-field>
                <label z-field-label for="checkout-card-number">Card Number</label>
                <input z-input id="checkout-card-number" placeholder="1234 5678 9012 3456" required />
                <p z-field-description>Enter your 16-digit card number.</p>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div z-field>
                  <label z-field-label for="checkout-exp-month" class="w-fit">Month</label>
                  <z-select id="checkout-exp-month" zPlaceholder="MM">
                    <z-select-item zValue="01">01</z-select-item>
                    <z-select-item zValue="02">02</z-select-item>
                    <z-select-item zValue="03">03</z-select-item>
                    <z-select-item zValue="04">04</z-select-item>
                    <z-select-item zValue="05">05</z-select-item>
                    <z-select-item zValue="06">06</z-select-item>
                    <z-select-item zValue="07">07</z-select-item>
                    <z-select-item zValue="08">08</z-select-item>
                    <z-select-item zValue="09">09</z-select-item>
                    <z-select-item zValue="10">10</z-select-item>
                    <z-select-item zValue="11">11</z-select-item>
                    <z-select-item zValue="12">12</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-exp-year">Year</label>
                  <z-select id="checkout-exp-year" zPlaceholder="YYYY">
                    <z-select-item zValue="2024">2024</z-select-item>
                    <z-select-item zValue="2025">2025</z-select-item>
                    <z-select-item zValue="2026">2026</z-select-item>
                    <z-select-item zValue="2027">2027</z-select-item>
                    <z-select-item zValue="2028">2028</z-select-item>
                    <z-select-item zValue="2029">2029</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-cvv">CVV</label>
                  <input z-input id="checkout-cvv" placeholder="123" required />
                </div>
              </div>
            </div>
          </fieldset>

          <z-field-separator />

          <fieldset z-field-set>
            <legend z-field-legend>Billing Address</legend>
            <p z-field-description>The billing address associated with your payment method.</p>

            <div z-field-group>
              <div z-field zOrientation="horizontal">
                <span
                  z-checkbox
                  zId="checkout-same-as-shipping"
                  [(ngModel)]="sameAsShipping"
                  name="sameAsShipping"
                ></span>
                <label z-field-label for="checkout-same-as-shipping" class="font-normal">
                  Same as shipping address
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset z-field-set>
            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-comments">Comments</label>
                <textarea
                  z-input
                  id="checkout-comments"
                  placeholder="Add any additional comments"
                  class="resize-none"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <div z-field zOrientation="horizontal">
            <button z-button type="submit">Submit</button>
            <button z-button zType="outline" type="button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldDefaultComponent {
  protected sameAsShipping = true;
}

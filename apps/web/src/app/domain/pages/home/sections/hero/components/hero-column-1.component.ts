import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import {
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormControlComponent,
} from '@zard/components/form/form.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSelectComponent } from '@zard/components/select/select.component';

@Component({
  selector: 'z-hero-column-1',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardDividerComponent,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
  ],
  template: `
    <div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
      <div class="w-full max-w-md rounded-lg border p-6">
        <form>
          <div class="flex w-full flex-col gap-7">
            <fieldset class="flex flex-col gap-6">
              <legend class="mb-3 text-base font-medium">Payment Method</legend>
              <p class="text-muted-foreground -mt-1.5 text-sm leading-normal font-normal">
                All transactions are secure and encrypted
              </p>

              <div class="flex w-full flex-col gap-7">
                <z-form-field>
                  <label z-form-label for="checkout-card-name">Name on Card</label>
                  <z-form-control>
                    <input z-input id="checkout-card-name" placeholder="John Doe" class="dark:bg-input/30" />
                  </z-form-control>
                </z-form-field>

                <div class="flex items-start gap-4">
                  <z-form-field>
                    <label z-form-label for="checkout-card-number">Card Number</label>
                    <z-form-control [helpText]="'Enter your 16-digit number.'">
                      <input
                        z-input
                        id="checkout-card-number"
                        class="dark:bg-input/30"
                        placeholder="1234 5678 9012 3456"
                      />
                    </z-form-control>
                  </z-form-field>

                  <z-form-field class="w-26">
                    <label z-form-label for="checkout-cvv">CVV</label>
                    <z-form-control>
                      <input z-input id="checkout-cvv" class="dark:bg-input/30" placeholder="123" />
                    </z-form-control>
                  </z-form-field>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <z-form-field>
                    <label z-form-label for="checkout-exp-month">Month</label>
                    <z-form-control>
                      <z-select zPlaceholder="MM" class="w-full">
                        @for (month of months; track month) {
                          <z-select-item [zValue]="month">{{ month }}</z-select-item>
                        }
                      </z-select>
                    </z-form-control>
                  </z-form-field>

                  <z-form-field>
                    <label z-form-label for="checkout-exp-year">Year</label>
                    <z-form-control>
                      <z-select zPlaceholder="YYYY" class="w-full">
                        @for (year of years; track year) {
                          <z-select-item [zValue]="year">{{ year }}</z-select-item>
                        }
                      </z-select>
                    </z-form-control>
                  </z-form-field>
                </div>
              </div>
            </fieldset>

            <z-divider class="-my-2" />

            <fieldset class="flex flex-col gap-6">
              <legend class="mb-3 text-base font-medium">Billing Address</legend>
              <p class="text-muted-foreground -mt-1.5 text-sm leading-normal font-normal">
                The billing address associated with your payment method
              </p>

              <div class="flex w-full flex-col gap-7">
                <z-checkbox class="*:text-xs">Same as shipping address</z-checkbox>
              </div>
            </fieldset>

            <z-divider class="-my-2" />

            <fieldset class="flex flex-col gap-6">
              <z-form-field>
                <label z-form-label for="checkout-comments">Comments</label>
                <z-form-control>
                  <textarea
                    z-input
                    id="checkout-comments"
                    class="dark:bg-input/30"
                    placeholder="Add any additional comments"
                  ></textarea>
                </z-form-control>
              </z-form-field>
            </fieldset>

            <div class="flex flex-row items-center gap-3">
              <button z-button zType="default" type="submit">Submit</button>
              <button z-button zType="outline" type="button">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class HeroColumn1Component {
  readonly months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  readonly years = ['2024', '2025', '2026', '2027', '2028', '2029'];
}

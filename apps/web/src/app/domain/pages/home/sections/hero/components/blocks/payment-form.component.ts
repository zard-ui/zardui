import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSelectComponent } from '@zard/components/select/select.component';

@Component({
  selector: 'z-block-payment-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardDividerComponent,
  ],
  template: `
    <div class="w-full max-w-md rounded-lg border p-6">
      <form>
        <!-- FieldGroup -->
        <div class="flex flex-col gap-6">
          <!-- FieldSet: Payment Method -->
          <fieldset class="flex flex-col gap-4">
            <legend class="text-base font-medium">Payment Method</legend>
            <p class="text-muted-foreground text-sm">All transactions are secure and encrypted</p>

            <!-- FieldGroup -->
            <div class="flex flex-col gap-4">
              <!-- Field: Name on Card -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium" for="checkout-card-name">Name on Card</label>
                <input z-input id="checkout-card-name" placeholder="John Doe" required />
              </div>

              <!-- Card Number + CVV -->
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 flex flex-col gap-2">
                  <label class="text-sm font-medium" for="checkout-card-number">Card Number</label>
                  <input z-input id="checkout-card-number" placeholder="1234 5678 9012 3456" required />
                  <p class="text-muted-foreground text-sm">Enter your 16-digit number.</p>
                </div>
                <div class="col-span-1 flex flex-col gap-2">
                  <label class="text-sm font-medium" for="checkout-cvv">CVV</label>
                  <input z-input id="checkout-cvv" placeholder="123" required />
                </div>
              </div>

              <!-- Month + Year -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium" for="checkout-exp-month">Month</label>
                  <z-select zPlaceholder="MM" class="w-full">
                    @for (month of months; track month) {
                      <z-select-item [zValue]="month">{{ month }}</z-select-item>
                    }
                  </z-select>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium" for="checkout-exp-year">Year</label>
                  <z-select zPlaceholder="YYYY" class="w-full">
                    @for (year of years; track year) {
                      <z-select-item [zValue]="year">{{ year }}</z-select-item>
                    }
                  </z-select>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- FieldSeparator -->
          <z-divider />

          <!-- FieldSet: Billing Address -->
          <fieldset class="flex flex-col gap-4">
            <legend class="text-base font-medium">Billing Address</legend>
            <p class="text-muted-foreground text-sm">The billing address associated with your payment method</p>

            <!-- FieldGroup -->
            <div class="flex flex-col gap-4">
              <!-- Field: Checkbox (horizontal) -->
              <z-checkbox>Same as shipping address</z-checkbox>
            </div>
          </fieldset>

          <!-- FieldSeparator -->
          <z-divider />

          <!-- FieldSet: Comments -->
          <fieldset class="flex flex-col gap-4">
            <!-- FieldGroup -->
            <div class="flex flex-col gap-4">
              <!-- Field: Comments -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium" for="checkout-comments">Comments</label>
                <textarea z-input id="checkout-comments" placeholder="Add any additional comments"></textarea>
              </div>
            </div>
          </fieldset>

          <!-- Field: Buttons (horizontal) -->
          <div class="flex flex-row items-center gap-2">
            <button z-button zType="default" type="submit">Submit</button>
            <button z-button zType="outline" type="button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class BlockPaymentFormComponent {
  readonly months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  readonly years = ['2024', '2025', '2026', '2027', '2028', '2029'];
}

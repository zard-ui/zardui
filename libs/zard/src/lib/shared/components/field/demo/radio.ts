import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioComponent } from '@/shared/components/radio/radio.component';

@Component({
  selector: 'z-demo-field-radio',
  imports: [...ZardFieldImports, ZardRadioComponent, FormsModule],
  template: `
    <div class="w-full min-w-md">
      <fieldset z-field-set>
        <legend z-field-legend zVariant="label">Subscription Plan</legend>
        <p z-field-description>Yearly and lifetime plans offer significant savings.</p>

        <div z-field-group class="gap-3">
          <div z-field zOrientation="horizontal">
            <span z-radio zId="plan-monthly" name="plan" [(ngModel)]="plan" value="monthly"></span>
            <label z-field-label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</label>
          </div>
          <div z-field zOrientation="horizontal">
            <span z-radio zId="plan-yearly" name="plan" [(ngModel)]="plan" value="yearly"></span>
            <label z-field-label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</label>
          </div>
          <div z-field zOrientation="horizontal">
            <span z-radio zId="plan-lifetime" name="plan" [(ngModel)]="plan" value="lifetime"></span>
            <label z-field-label for="plan-lifetime" class="font-normal">Lifetime ($299.99)</label>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldRadioComponent {
  protected plan = 'monthly';
}

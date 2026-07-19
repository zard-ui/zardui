import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-field-radio',
  imports: [...ZardFieldImports, ...ZardRadioGroupImports, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <legend z-field-legend zVariant="label">Subscription Plan</legend>
        <p z-field-description>Yearly and lifetime plans offer significant savings.</p>

        <z-radio-group class="gap-3" [(ngModel)]="plan">
          <div z-field zOrientation="horizontal">
            <z-radio zId="plan-monthly" value="monthly" />
            <label z-field-label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</label>
          </div>
          <div z-field zOrientation="horizontal">
            <z-radio zId="plan-yearly" value="yearly" />
            <label z-field-label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</label>
          </div>
          <div z-field zOrientation="horizontal">
            <z-radio zId="plan-lifetime" value="lifetime" />
            <label z-field-label for="plan-lifetime" class="font-normal">Lifetime ($299.99)</label>
          </div>
        </z-radio-group>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldRadioComponent {
  protected plan = 'monthly';
}

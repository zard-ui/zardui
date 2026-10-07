import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-reactive-forms',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="w-64">
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Billing plan</legend>
          <z-radio-group formControlName="plan">
            <div z-field zOrientation="horizontal">
              <z-radio zId="reactive-plan-monthly" value="monthly" />
              <label z-field-label for="reactive-plan-monthly" class="font-normal">Monthly</label>
            </div>
            <div z-field zOrientation="horizontal">
              <z-radio zId="reactive-plan-yearly" value="yearly" />
              <label z-field-label for="reactive-plan-yearly" class="font-normal">Yearly</label>
            </div>
          </z-radio-group>
        </fieldset>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Add-ons (locked)</legend>
          <z-radio-group formControlName="addons">
            <div z-field zOrientation="horizontal" data-disabled="true">
              <z-radio zId="reactive-addons-none" value="none" />
              <label z-field-label for="reactive-addons-none" class="font-normal">None</label>
            </div>
            <div z-field zOrientation="horizontal" data-disabled="true">
              <z-radio zId="reactive-addons-priority" value="priority" />
              <label z-field-label for="reactive-addons-priority" class="font-normal">Priority support</label>
            </div>
          </z-radio-group>
        </fieldset>
        <p class="text-muted-foreground text-sm">Plan: {{ form.controls.plan.value }}</p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupReactiveFormsComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    plan: ['monthly'],
    addons: [{ value: 'none', disabled: true }],
  });
}

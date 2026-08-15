import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

const PLANS = [
  { id: 'basic', title: 'Basic', description: 'For individuals and small teams' },
  { id: 'pro', title: 'Pro', description: 'For businesses with higher demands' },
] as const;

const ADDONS = [
  { id: 'analytics', title: 'Analytics', description: 'Advanced analytics and reporting' },
  { id: 'backup', title: 'Backup', description: 'Automated daily backups' },
  { id: 'support', title: 'Priority Support', description: '24/7 premium customer support' },
] as const;

const MAX_ADDONS = 3;

/** The radio group only offers the plans above — anything else is a tampered value. */
function knownPlan(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  return !value || PLANS.some(plan => plan.id === value) ? null : { unknownPlan: true };
}

/** A `FormArray` of booleans carries the count rules of the whole group. */
function addonRange(control: AbstractControl): ValidationErrors | null {
  const selected = (control.value as boolean[]).filter(Boolean).length;

  if (selected < 1) {
    return { addonsMin: true };
  }

  return selected > MAX_ADDONS ? { addonsMax: true } : null;
}

@Component({
  selector: 'z-forms-reactive-complex',
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardImports,
    ZardCheckboxComponent,
    ZardFieldImports,
    ZardRadioGroupImports,
    ZardSelectImports,
    ZardSwitchComponent,
  ],
  template: `
    <z-card class="w-full max-w-sm">
      <z-card-header class="border-b">
        <z-card-title>You're almost there!</z-card-title>
        <z-card-description>Choose your subscription plan and billing period.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-complex" [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let plan = subscriptionForm.controls.plan;
            @let planInvalid = plan.invalid && plan.touched;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Subscription Plan</legend>
              <p z-field-description>Choose your subscription plan.</p>

              <z-radio-group class="gap-3" formControlName="plan">
                @for (item of plans; track item.id) {
                  <label z-field-label [for]="'forms-reactive-complex-plan-' + item.id">
                    <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                      <div z-field-content>
                        <span z-field-title>{{ item.title }}</span>
                        <p z-field-description>{{ item.description }}</p>
                      </div>
                      <z-radio
                        [zId]="'forms-reactive-complex-plan-' + item.id"
                        [value]="item.id"
                        [zInvalid]="planInvalid"
                      />
                    </div>
                  </label>
                }
              </z-radio-group>
              @if (planInvalid) {
                <z-field-error>
                  @if (plan.hasError('required')) {
                    Please select a subscription plan
                  } @else if (plan.hasError('unknownPlan')) {
                    Invalid plan selection. Please choose Basic or Pro
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            @let billingPeriod = subscriptionForm.controls.billingPeriod;
            @let billingPeriodInvalid = billingPeriod.invalid && billingPeriod.touched;
            <div z-field [attr.data-invalid]="billingPeriodInvalid || null">
              <label z-field-label for="forms-reactive-complex-billing-period">Billing Period</label>
              <z-select
                formControlName="billingPeriod"
                id="forms-reactive-complex-billing-period"
                zPlaceholder="Select"
                [zInvalid]="billingPeriodInvalid"
              >
                <z-select-item zValue="monthly">Monthly</z-select-item>
                <z-select-item zValue="yearly">Yearly</z-select-item>
              </z-select>
              <p z-field-description>Choose how often you want to be billed.</p>
              @if (billingPeriodInvalid) {
                <z-field-error>Please select a billing period</z-field-error>
              }
            </div>

            <z-field-separator />

            @let addons = subscriptionForm.controls.addons;
            @let addonsInvalid = addons.invalid && addons.touched;
            <fieldset z-field-set>
              <legend z-field-legend>Add-ons</legend>
              <p z-field-description>Select additional features you'd like to include.</p>

              <div z-field-group data-slot="checkbox-group" formArrayName="addons">
                @for (addon of allAddons; track addon.id; let index = $index) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="addonsInvalid || null">
                    <span
                      z-checkbox
                      [formControlName]="index"
                      [zId]="'forms-reactive-complex-addon-' + addon.id"
                      [zInvalid]="addonsInvalid"
                    ></span>
                    <div z-field-content>
                      <label z-field-label [for]="'forms-reactive-complex-addon-' + addon.id" class="font-normal">
                        {{ addon.title }}
                      </label>
                      <p z-field-description>{{ addon.description }}</p>
                    </div>
                  </div>
                }
              </div>
              @if (addonsInvalid) {
                <z-field-error>
                  @if (addons.hasError('addonsMin')) {
                    Please select at least one add-on
                  } @else if (addons.hasError('addonsMax')) {
                    You can select up to {{ maxAddons }} add-ons
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <div z-field-content>
                <label z-field-label for="forms-reactive-complex-email-notifications">Email Notifications</label>
                <p z-field-description>Receive email updates about your subscription</p>
              </div>
              <z-switch formControlName="emailNotifications" zId="forms-reactive-complex-email-notifications" />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field>
          <button z-button type="submit" form="forms-reactive-complex">Save Preferences</button>
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveComplexComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;
  protected readonly allAddons = ADDONS;
  protected readonly maxAddons = MAX_ADDONS;

  protected readonly subscriptionForm = new FormGroup({
    plan: new FormControl('basic', { nonNullable: true, validators: [Validators.required, knownPlan] }),
    billingPeriod: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addons: new FormArray(
      ADDONS.map(() => new FormControl(false, { nonNullable: true })),
      addonRange,
    ),
    emailNotifications: new FormControl(false, { nonNullable: true }),
  });

  protected onReset(): void {
    this.subscriptionForm.reset({ plan: 'basic' });
  }

  protected onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const { addons, ...rest } = this.subscriptionForm.getRawValue();
    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(
        { ...rest, addons: ADDONS.filter((_, index) => addons[index]).map(addon => addon.id) },
        null,
        2,
      ),
    });
  }
}

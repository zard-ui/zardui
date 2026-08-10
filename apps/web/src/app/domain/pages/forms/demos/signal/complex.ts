import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';

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

const INITIAL_VALUE = {
  plan: 'basic',
  billingPeriod: '',
  addons: [] as string[],
  emailNotifications: false,
};

@Component({
  selector: 'z-forms-signal-complex',
  imports: [
    FormField,
    FormsModule,
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
        <form novalidate id="forms-signal-complex" (submit)="onSubmit($event)">
          <div z-field-group>
            @let plan = subscriptionForm.plan();
            @let planInvalid = plan.invalid() && plan.touched();
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Subscription Plan</legend>
              <p z-field-description>Choose your subscription plan.</p>

              <z-radio-group class="gap-3" [formField]="subscriptionForm.plan">
                @for (item of plans; track item.id) {
                  <label z-field-label [for]="'forms-signal-complex-plan-' + item.id">
                    <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                      <div z-field-content>
                        <span z-field-title>{{ item.title }}</span>
                        <p z-field-description>{{ item.description }}</p>
                      </div>
                      <z-radio
                        [zId]="'forms-signal-complex-plan-' + item.id"
                        [value]="item.id"
                        [zInvalid]="planInvalid"
                      />
                    </div>
                  </label>
                }
              </z-radio-group>
              @if (planInvalid) {
                <z-field-error [zErrors]="plan.errors()" />
              }
            </fieldset>

            <z-field-separator />

            @let billingPeriod = subscriptionForm.billingPeriod();
            @let billingPeriodInvalid = billingPeriod.invalid() && billingPeriod.touched();
            <div z-field [attr.data-invalid]="billingPeriodInvalid || null">
              <label z-field-label for="forms-signal-complex-billing-period">Billing Period</label>
              <z-select
                id="forms-signal-complex-billing-period"
                zPlaceholder="Select"
                [formField]="subscriptionForm.billingPeriod"
                [zInvalid]="billingPeriodInvalid"
              >
                <z-select-item zValue="monthly">Monthly</z-select-item>
                <z-select-item zValue="yearly">Yearly</z-select-item>
              </z-select>
              <p z-field-description>Choose how often you want to be billed.</p>
              @if (billingPeriodInvalid) {
                <z-field-error [zErrors]="billingPeriod.errors()" />
              }
            </div>

            <z-field-separator />

            @let addons = subscriptionForm.addons();
            @let addonsInvalid = addons.invalid() && addons.touched();
            <fieldset z-field-set>
              <legend z-field-legend>Add-ons</legend>
              <p z-field-description>Select additional features you'd like to include.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (addon of allAddons; track addon.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="addonsInvalid || null">
                    <span
                      z-checkbox
                      [zId]="'forms-signal-complex-addon-' + addon.id"
                      [zInvalid]="addonsInvalid"
                      [ngModel]="addons.value().includes(addon.id)"
                      [ngModelOptions]="{ standalone: true }"
                      (ngModelChange)="toggleAddon(addon.id, $event)"
                    ></span>
                    <div z-field-content>
                      <label z-field-label [for]="'forms-signal-complex-addon-' + addon.id" class="font-normal">
                        {{ addon.title }}
                      </label>
                      <p z-field-description>{{ addon.description }}</p>
                    </div>
                  </div>
                }
              </div>
              @if (addonsInvalid) {
                <z-field-error [zErrors]="addons.errors()" />
              }
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <div z-field-content>
                <label z-field-label for="forms-signal-complex-email-notifications">Email Notifications</label>
                <p z-field-description>Receive email updates about your subscription</p>
              </div>
              <z-switch
                zId="forms-signal-complex-email-notifications"
                [formField]="subscriptionForm.emailNotifications"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field>
          <button z-button type="submit" form="forms-signal-complex">Save Preferences</button>
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalComplexComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;
  protected readonly allAddons = ADDONS;

  private readonly model = signal({ ...INITIAL_VALUE });

  protected readonly subscriptionForm = form(this.model, schemaPath => {
    required(schemaPath.plan, { message: 'Please select a subscription plan' });

    // The radio group only offers the plans above — anything else is a tampered value.
    validate(schemaPath.plan, ({ value }) =>
      !value() || PLANS.some(plan => plan.id === value())
        ? undefined
        : { kind: 'unknownPlan', message: 'Invalid plan selection. Please choose Basic or Pro' },
    );

    required(schemaPath.billingPeriod, { message: 'Please select a billing period' });

    minLength(schemaPath.addons, 1, { message: 'Please select at least one add-on' });
    maxLength(schemaPath.addons, MAX_ADDONS, { message: `You can select up to ${MAX_ADDONS} add-ons` });
  });

  protected toggleAddon(id: string, checked: boolean): void {
    const field = this.subscriptionForm.addons();
    field.value.update(addons => (checked ? [...addons, id] : addons.filter(addon => addon !== id)));
    field.markAsTouched();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.subscriptionForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.subscriptionForm().reset({ ...INITIAL_VALUE });
  }
}

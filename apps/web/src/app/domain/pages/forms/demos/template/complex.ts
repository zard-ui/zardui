import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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

/** Keys match the control names, so `resetForm()` can restore the whole form at once. */
const INITIAL_VALUE: Record<string, string | boolean> = {
  plan: 'basic',
  billingPeriod: '',
  analytics: false,
  backup: false,
  support: false,
  emailNotifications: false,
};

@Component({
  selector: 'z-forms-template-complex',
  imports: [
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
        <form novalidate id="forms-template-complex" #subscriptionForm="ngForm" (ngSubmit)="onSubmit(subscriptionForm)">
          <div z-field-group>
            @let planInvalid = (plan.invalid || unknownPlan) && plan.touched;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Subscription Plan</legend>
              <p z-field-description>Choose your subscription plan.</p>

              <z-radio-group required class="gap-3" name="plan" #plan="ngModel" [(ngModel)]="model['plan']">
                @for (item of plans; track item.id) {
                  <label z-field-label [for]="'forms-template-complex-plan-' + item.id">
                    <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                      <div z-field-content>
                        <span z-field-title>{{ item.title }}</span>
                        <p z-field-description>{{ item.description }}</p>
                      </div>
                      <z-radio
                        [zId]="'forms-template-complex-plan-' + item.id"
                        [value]="item.id"
                        [zInvalid]="planInvalid"
                      />
                    </div>
                  </label>
                }
              </z-radio-group>
              @if (planInvalid) {
                <z-field-error>
                  @if (unknownPlan) {
                    Invalid plan selection. Please choose Basic or Pro
                  } @else {
                    Please select a subscription plan
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            @let billingPeriodInvalid = billingPeriod.invalid && billingPeriod.touched;
            <div z-field [attr.data-invalid]="billingPeriodInvalid || null">
              <label z-field-label for="forms-template-complex-billing-period">Billing Period</label>
              <z-select
                required
                name="billingPeriod"
                #billingPeriod="ngModel"
                id="forms-template-complex-billing-period"
                zPlaceholder="Select"
                [(ngModel)]="model['billingPeriod']"
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

            @let selected = selectedAddons.length;
            @let addonsInvalid = submitted && (selected < 1 || selected > maxAddons);
            <fieldset z-field-set>
              <legend z-field-legend>Add-ons</legend>
              <p z-field-description>Select additional features you'd like to include.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (addon of allAddons; track addon.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="addonsInvalid || null">
                    <span
                      z-checkbox
                      [name]="addon.id"
                      [zId]="'forms-template-complex-addon-' + addon.id"
                      [zInvalid]="addonsInvalid"
                      [(ngModel)]="model[addon.id]"
                    ></span>
                    <div z-field-content>
                      <label z-field-label [for]="'forms-template-complex-addon-' + addon.id" class="font-normal">
                        {{ addon.title }}
                      </label>
                      <p z-field-description>{{ addon.description }}</p>
                    </div>
                  </div>
                }
              </div>
              @if (addonsInvalid) {
                <z-field-error>
                  @if (selected < 1) {
                    Please select at least one add-on
                  } @else {
                    You can select up to {{ maxAddons }} add-ons
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <div z-field-content>
                <label z-field-label for="forms-template-complex-email-notifications">Email Notifications</label>
                <p z-field-description>Receive email updates about your subscription</p>
              </div>
              <z-switch
                name="emailNotifications"
                zId="forms-template-complex-email-notifications"
                [(ngModel)]="model['emailNotifications']"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field>
          <button z-button type="submit" form="forms-template-complex">Save Preferences</button>
          <button z-button zType="outline" type="button" (click)="onReset(subscriptionForm)">Reset</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateComplexComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;
  protected readonly allAddons = ADDONS;
  protected readonly maxAddons = MAX_ADDONS;

  protected model: Record<string, string | boolean> = { ...INITIAL_VALUE };
  protected submitted = false;

  /** Count and value rules have no declarative home in template-driven forms — they live here. */
  protected get selectedAddons(): string[] {
    return ADDONS.filter(addon => this.model[addon.id]).map(addon => addon.id);
  }

  protected get unknownPlan(): boolean {
    const plan = this.model['plan'] as string;
    return !!plan && !PLANS.some(item => item.id === plan);
  }

  protected onSubmit(form: NgForm): void {
    this.submitted = true;
    const selected = this.selectedAddons;

    if (form.invalid || this.unknownPlan || selected.length < 1 || selected.length > MAX_ADDONS) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(
        {
          plan: this.model['plan'],
          billingPeriod: this.model['billingPeriod'],
          addons: selected,
          emailNotifications: this.model['emailNotifications'],
        },
        null,
        2,
      ),
    });
  }

  protected onReset(form: NgForm): void {
    this.submitted = false;
    form.resetForm({ ...INITIAL_VALUE });
  }
}

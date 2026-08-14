import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const PLANS = [
  { id: 'starter', title: 'Starter (100K tokens/month)', description: 'For everyday use with basic features.' },
  { id: 'pro', title: 'Pro (1M tokens/month)', description: 'For advanced AI usage with more features.' },
  { id: 'enterprise', title: 'Enterprise (Unlimited tokens)', description: 'For large teams and heavy usage.' },
] as const;

@Component({
  selector: 'z-forms-template-radio',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardRadioGroupImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Subscription Plan</z-card-title>
        <z-card-description>See pricing and features for each plan.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-radio" #subscriptionForm="ngForm" (ngSubmit)="onSubmit(subscriptionForm)">
          @let planInvalid = plan.invalid && plan.touched;
          <fieldset z-field-set>
            <legend z-field-legend>Plan</legend>
            <p z-field-description>You can upgrade or downgrade your plan at any time.</p>

            <z-radio-group required class="gap-3" name="plan" #plan="ngModel" [(ngModel)]="model.plan">
              @for (item of plans; track item.id) {
                <label z-field-label [for]="'forms-template-radio-' + item.id">
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                    <div z-field-content>
                      <span z-field-title>{{ item.title }}</span>
                      <p z-field-description>{{ item.description }}</p>
                    </div>
                    <z-radio [zId]="'forms-template-radio-' + item.id" [value]="item.id" [zInvalid]="planInvalid" />
                  </div>
                </label>
              }
            </z-radio-group>
            @if (planInvalid) {
              <z-field-error>You must select a subscription plan to continue.</z-field-error>
            }
          </fieldset>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset(subscriptionForm)">Reset</button>
          <button z-button type="submit" form="forms-template-radio">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateRadioComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;

  protected model = { plan: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ plan: '' });
  }
}

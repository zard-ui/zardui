import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';
import { ZardCardComponent } from '@/shared/components/card';

@Component({
  selector: 'z-demo-accordion-card',
  imports: [ZardAccordionImports, ZardCardComponent],
  template: `
    <z-card
      zTitle="Subscription & Billing"
      zDescription="Common questions about your account, plans, payments and cancellations."
      class="w-full max-w-sm"
    >
      <div z-accordion zDefaultValue="plans" zType="single">
        <z-accordion-item zValue="plans" zTitle="What subscription plans do you offer?">
          We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month).
          Each plan includes increasing storage limits, API access, priority support, and team collaboration features.
        </z-accordion-item>

        <z-accordion-item zValue="billing" zTitle="How does billing work?">
          Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and
          ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.
        </z-accordion-item>

        <z-accordion-item zValue="cancel" zTitle="How do I cancel my subscription?">
          You can cancel your subscription anytime from your account settings. There are no cancellation fees or
          penalties. Your access will continue until the end of your current billing period.
        </z-accordion-item>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionCardComponent {}

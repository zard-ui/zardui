import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-basic',
  imports: [ZardAccordionImports],
  template: `
    <z-accordion zDefaultValue="item-1" zType="single" class="max-w-sm">
      <z-accordion-item zValue="item-1" zTitle="How do I reset my password?">
        Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your
        password. The link will expire in 24 hours.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Can I change my subscription plan?">
        Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in
        your next billing cycle.
      </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="What payment methods do you accept?">
        We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our
        payment partners.
      </z-accordion-item>
    </z-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionBasicComponent {}

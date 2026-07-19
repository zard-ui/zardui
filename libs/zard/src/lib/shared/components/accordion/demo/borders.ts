import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-borders',
  imports: [ZardAccordionImports],
  template: `
    <z-accordion zDefaultValue="billing" zType="single" class="max-w-sm rounded-lg border">
      <z-accordion-item zValue="billing" zTitle="How does billing work?" class="px-4">
        We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can
        cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.
      </z-accordion-item>

      <z-accordion-item zValue="security" zTitle="Is my data secure?" class="px-4">
        Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data
        is encrypted at rest and in transit using industry-standard protocols.
      </z-accordion-item>

      <z-accordion-item zValue="integration" zTitle="What integrations do you support?" class="px-4">
        We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also build
        custom integrations using our REST API and webhooks.
      </z-accordion-item>
    </z-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionBordersComponent {}

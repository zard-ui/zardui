import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-multiple',
  imports: [ZardAccordionImports],
  template: `
    <z-accordion zType="multiple" class="max-w-sm">
      <z-accordion-item zValue="notifications" zTitle="Notification Settings">
        Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile
        devices.
      </z-accordion-item>

      <z-accordion-item zValue="privacy" zTitle="Privacy & Security">
        Control your privacy settings and security preferences. Enable two-factor authentication, manage connected
        devices, review active sessions, and configure data sharing preferences. You can also download your data or
        delete your account.
      </z-accordion-item>

      <z-accordion-item zValue="billing" zTitle="Billing & Subscription">
        View your current plan, payment history, and upcoming invoices. Update your payment method, change your
        subscription tier, or cancel your subscription.
      </z-accordion-item>
    </z-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionMultipleComponent {}

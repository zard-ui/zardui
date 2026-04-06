import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-preview',
  imports: [ZardAccordionImports],
  template: `
    <z-accordion zDefaultValue="returns" zType="single" class="max-w-sm">
      <z-accordion-item zValue="shipping" zTitle="What are your shipping options?">
        We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders.
      </z-accordion-item>

      <z-accordion-item zValue="returns" zTitle="What is your return policy?">
        Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within 5-7
        business days.
      </z-accordion-item>

      <z-accordion-item zValue="support" zTitle="How can I contact customer support?">
        Reach us via email, live chat, or phone. We respond within 24 hours during business days.
      </z-accordion-item>
    </z-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionPreviewComponent {}

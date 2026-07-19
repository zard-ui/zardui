import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-alert-destructive',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zType="destructive"
        zTitle="Payment failed"
        zDescription="Your payment could not be processed. Please check your payment method and try again."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDestructiveComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-alert-custom-color',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
        zDescription="Renew now to avoid service interruption or upgrade to a paid plan to continue using the service."
        zIcon="lucideAlertTriangle"
        zTitle="Your subscription will expire in 3 days"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideAlertTriangle })],
})
export class ZardDemoAlertCustomColorsComponent {}

```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core/icons-registry';

import { ZardAlertComponent } from '../alert.component';

@Component({
  selector: 'z-demo-alert-basic',
  imports: [ZardAlertComponent, NgIcon],
  template: `
    <div class="grid w-full max-w-xl items-start gap-4">
      <z-alert
        [zIcon]="successIcon"
        zTitle="Success! Your changes have been saved"
        zDescription="This is an alert with icon, title and description."
      />

      <z-alert [zIcon]="customIcon" zTitle="This Alert has a title and an icon. No description." />

      <ng-template #customIcon>
        <ng-icon name="popcorn" />
      </ng-template>

      <z-alert zType="destructive" zTitle="Unable to process your payment." [zDescription]="customDescription" />

      <ng-template #customDescription>
        <p>Please verify your billing information and try again.</p>
        <ul class="list-disc pl-5">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </ng-template>

      <ng-template #successIcon><ng-icon name="circle-check" /></ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ circleCheck: ZardIconRegistry['circle-check'], popcorn: ZardIconRegistry.popcorn })],
})
export class ZardDemoAlertBasicComponent {}

```
```angular-ts showLineNumbers copyButton
import { ZardIcon } from '../../icon/icons';
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-xl items-start gap-4">
      <z-alert zIcon="icon-circle-check" zTitle="Success! Your changes have been saved" zDescription="This is an alert with icon, title and description." />

      <z-alert [zIcon]="customIcon" zTitle="This Alert has a title and an icon. No description." />

      <ng-template #customIcon>
        <span class="icon-popcorn"></span>
      </ng-template>

      <z-alert zType="destructive" zIcon="icon-circle-alert" zTitle="Unable to process your payment." [zDescription]="customDescription" />

      <ng-template #customDescription>
        <p>Please verify your billing information and try again.</p>
        <ul class="list-disc pl-5">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </ng-template>
    </div>
  `,
})
export class ZardDemoAlertBasicComponent {}

```

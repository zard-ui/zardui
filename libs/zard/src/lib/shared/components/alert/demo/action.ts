import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'z-demo-alert-action',
  imports: [ZardAlertComponent, ZardButtonComponent],
  template: `
    <ng-template #actionTpl>
      <button type="button" z-button zSize="xs">Enable</button>
    </ng-template>

    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        class="w-md"
        zTitle="Dark mode is now available"
        zDescription="Enable it under your profile settings to get started."
        [zAction]="actionTpl"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertActionComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-with-spinner',
  imports: [ZardBadgeComponent, ZardSpinnerComponent],
  template: `
    <div class="flex w-full flex-wrap gap-2">
      <z-badge zType="destructive">
        <z-spinner data-icon="inline-start" />
        Deleting
      </z-badge>
      <z-badge zType="secondary">
        <z-spinner data-icon="inline-start" />
        Generating
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBadgeWithSpinnerComponent {}

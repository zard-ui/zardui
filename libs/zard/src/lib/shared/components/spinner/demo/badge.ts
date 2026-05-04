import { Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-badge',
  imports: [ZardBadgeComponent, ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-4 [--radius:1.2rem]">
      <z-badge>
        <z-spinner data-icon="inline-start" />
        Syncing
      </z-badge>
      <z-badge zType="secondary">
        <z-spinner data-icon="inline-start" />
        Updating
      </z-badge>
      <z-badge zType="outline">
        <z-spinner data-icon="inline-start" />
        Processing
      </z-badge>
    </div>
  `,
})
export class ZardDemoSpinnerBadgeComponent {}

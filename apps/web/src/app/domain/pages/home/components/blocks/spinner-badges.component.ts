import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';

@Component({
  selector: 'z-block-spinner-badges',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-2 [--radius:1.2rem]">
      <z-badge>
        <z-spinner class="size-3" data-icon="inline-start" />
        Syncing
      </z-badge>
      <z-badge zType="secondary">
        <z-spinner class="size-3" data-icon="inline-start" />
        Updating
      </z-badge>
      <z-badge zType="outline">
        <z-spinner class="size-3" data-icon="inline-start" />
        Processing
      </z-badge>
    </div>
  `,
})
export class BlockSpinnerBadgesComponent {}

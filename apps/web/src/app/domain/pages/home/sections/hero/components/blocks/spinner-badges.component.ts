import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-block-spinner-badges',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardIconComponent],
  template: `
    <div class="flex items-center gap-2">
      <z-badge zType="default" class="rounded-full">
        <z-icon zType="loader-circle" class="size-3 animate-spin" />
        Syncing
      </z-badge>
      <z-badge zType="secondary" class="rounded-full">
        <z-icon zType="loader-circle" class="size-3 animate-spin" />
        Updating
      </z-badge>
      <z-badge zType="outline" class="rounded-full">
        <z-icon zType="loader-circle" class="size-3 animate-spin" />
        Loading
      </z-badge>
    </div>
  `,
})
export class BlockSpinnerBadgesComponent {}

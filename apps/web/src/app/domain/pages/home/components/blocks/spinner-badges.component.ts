import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

@Component({
  selector: 'z-block-spinner-badges',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  template: `
    <div class="flex items-center gap-2">
      <z-badge zType="default" class="rounded-full">
        <ng-icon name="lucideLoaderCircle" class="size-3 animate-spin" />
        Syncing
      </z-badge>
      <z-badge zType="secondary" class="rounded-full">
        <ng-icon name="lucideLoaderCircle" class="size-3 animate-spin" />
        Updating
      </z-badge>
      <z-badge zType="outline" class="rounded-full">
        <ng-icon name="lucideLoaderCircle" class="size-3 animate-spin" />
        Loading
      </z-badge>
    </div>
  `,
})
export class BlockSpinnerBadgesComponent {}

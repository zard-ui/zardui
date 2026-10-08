import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBookmark } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-with-icon',
  imports: [ZardBadgeComponent, NgIcon],
  template: `
    <div class="flex w-full flex-wrap gap-2">
      <z-badge zType="secondary">
        <ng-icon name="lucideBadgeCheck" data-icon="inline-start" />
        Verified
      </z-badge>
      <z-badge zType="outline">
        Bookmark
        <ng-icon name="lucideBookmark" data-icon="inline-end" />
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideBookmark })],
})
export class ZardDemoBadgeWithIconComponent {}

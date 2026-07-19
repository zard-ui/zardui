import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideRefreshCcw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-background',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      class="bg-muted/30 [&_[data-slot=empty-description]]:max-w-xs [&_[data-slot=empty-description]]:text-pretty"
      zIcon="lucideBell"
      zTitle="No Notifications"
      zDescription="You're all caught up. New notifications will appear here."
      [zActions]="[actionPrimary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button zType="outline">
          <ng-icon name="lucideRefreshCcw" />
          Refresh
        </button>
      </ng-template>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBell, lucideRefreshCcw })],
})
export class ZardDemoEmptyBackgroundComponent {}

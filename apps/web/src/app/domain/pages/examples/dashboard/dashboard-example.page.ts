import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard } from '@ng-icons/lucide';

import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

@Component({
  selector: 'z-dashboard-example-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardEmptyComponent, NgIcon],
  viewProviders: [provideIcons({ lucideLayoutDashboard })],
  template: `
    <z-empty
      zTitle="Dashboard Example"
      zDescription="This example is coming soon. Stay tuned!"
      class="min-h-96 border border-dashed"
    >
      <ng-template #zImage>
        <div class="bg-muted text-foreground mb-2 flex size-12 items-center justify-center rounded-lg">
          <ng-icon name="lucideLayoutDashboard" class="size-6" />
        </div>
      </ng-template>
    </z-empty>
  `,
})
export class DashboardExamplePage {}

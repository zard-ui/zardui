import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-dashboard-example-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardEmptyComponent, ZardIconComponent],
  template: `
    <z-empty
      zTitle="Dashboard Example"
      zDescription="This example is coming soon. Stay tuned!"
      class="min-h-96 border border-dashed"
    >
      <ng-template #zImage>
        <div class="bg-muted text-foreground mb-2 flex size-12 items-center justify-center rounded-lg">
          <z-icon zType="layout-dashboard" class="size-6" />
        </div>
      </ng-template>
    </z-empty>
  `,
})
export class DashboardExamplePage {}

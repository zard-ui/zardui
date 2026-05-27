import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-table',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-full min-w-sm flex-col gap-2">
      @for (row of rows; track row) {
        <div class="flex gap-4">
          <z-skeleton class="h-4 flex-1" />
          <z-skeleton class="h-4 w-24" />
          <z-skeleton class="h-4 w-20" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonTableComponent {
  protected readonly rows = [0, 1, 2, 3, 4];
}

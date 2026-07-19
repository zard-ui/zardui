import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-text',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-full min-w-xs flex-col gap-2">
      <z-skeleton class="h-4 w-full" />
      <z-skeleton class="h-4 w-full" />
      <z-skeleton class="h-4 w-3/4" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonTextComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-form',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-full min-w-xs flex-col gap-7">
      <div class="flex flex-col gap-3">
        <z-skeleton class="h-4 w-20" />
        <z-skeleton class="h-8 w-full" />
      </div>
      <div class="flex flex-col gap-3">
        <z-skeleton class="h-4 w-24" />
        <z-skeleton class="h-8 w-full" />
      </div>
      <z-skeleton class="h-8 w-24" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonFormComponent {}

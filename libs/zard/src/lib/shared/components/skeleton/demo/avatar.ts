import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-avatar',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-fit items-center gap-4">
      <z-skeleton class="size-10 shrink-0 rounded-full" />
      <div class="grid gap-2">
        <z-skeleton class="h-4 w-[150px]" />
        <z-skeleton class="h-4 w-[100px]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonAvatarComponent {}

import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

@Component({
  selector: 'z-maintainers-loading',
  standalone: true,
  imports: [ZardSkeletonComponent],
  template: `
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      @for (item of [1, 2, 3]; track $index) {
        <div class="bg-card flex items-center gap-3 rounded-lg border p-4">
          <z-skeleton class="size-12 shrink-0 rounded-full"></z-skeleton>
          <div class="flex min-w-0 flex-1 flex-col gap-1.5">
            <z-skeleton class="h-4 w-32 max-w-full"></z-skeleton>
            <z-skeleton class="h-3 w-20 max-w-full"></z-skeleton>
            <z-skeleton class="h-3 w-24 max-w-full"></z-skeleton>
          </div>
        </div>
      }
    </div>
  `,
})
export class MaintainersLoadingComponent {}

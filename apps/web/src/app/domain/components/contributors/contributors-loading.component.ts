import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

@Component({
  selector: 'z-contributors-loading',
  standalone: true,
  imports: [ZardSkeletonComponent],
  template: `
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track $index) {
        <div class="bg-card flex items-center gap-2.5 rounded-lg border p-2.5">
          <z-skeleton class="size-8 shrink-0 rounded-full"></z-skeleton>
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <z-skeleton class="h-3 w-20 max-w-full"></z-skeleton>
            <z-skeleton class="h-3 w-14 max-w-full"></z-skeleton>
          </div>
        </div>
      }
    </div>
  `,
})
export class ContributorsLoadingComponent {}

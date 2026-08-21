import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

@Component({
  selector: 'z-sponsors-loading',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      @for (item of [1, 2, 3, 4, 5]; track $index) {
        <div class="bg-card flex flex-col items-center gap-3 rounded-xl border p-4">
          <z-skeleton class="size-14 shrink-0 rounded-full"></z-skeleton>
          <div class="flex w-full flex-col items-center gap-1.5">
            <z-skeleton class="h-4 w-20 max-w-full"></z-skeleton>
            <z-skeleton class="h-3 w-16 max-w-full"></z-skeleton>
          </div>
        </div>
      }
    </div>
  `,
})
export class SponsorsLoadingComponent {}

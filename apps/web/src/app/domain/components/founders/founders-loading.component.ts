import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

@Component({
  selector: 'z-founders-loading',
  standalone: true,
  imports: [ZardSkeletonComponent],
  template: `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      @for (item of [1, 2]; track $index) {
        <div
          class="from-card to-muted/40 relative flex flex-col items-center gap-4 rounded-xl border bg-gradient-to-br p-6 shadow-sm sm:p-8"
        >
          <z-skeleton class="absolute top-4 right-4 h-5 w-20 rounded-full"></z-skeleton>
          <z-skeleton class="size-20 shrink-0 rounded-full"></z-skeleton>
          <div class="flex w-full flex-col items-center gap-1.5">
            <z-skeleton class="h-7 w-40 max-w-full"></z-skeleton>
            <z-skeleton class="h-5 w-52 max-w-full"></z-skeleton>
          </div>
          <z-skeleton class="h-6 w-32 rounded-full"></z-skeleton>
        </div>
      }
    </div>
  `,
})
export class FoundersLoadingComponent {}

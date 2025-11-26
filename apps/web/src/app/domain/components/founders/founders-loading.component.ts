import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '../../../../../../../libs/zard/skeleton/skeleton.component';

@Component({
  selector: 'z-founders-loading',
  standalone: true,
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex flex-col gap-6 sm:gap-8">
      @for (item of [1, 2]; track item) {
        <div class="from-card to-card/50 rounded-xl border bg-gradient-to-br p-8 shadow-lg sm:p-10">
          <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <z-skeleton class="h-20 w-20 shrink-0 rounded-full"></z-skeleton>
            <div class="flex w-full flex-1 flex-col gap-3 sm:gap-4">
              <div class="flex flex-col gap-2">
                <z-skeleton class="h-8 w-3/4 sm:h-9"></z-skeleton>
                <z-skeleton class="h-6 w-1/2 sm:h-7"></z-skeleton>
              </div>
              <z-skeleton class="h-5 w-32 sm:h-6"></z-skeleton>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FoundersLoadingComponent {}

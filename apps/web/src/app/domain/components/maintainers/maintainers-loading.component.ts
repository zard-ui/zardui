import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '@ngzard/ui/skeleton';

@Component({
  selector: 'z-maintainers-loading',
  standalone: true,
  imports: [ZardSkeletonComponent],
  template: `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      @for (item of [1, 2]; track item) {
        <div class="from-card to-card/50 rounded-lg border bg-gradient-to-br p-4 shadow-sm sm:p-6">
          <div class="flex items-start gap-4">
            <z-skeleton class="h-10 w-10 shrink-0 rounded-full"></z-skeleton>
            <div class="flex flex-1 flex-col gap-2">
              <z-skeleton class="h-4 w-32"></z-skeleton>
              <z-skeleton class="h-3 w-24"></z-skeleton>
              <z-skeleton class="mt-1 h-3 w-20"></z-skeleton>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MaintainersLoadingComponent {}

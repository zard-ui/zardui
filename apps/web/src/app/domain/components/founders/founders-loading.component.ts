import { Component } from '@angular/core';

@Component({
  selector: 'z-founders-loading',
  standalone: true,
  template: `
    <div class="flex flex-col gap-6">
      @for (item of [1, 2]; track $index) {
        <div class="bg-card animate-pulse rounded-lg border p-6 sm:p-8">
          <div class="flex items-start gap-6">
            <div class="bg-muted h-16 w-16 shrink-0 rounded-full"></div>
            <div class="flex flex-1 flex-col gap-3">
              <div class="bg-muted h-6 w-3/4 rounded"></div>
              <div class="bg-muted h-4 w-1/2 rounded"></div>
              <div class="bg-muted h-16 rounded"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FoundersLoadingComponent {}

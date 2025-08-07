import { Component } from '@angular/core';

@Component({
  selector: 'z-founders-loading',
  standalone: true,
  template: `
    <div class="flex flex-col gap-6">
      @for (item of [1, 2]; track $index) {
        <div class="rounded-lg border bg-card p-6 sm:p-8 animate-pulse">
          <div class="flex items-start gap-6">
            <div class="h-16 w-16 rounded-full bg-muted shrink-0"></div>
            <div class="flex flex-col gap-3 flex-1">
              <div class="h-6 bg-muted rounded w-3/4"></div>
              <div class="h-4 bg-muted rounded w-1/2"></div>
              <div class="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FoundersLoadingComponent {}

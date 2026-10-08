import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-duration',
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="shimmer shimmer-duration-1000 text-muted-foreground text-base">shimmer-duration-1000 — one second</p>
      <p class="shimmer text-muted-foreground text-base">default — two seconds</p>
      <p class="shimmer shimmer-duration-4000 text-muted-foreground text-base">shimmer-duration-4000 — four seconds</p>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerDurationComponent {}

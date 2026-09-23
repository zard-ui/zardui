import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-spread-angle',
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="shimmer shimmer-spread-24 text-muted-foreground text-base">shimmer-spread-24 — a wider band</p>
      <p class="shimmer shimmer-angle-45 text-muted-foreground text-base">shimmer-angle-45 — a steeper tilt</p>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerSpreadAngleComponent {}

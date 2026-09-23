import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-color',
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="shimmer shimmer-color-blue-500/60 text-muted-foreground text-base">
        shimmer-color-blue-500/60 — an arbitrary colour, dimmed
      </p>
      <p class="shimmer shimmer-color-primary text-muted-foreground text-base">
        shimmer-color-primary — a theme token from &#64;theme inline
      </p>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerColorComponent {}

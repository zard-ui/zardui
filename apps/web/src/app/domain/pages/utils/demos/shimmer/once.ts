import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-once',
  template: `
    <p class="shimmer shimmer-once shimmer-duration-1100 text-muted-foreground text-base">Response generated.</p>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerOnceComponent {}

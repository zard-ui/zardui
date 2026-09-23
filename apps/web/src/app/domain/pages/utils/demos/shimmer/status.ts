import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';

@Component({
  selector: 'z-utils-shimmer-status',
  imports: [ZardBadgeComponent, ZardSpinnerComponent],
  template: `
    <div class="bg-card flex w-full max-w-md flex-col gap-3 rounded-xl border p-4">
      <div class="flex items-center gap-3">
        <z-badge zType="secondary">Run 41</z-badge>
        <!-- The shimmer sits on the text node itself, never on the row that wraps it. -->
        <span class="shimmer text-muted-foreground text-sm">Indexing 1,204 files...</span>
      </div>
      <div class="flex items-center gap-3">
        <z-spinner class="text-muted-foreground" />
        <span class="shimmer shimmer-duration-1400 text-muted-foreground text-sm">
          Building the dependency graph...
        </span>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerStatusComponent {}

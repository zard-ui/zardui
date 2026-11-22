import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

@Component({
  selector: 'z-preview-02-skeleton-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardSkeletonComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <z-skeleton class="size-10 rounded-full" />
          <div class="flex flex-1 flex-col gap-2">
            <z-skeleton class="h-4 w-3/4" />
            <z-skeleton class="h-3 w-1/2" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <z-skeleton class="h-3 w-full" />
          <z-skeleton class="h-3 w-full" />
          <z-skeleton class="h-3 w-4/5" />
        </div>
        <div class="flex gap-2">
          <z-skeleton class="h-8 w-20" />
          <z-skeleton class="h-8 w-20" />
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02SkeletonLoadingComponent {}

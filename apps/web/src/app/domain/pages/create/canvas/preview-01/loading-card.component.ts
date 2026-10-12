import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';
import { ZardSkeletonComponent } from '@zard/components/skeleton';

@Component({
  selector: 'z-preview-01-loading-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardSkeletonComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-skeleton class="h-5 w-32" />
        <z-skeleton class="h-4 w-48" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <z-skeleton class="h-32 w-full rounded-lg" />
        <div class="flex flex-col gap-2">
          <z-skeleton class="h-4 w-full" />
          <z-skeleton class="h-4 w-3/4" />
          <z-skeleton class="h-4 w-1/2" />
        </div>
        <div class="flex gap-2">
          <z-skeleton class="h-9 flex-1 rounded-md" />
          <z-skeleton class="h-9 flex-1 rounded-md" />
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01LoadingCardComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-card',
  imports: [ZardCardImports, ZardSkeletonComponent],
  template: `
    <z-card class="w-full min-w-xs">
      <z-card-header>
        <z-card-title [zTitle]="titleSkeleton" />
        <z-card-description [zDescription]="descriptionSkeleton" />
      </z-card-header>
      <z-card-content>
        <z-skeleton class="aspect-video w-full" />
      </z-card-content>
    </z-card>

    <ng-template #titleSkeleton>
      <z-skeleton class="h-4 w-2/3" />
    </ng-template>

    <ng-template #descriptionSkeleton>
      <z-skeleton class="h-4 w-1/2" />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonCardComponent {}

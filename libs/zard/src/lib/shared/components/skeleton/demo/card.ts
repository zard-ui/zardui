import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-card',
  imports: [ZardCardComponent, ZardSkeletonComponent],
  template: `
    <z-card class="w-full min-w-xs" [zTitle]="titleSkeleton" [zDescription]="descriptionSkeleton">
      <z-skeleton class="aspect-video w-full" />
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

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-preview',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      zIcon="lucideFolderCode"
      zTitle="No Projects Yet"
      zDescription="You haven't created any projects yet. Get started by creating your first project."
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button>Create Project</button>
      </ng-template>

      <ng-template #actionSecondary>
        <button type="button" z-button zType="outline">Import Project</button>
      </ng-template>

      <a z-button zType="link" zSize="sm" class="text-muted-foreground" href="#">
        Learn More
        <ng-icon name="lucideArrowUpRight" />
      </a>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUpRight,
      lucideFolderCode,
    }),
  ],
})
export class ZardDemoEmptyPreviewComponent {}

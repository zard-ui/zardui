```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardArrowUpRightIcon, zardFolderCodeIcon } from '../../../core/icons-registry';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-default',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      [zIcon]="folderCode"
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

      <button type="button" z-button zType="link" zSize="sm" class="text-muted-foreground">
        Learn More
        <ng-icon name="arrow-up-right" />
      </button>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ arrowUpRight: zardArrowUpRightIcon })],
})
export class ZardDemoEmptyDefaultComponent {
  folderCode = zardFolderCodeIcon;
}

```
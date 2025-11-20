```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-default',
  imports: [ZardButtonComponent, ZardEmptyComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-empty
      zIcon="folder-code"
      zTitle="No Projects Yet"
      zDescription="You haven't created any projects yet. Get started by creating your first project."
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button z-button>Create Project</button>
      </ng-template>

      <ng-template #actionSecondary>
        <button z-button zType="outline">Import Project</button>
      </ng-template>

      <button z-button zType="link" zSize="sm" class="text-muted-foreground">
        Learn More
        <i z-icon zType="arrow-up-right"></i>
      </button>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyDefaultComponent {}

```
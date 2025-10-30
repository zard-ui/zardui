```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-actions',
  standalone: true,
  imports: [ZardButtonComponent, ZardEmptyComponent],
  template: `
    <z-empty zIcon="inbox" zTitle="No messages" zDescription="You don't have any messages yet" [zActions]="[actionPrimary, actionSecondary]"> </z-empty>

    <ng-template #actionPrimary>
      <button z-button>New Message</button>
    </ng-template>

    <ng-template #actionSecondary>
      <button z-button zType="outline">View Archived</button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyActionsComponent {}

```
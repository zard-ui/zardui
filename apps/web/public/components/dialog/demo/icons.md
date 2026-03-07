```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDialogModule } from '../dialog.component';
import { ZardDialogService } from '../dialog.service';
import { zardCheckIcon, zardXIcon } from '../../../core/icons-registry';

@Component({
  imports: [ZardButtonComponent, ZardDialogModule],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Open Dialog with Icons</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogIconsComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Confirm Action',
      zDescription: 'Are you sure you want to proceed? This action cannot be undone.',
      zOkText: 'Confirm',
      zOkIcon: zardCheckIcon,
      zCancelText: 'Cancel',
      zCancelIcon: zardXIcon,
      zOnOk: () => {
        console.log('Action confirmed');
      },
      zWidth: '425px',
    });
  }
}

```
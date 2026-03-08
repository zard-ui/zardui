```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDialogModule } from '../dialog.component';
import { ZardDialogService } from '../dialog.service';

@Component({
  selector: 'zard-demo-dialog-with-icons',
  imports: [ZardButtonComponent, ZardDialogModule],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Open Dialog with Icons</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogWithIconsComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Confirm Action',
      zDescription: 'Are you sure you want to proceed? This action cannot be undone.',
      zOkText: 'Confirm',
      zOkIcon: ZardIconRegistry.check,
      zCancelText: 'Cancel',
      zCancelIcon: ZardIconRegistry.x,
      zOnOk: () => {
        console.log('Action confirmed');
      },
      zWidth: '425px',
    });
  }
}

```
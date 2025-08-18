```angular-ts showLineNumbers
import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '../../components';
import { ZardAlertDialogService } from '../alert-dialog.service';

@Component({
  selector: 'zard-demo-alert-dialog-custom',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <div class="flex gap-2">
      <button z-button zType="outline" (click)="showCustomAlert()">
        Custom Alert
      </button>
      <button z-button zType="ghost" (click)="showMaskClosableAlert()">
        Mask Closable
      </button>
    </div>
  `,
})
export class ZardDemoAlertDialogCustomComponent {
  private alertDialogService = inject(ZardAlertDialogService);

  showCustomAlert() {
    this.alertDialogService.create({
      zTitle: 'Custom Alert Dialog',
      zDescription: 'This is a custom alert dialog with custom button text and no icon.',
      zOkText: 'Proceed',
      zCancelText: 'Go Back',
      zOkDestructive: false,
      zWidth: '600px',
    });
  }

  showMaskClosableAlert() {
    this.alertDialogService.create({
      zTitle: 'Click Outside to Close',
      zDescription: 'This alert dialog can be closed by clicking outside of it.',
      zOkText: 'Close',
      zCancelText: null,
      zMaskClosable: true,
      zIcon: 'mouse-pointer',
    });
  }
}
```

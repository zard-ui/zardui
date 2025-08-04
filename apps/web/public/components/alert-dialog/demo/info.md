```angular-ts showLineNumbers
import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '../../components';
import { ZardAlertDialogService } from '../alert-dialog.service';

@Component({
  selector: 'zard-demo-alert-dialog-info',
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zType="secondary" (click)="showInfo()">Show Info</button> `,
})
export class ZardDemoAlertDialogInfoComponent {
  private alertDialogService = inject(ZardAlertDialogService);

  showInfo() {
    this.alertDialogService.info({
      zTitle: 'Information',
      zDescription: 'Your changes have been saved successfully. You can continue working on your project.',
      zOkText: 'Got it',
    });
  }
}

```

```angular-ts showLineNumbers
import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardAlertDialogService } from '../alert-dialog.service';

@Component({
  selector: 'zard-demo-alert-dialog-warning',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="showWarning()">
      Show Warning
    </button>
  `,
})
export class ZardDemoAlertDialogWarningComponent {
  private alertDialogService = inject(ZardAlertDialogService);

  showWarning() {
    this.alertDialogService.warning({
      zTitle: 'Warning',
      zDescription: 'This operation might have unexpected consequences. Please proceed with caution.',
      zOkText: 'I understand',
    });
  }
}
```

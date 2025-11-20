import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardAlertDialogService } from '../alert-dialog.service';

@Component({
  selector: 'zard-demo-alert-dialog-default',
  imports: [ZardButtonComponent],
  standalone: true,
  template: ` <button z-button zType="outline" (click)="showDialog()">Show Dialog</button> `,
})
export class ZardDemoAlertDialogDefaultComponent {
  private alertDialogService = inject(ZardAlertDialogService);

  showDialog() {
    this.alertDialogService.confirm({
      zTitle: 'Are you absolutely sure?',
      zDescription:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}

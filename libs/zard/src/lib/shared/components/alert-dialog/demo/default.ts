import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-default',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogDefaultComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription: 'This action cannot be undone. This will permanently delete your account from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}

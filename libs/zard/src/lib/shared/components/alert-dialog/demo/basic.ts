import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'z-demo-alert-dialog-basic',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogBasicComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}

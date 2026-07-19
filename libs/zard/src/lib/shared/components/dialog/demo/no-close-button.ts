import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'zard-demo-dialog-no-close-button',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">No Close Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogNoCloseButtonComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zTitle: 'No Close Button',
      zDescription: "This dialog doesn't have a close button in the top-right corner.",
      zClosable: false,
      zHideFooter: true,
    });
  }
}

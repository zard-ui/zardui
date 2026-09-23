import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-sonner-with-dialog',
  imports: [ZardDialogImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Open dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerWithDialogComponent {
  private readonly dialogService = inject(ZardDialogService);
  private readonly sonner = inject(ZardSonnerService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Save changes',
      zDescription: 'The toast stays above the dialog and its backdrop.',
      zContent: 'Confirm to dispatch a toast without closing the dialog.',
      zOkText: 'Save',
      zMaskClosable: false,
      zOnOk: () => {
        this.sonner.success('Changes saved');
        return false;
      },
    });
  }
}

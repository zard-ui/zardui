import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { lucideSave, lucideX } from '@ng-icons/lucide';

import { ZardDemoDialogBasicInputComponent } from '@/shared/components/dialog/demo/basic';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';

import { ZardDialogService } from '../dialog.service';

interface iDialogData {
  name: string;
  username: string;
}

@Component({
  imports: [ZardDialogImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogWithIconsComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit Profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogBasicInputComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
        region: 'america',
      } as iDialogData,
      zCancelIcon: lucideX,
      zOkIcon: lucideSave,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
      zWidth: '425px',
    });
  }
}

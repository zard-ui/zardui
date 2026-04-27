import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-small-with-media',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideBluetooth" />
    </ng-template>
    <button z-button zType="outline" (click)="open(mediaIcon)">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBluetooth })],
})
export class ZardDemoAlertDialogSmallWithMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zSize: 'sm',
      zMedia: media,
      zTitle: 'Allow accessory to connect?',
      zDescription: 'Do you want to allow the USB accessory to connect to this device?',
      zOkText: 'Allow',
      zCancelText: "Don't allow",
    });
  }
}

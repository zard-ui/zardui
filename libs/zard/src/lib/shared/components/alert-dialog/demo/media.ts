import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingPlus } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-media',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideCircleFadingPlus" />
    </ng-template>
    <button z-button zType="outline" (click)="open(mediaIcon)">Share Project</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingPlus })],
})
export class ZardDemoAlertDialogMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zMedia: media,
      zTitle: 'Share this project?',
      zDescription: 'Anyone with the link will be able to view and edit this project.',
      zOkText: 'Share',
      zCancelText: 'Cancel',
    });
  }
}

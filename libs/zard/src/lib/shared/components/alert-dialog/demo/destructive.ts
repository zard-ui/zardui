import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-destructive',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideTrash2" />
    </ng-template>
    <button z-button zType="destructive" (click)="open(mediaIcon)">Delete Chat</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrash2 })],
})
export class ZardDemoAlertDialogDestructiveComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zSize: 'sm',
      zMedia: media,
      zMediaClass: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
      zTitle: 'Delete chat?',
      zDescription:
        'This will permanently delete this chat conversation. View <a href="#">Settings</a> delete any memories saved during this chat.',
      zOkText: 'Delete',
      zCancelText: 'Cancel',
      zOkDestructive: true,
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, signal, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-destructive',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports, NgIcon],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="destructive" (click)="visible.set(true)">Delete Chat</button>

        <z-alert-dialog [(zVisible)]="visible" zSize="sm">
          <z-alert-dialog-header>
            <z-alert-dialog-media class="bg-destructive/10 text-destructive dark:bg-destructive/20">
              <ng-icon name="lucideTrash2" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Delete chat?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This will permanently delete this chat conversation. View
              <a href="#">Settings</a>
              delete any memories saved during this chat.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button zType="destructive" (click)="visible.set(false)">Delete</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <ng-template #mediaIcon>
          <ng-icon name="lucideTrash2" />
        </ng-template>
        <button type="button" z-button zType="destructive" (click)="open(mediaIcon)">Delete Chat</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrash2 })],
})
export class ZardDemoAlertDialogDestructiveComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

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

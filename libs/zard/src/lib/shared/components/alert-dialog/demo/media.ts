import { ChangeDetectionStrategy, Component, inject, signal, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingPlus } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-media',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports, NgIcon],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Share Project</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-media>
              <ng-icon name="lucideCircleFadingPlus" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Share this project?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Anyone with the link will be able to view and edit this project.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Share</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <ng-template #mediaIcon>
          <ng-icon name="lucideCircleFadingPlus" />
        </ng-template>
        <button type="button" z-button zType="outline" (click)="open(mediaIcon)">Share Project</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingPlus })],
})
export class ZardDemoAlertDialogMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

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

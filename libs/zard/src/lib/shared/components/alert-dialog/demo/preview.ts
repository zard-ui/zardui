import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-preview',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This action cannot be undone. This will permanently delete your account from our servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogPreviewComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription: 'This action cannot be undone. This will permanently delete your account from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}

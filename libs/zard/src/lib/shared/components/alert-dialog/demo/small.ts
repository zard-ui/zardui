import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-small',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible" zSize="sm">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Allow accessory to connect?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Do you want to allow the USB accessory to connect to this device?
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Don't allow</button>
            <button type="button" z-button (click)="visible.set(false)">Allow</button>
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
export class ZardDemoAlertDialogSmallComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open() {
    this.alertDialogService.create({
      zSize: 'sm',
      zTitle: 'Allow accessory to connect?',
      zDescription: 'Do you want to allow the USB accessory to connect to this device?',
      zOkText: 'Allow',
      zCancelText: "Don't allow",
    });
  }
}

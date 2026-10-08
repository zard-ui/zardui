import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-dialog-no-close-button',
  imports: [ZardButtonComponent, ZardDialogImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">No Close Button</button>

        <z-dialog [(zVisible)]="visible" [zClosable]="false">
          <z-dialog-header>
            <z-dialog-title>No Close Button</z-dialog-title>
            <z-dialog-description>
              This dialog doesn't have a close button in the top-right corner.
            </z-dialog-description>
          </z-dialog-header>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">No Close Button</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogNoCloseButtonComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'No Close Button',
      zDescription: "This dialog doesn't have a close button in the top-right corner.",
      zClosable: false,
      zHideFooter: true,
    });
  }
}

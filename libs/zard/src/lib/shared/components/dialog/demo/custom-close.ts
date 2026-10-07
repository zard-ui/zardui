import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Content the service renders; it brings its own footer, so the options hide the default one. */
@Component({
  selector: 'z-demo-dialog-custom-close-content',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent],
  template: `
    <div class="flex items-center gap-2">
      <div class="grid flex-1 gap-2">
        <label for="share-link-service" class="sr-only">Link</label>
        <input z-input id="share-link-service" value="https://ui.zardui.com/docs/installation" readonly />
      </div>
    </div>
    <z-dialog-footer class="sm:justify-start">
      <button type="button" z-button z-dialog-close>Close</button>
    </z-dialog-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseContentComponent {}

@Component({
  selector: 'z-demo-dialog-custom-close',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Share</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Share link</z-dialog-title>
            <z-dialog-description>Anyone who has this link will be able to view this.</z-dialog-description>
          </z-dialog-header>
          <div class="flex items-center gap-2">
            <div class="grid flex-1 gap-2">
              <label for="share-link" class="sr-only">Link</label>
              <input z-input id="share-link" value="https://ui.zardui.com/docs/installation" readonly />
            </div>
          </div>
          <z-dialog-footer class="sm:justify-start">
            <button type="button" z-button z-dialog-close>Close</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Share</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'Share link',
      zDescription: 'Anyone who has this link will be able to view this.',
      zContent: ZardDemoDialogCustomCloseContentComponent,
      zHideFooter: true,
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
);

/** Content the service renders: the paragraphs scroll while the footer stays put. */
@Component({
  selector: 'z-demo-dialog-sticky-footer-content',
  template: `
    <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
      @for (paragraph of paragraphs; track $index) {
        <p class="mb-4 leading-normal">{{ paragraph }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogStickyFooterContentComponent {
  protected readonly paragraphs = PARAGRAPHS;
}

@Component({
  selector: 'z-demo-dialog-sticky-footer',
  imports: [ZardButtonComponent, ZardDialogImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Sticky Footer</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Sticky Footer</z-dialog-title>
            <z-dialog-description>
              This dialog has a sticky footer that stays visible while the content scrolls.
            </z-dialog-description>
          </z-dialog-header>
          <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            @for (paragraph of paragraphs; track $index) {
              <p class="mb-4 leading-normal">{{ paragraph }}</p>
            }
          </div>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Close</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Sticky Footer</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogStickyFooterComponent {
  private readonly dialogService = inject(ZardDialogService);

  protected readonly paragraphs = PARAGRAPHS;
  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'Sticky Footer',
      zDescription: 'This dialog has a sticky footer that stays visible while the content scrolls.',
      zContent: ZardDemoDialogStickyFooterContentComponent,
      zCancelText: 'Close',
      zOkText: null,
    });
  }
}

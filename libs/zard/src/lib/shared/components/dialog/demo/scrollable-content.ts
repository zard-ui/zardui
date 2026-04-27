import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

@Component({
  selector: 'zard-demo-dialog-scrollable-content-content',
  template: `
    <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
      @for (paragraph of paragraphs; track $index) {
        <p class="mb-4 leading-normal">{{ paragraph }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogScrollableContentInnerComponent {
  protected readonly paragraphs = PARAGRAPHS;
}

@Component({
  selector: 'zard-demo-dialog-scrollable-content',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Scrollable Content</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogScrollableContentComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zTitle: 'Scrollable Content',
      zDescription: 'This is a dialog with scrollable content.',
      zContent: ZardDemoDialogScrollableContentInnerComponent,
      zHideFooter: true,
    });
  }
}

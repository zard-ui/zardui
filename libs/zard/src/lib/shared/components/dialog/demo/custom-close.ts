import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogRef } from '@/shared/components/dialog/dialog-ref';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputDirective } from '@/shared/components/input/input.directive';

@Component({
  selector: 'zard-demo-dialog-custom-close-content',
  imports: [ZardButtonComponent, ZardInputDirective],
  template: `
    <div class="flex items-center gap-2">
      <div class="grid flex-1 gap-2">
        <label for="link" class="sr-only">Link</label>
        <input z-input id="link" value="https://ui.zardui.com/docs/installation" readonly />
      </div>
    </div>
    <footer
      class="bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-start"
    >
      <button type="button" z-button (click)="dialogRef.close()">Close</button>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseContentComponent {
  protected readonly dialogRef = inject(ZardDialogRef);
}

@Component({
  selector: 'zard-demo-dialog-custom-close',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Share</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zTitle: 'Share link',
      zDescription: 'Anyone who has this link will be able to view this.',
      zContent: ZardDemoDialogCustomCloseContentComponent,
      zHideFooter: true,
    });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';

@Component({
  selector: 'zard-demo-sheet-no-close-button',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">No Close Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetNoCloseButtonComponent {
  private readonly sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'No Close Button',
      zDescription: "This sheet doesn't have a close button in the top-right corner.",
      zClosable: false,
      zCancelText: 'Close',
      zOkText: null,
    });
  }
}

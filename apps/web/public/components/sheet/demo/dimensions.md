```angular-ts showLineNumbers copyButton
import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardSheetService } from '@ngzard/ui/sheet';

@Component({
  selector: 'z-demo-sheet-dimensions',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-4">
      <button z-button zType="outline" (click)="openWideSheet()">Wide Sheet (500px)</button>
      <button z-button zType="outline" (click)="openTallSheet()">Tall Sheet (80vh)</button>
      <button z-button zType="outline" (click)="openCustomSheet()">Custom Dimensions</button>
      <button z-button zType="outline" (click)="openTopSheet()">Top Sheet</button>
    </div>
  `,
})
export class ZardDemoSheetDimensionsComponent {
  private sheetService = inject(ZardSheetService);

  openWideSheet() {
    this.sheetService.create({
      zTitle: 'Wide Sheet',
      zDescription: 'This sheet has a custom width of 500px',
      zContent: `
        <div class="p-4">
          <p>This is a wide sheet with custom width.</p>
          <p>Perfect for forms that need more horizontal space.</p>
        </div>
      `,
      zSide: 'right',
      zWidth: '500px',
      zOkText: 'Got it',
    });
  }

  openTallSheet() {
    this.sheetService.create({
      zTitle: 'Tall Sheet',
      zDescription: 'This sheet has a custom height of 80vh',
      zContent: `
        <div class="p-4 space-y-4">
          <p>This is a tall sheet with custom height (80% of viewport height).</p>
          <p>Great for content that needs vertical space.</p>
          <div class="h-96 bg-gray-100 rounded-md flex items-center justify-center">
            <p class="text-gray-500">Large content area</p>
          </div>
        </div>
      `,
      zSide: 'left',
      zHeight: '80vh',
      zOkText: 'Close',
    });
  }

  openCustomSheet() {
    this.sheetService.create({
      zTitle: 'Custom Dimensions',
      zDescription: 'Both width and height customized',
      zContent: `
        <div class="p-4">
          <p>Width: 400px, Height: 60vh</p>
          <p>Complete control over dimensions.</p>
        </div>
      `,
      zSide: 'right',
      zWidth: '400px',
      zHeight: '60vh',
      zOkText: 'Close',
    });
  }

  openTopSheet() {
    this.sheetService.create({
      zTitle: 'Top Sheet',
      zDescription: 'Custom height for top position',
      zContent: `
        <div class="p-4">
          <p>This top sheet has a custom height.</p>
          <p>Height: 50vh</p>
        </div>
      `,
      zSide: 'top',
      zHeight: '50vh',
      zOkText: 'Done',
    });
  }
}

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-sheet-no-close-button',
  imports: [ZardButtonComponent, ZardSheetImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open Sheet</button>

        <z-sheet [(zVisible)]="visible" [zClosable]="false">
          <z-sheet-header>
            <z-sheet-title>No Close Button</z-sheet-title>
            <z-sheet-description>
              This sheet doesn't have a close button in the top-right corner. Click outside to close.
            </z-sheet-description>
          </z-sheet-header>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openSheet()">Open Sheet</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetNoCloseButtonComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly visible = signal(false);

  openSheet() {
    this.sheetService.create({
      zTitle: 'No Close Button',
      zDescription: "This sheet doesn't have a close button in the top-right corner. Click outside to close.",
      zClosable: false,
      zHideFooter: true,
    });
  }
}

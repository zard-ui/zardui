import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import type { ZardSheetVariants } from '@/shared/components/sheet/sheet.variants';

type SheetSide = NonNullable<ZardSheetVariants['zSide']>;

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

@Component({
  selector: 'zard-demo-sheet-side-content',
  template: `
    @for (paragraph of paragraphs; track $index) {
      <p class="mb-2 leading-relaxed">{{ paragraph }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'no-scrollbar min-h-0 overflow-y-auto px-4' },
})
export class ZardDemoSheetSideContentComponent {
  protected readonly paragraphs = PARAGRAPHS;
}

@Component({
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (side of sides; track side) {
        <button type="button" z-button zType="outline" class="capitalize" (click)="openSheet(side)">{{ side }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetSideComponent {
  private readonly sheetService = inject(ZardSheetService);

  protected readonly sides = ['top', 'right', 'bottom', 'left'] as const satisfies readonly SheetSide[];

  openSheet(side: SheetSide) {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetSideContentComponent,
      zSide: side,
      // Horizontal sheets already fill the viewport height; cap the vertical ones so the
      // content scrolls instead of pushing the footer off-screen.
      zCustomClasses: side === 'top' || side === 'bottom' ? 'max-h-[50vh]' : undefined,
      zOkText: 'Save changes',
      zCancelText: 'Cancel',
    });
  }
}

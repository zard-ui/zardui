import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import type { ZardSheetSide } from '@/shared/components/sheet/sheet-panel.component';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const SIDES = ['top', 'right', 'bottom', 'left'] as const satisfies readonly ZardSheetSide[];

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
);

/** Content the service renders: a scrolling column of paragraphs. */
@Component({
  selector: 'z-demo-sheet-side-content',
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
  selector: 'z-demo-sheet-side',
  imports: [ZardButtonComponent, ZardSheetImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <div class="flex flex-wrap gap-2">
          @for (option of sides; track option) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="open(option)">
              {{ option }}
            </button>
          }
        </div>

        <!-- Horizontal sheets already fill the viewport height; cap the vertical ones so the
             content scrolls instead of pushing the footer off-screen. -->
        <z-sheet [(zVisible)]="visible" [zSide]="side()" [class]="vertical() ? 'max-h-[50vh]' : ''">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <div class="no-scrollbar min-h-0 overflow-y-auto px-4">
            @for (paragraph of paragraphs; track $index) {
              <p class="mb-2 leading-relaxed">{{ paragraph }}</p>
            }
          </div>
          <z-sheet-footer>
            <button type="button" z-button z-sheet-close>Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Cancel</button>
          </z-sheet-footer>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <div class="flex flex-wrap gap-2">
          @for (option of sides; track option) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="openSheet(option)">
              {{ option }}
            </button>
          }
        </div>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetSideComponent {
  private readonly sheetService = inject(ZardSheetService);

  protected readonly sides = SIDES;
  protected readonly paragraphs = PARAGRAPHS;

  readonly visible = signal(false);
  readonly side = signal<ZardSheetSide>('right');
  readonly vertical = computed(() => this.side() === 'top' || this.side() === 'bottom');

  open(side: ZardSheetSide) {
    this.side.set(side);
    this.visible.set(true);
  }

  openSheet(side: ZardSheetSide) {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetSideContentComponent,
      zSide: side,
      zCustomClasses: side === 'top' || side === 'bottom' ? 'max-h-[50vh]' : undefined,
      zOkText: 'Save changes',
      zCancelText: 'Cancel',
    });
  }
}

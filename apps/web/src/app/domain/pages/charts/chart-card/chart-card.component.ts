import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChartArea,
  lucideChartColumnBig,
  lucideChartLine,
  lucideChartPie,
  lucideHexagon,
  lucideMousePointer2,
  lucideRadar,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSheetService } from '@zard/components/sheet/sheet.service';

import { ChartCodeSheetComponent, type ChartCodeSheetData } from './chart-code-sheet.component';
import type { ChartExample } from '../../../config/charts-registry';
import type { ChartCategory } from '../../../services/charts.service';

/** The icon and caption shadcn prints above every chart card, one per category. */
const CATEGORY_CHROME: Record<ChartCategory, { icon: string; label: string }> = {
  area: { icon: 'lucideChartArea', label: 'Area Chart' },
  bar: { icon: 'lucideChartColumnBig', label: 'Bar Chart' },
  line: { icon: 'lucideChartLine', label: 'Line Chart' },
  pie: { icon: 'lucideChartPie', label: 'Pie Chart' },
  radar: { icon: 'lucideHexagon', label: 'Radar Chart' },
  radial: { icon: 'lucideRadar', label: 'Radial Chart' },
  tooltip: { icon: 'lucideMousePointer2', label: 'Tooltip' },
};

@Component({
  selector: 'z-chart-card',
  imports: [NgComponentOutlet, CopyButtonComponent, NgIcon, ZardButtonComponent, ZardSeparatorComponent],
  template: `
    @let example = chart();
    @let chrome = categoryChrome();
    <div
      class="group relative flex h-full flex-col [&_[data-slot=card]]:flex-1 [&>ng-component]:flex [&>ng-component]:min-h-0 [&>ng-component]:flex-1 [&>ng-component]:flex-col"
    >
      <div class="relative z-20 flex items-center gap-2 px-3 py-2.5">
        <div class="text-muted-foreground flex items-center gap-1.5 pl-1 text-[13px]">
          <ng-icon [name]="chrome.icon" class="h-[0.9rem] w-[0.9rem]" />
          {{ chrome.label }}
        </div>

        <div class="ml-auto flex items-center gap-2">
          <z-copy-button
            [code]="example.codeData.code"
            class="text-foreground hover:bg-muted focus-visible:ring-ring flex h-6 w-6 cursor-pointer items-center justify-center rounded-[6px] bg-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none [&_img]:size-3"
          />
          <z-separator zOrientation="vertical" class="mx-0 hidden h-4! md:flex" />
          <button z-button zType="outline" zSize="sm" type="button" (click)="viewCode()">View Code</button>
        </div>
      </div>

      <ng-container *ngComponentOutlet="example.component" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideChartArea,
      lucideChartColumnBig,
      lucideChartLine,
      lucideChartPie,
      lucideHexagon,
      lucideMousePointer2,
      lucideRadar,
    }),
  ],
})
export class ChartCardComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly chart = input.required<ChartExample>();
  readonly category = input.required<ChartCategory>();

  protected readonly categoryChrome = computed(() => CATEGORY_CHROME[this.category()]);

  protected viewCode(): void {
    const example = this.chart();
    // A drawer up from the bottom on a phone, a panel in from the side on a desktop.
    const narrow = typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(max-width: 768px)').matches;

    this.sheetService.create<ChartCodeSheetComponent, ChartCodeSheetData>({
      zTitle: `${this.categoryChrome().label} — ${example.title}`,
      zDescription: 'Copy and paste the following code into your project.',
      zContent: ChartCodeSheetComponent,
      zData: { codeData: example.codeData, fileName: `${example.id}.ts` },
      zSide: narrow ? 'bottom' : 'right',
      zSize: 'custom',
      ...(narrow ? { zHeight: '88vh' } : { zWidth: 'min(46rem, 92vw)' }),
      zHideFooter: true,
    });
  }
}

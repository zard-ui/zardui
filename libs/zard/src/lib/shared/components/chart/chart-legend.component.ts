import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZARD_CHART } from './chart-context';
import type { ZardChartLegendEntry } from './chart.types';
import {
  chartLegendItemVariants,
  chartLegendSwatchVariants,
  chartLegendVariants,
  type ZardChartLegendAlignVariants,
} from './chart.variants';

/**
 * The only declarative child that renders real DOM. ECharts' own legend cannot reproduce the
 * shadcn markup, so the option keeps `legend: { show: false }` and this component draws the
 * entries below (or above) the canvas, toggling series through `legendToggleSelect`.
 */
@Component({
  selector: 'z-chart-legend',
  imports: [NgIcon],
  template: `
    @for (entry of entries(); track entry.name) {
      <button
        type="button"
        [class]="itemClasses(entry.name)"
        [attr.aria-pressed]="!hidden().has(entry.name)"
        (click)="toggle(entry.name)"
      >
        @if (entry.icon) {
          <ng-icon [name]="entry.icon" class="size-3" />
        } @else {
          <span [class]="swatchClasses()" [style.background-color]="entry.color"></span>
        }
        {{ entry.label }}
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'chart-legend', '[class]': 'classes()' },
  exportAs: 'zChartLegend',
})
export class ZardChartLegendComponent {
  private readonly chart = inject(ZARD_CHART, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zVerticalAlign = input<ZardChartLegendAlignVariants>('bottom');

  protected readonly entries = computed<ZardChartLegendEntry[]>(() => this.chart?.legendEntries() ?? []);
  protected readonly hidden = computed<ReadonlySet<string>>(() => this.chart?.hiddenSeries() ?? new Set<string>());

  protected readonly classes = computed(() =>
    mergeClasses(chartLegendVariants({ zVerticalAlign: this.zVerticalAlign() }), this.class()),
  );

  protected readonly swatchClasses = computed(() => mergeClasses(chartLegendSwatchVariants()));

  protected itemClasses(name: string): string {
    return mergeClasses(chartLegendItemVariants({ zInactive: this.hidden().has(name) }));
  }

  protected toggle(name: string): void {
    this.chart?.toggleSeries(name);
  }
}

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardChartTooltipIndicator, ZardChartTooltipTrigger } from './chart.types';

/**
 * Declares the tooltip the parent `z-chart` should build.
 *
 * ECharts is config-driven: there is a single `<div>` and a single option object, so this
 * component renders nothing. `z-chart` reads it through `contentChild` and turns it into
 * `tooltip.formatter`.
 */
@Component({
  selector: 'z-chart-tooltip',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'chart-tooltip', class: 'hidden' },
  exportAs: 'zChartTooltip',
})
export class ZardChartTooltipComponent {
  readonly class = input<ClassValue>('');
  readonly zIndicator = input<ZardChartTooltipIndicator>('dot');
  readonly zHideLabel = input(false, { transform: booleanAttribute });
  readonly zHideIndicator = input(false, { transform: booleanAttribute });
  readonly zLabelKey = input<string>();
  readonly zNameKey = input<string>();
  readonly zLabelFormatter = input<(value: string) => string>();
  readonly zValueFormatter = input<(value: number, name: string) => string>();
  readonly zTrigger = input<ZardChartTooltipTrigger>('axis');
  readonly zLabelClass = input<ClassValue>('');
  /**
   * Draws the axis pointer under the tooltip — a line on curves, a band on bars.
   * Off by default, like shadcn's `<ChartTooltip cursor={false} />`.
   */
  readonly zCursor = input(false, { transform: booleanAttribute });
  /** Opens the tooltip on this data index as soon as the chart draws, like shadcn's `defaultIndex`. */
  readonly zDefaultIndex = input<number | undefined>(undefined, { transform: numberAttribute });
}

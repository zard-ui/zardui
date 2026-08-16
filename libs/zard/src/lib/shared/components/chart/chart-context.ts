import { InjectionToken, type Signal } from '@angular/core';

import type { ZardChartLegendEntry } from './chart.types';

/**
 * The slice of `z-chart` its declarative children are allowed to touch.
 * Declared apart from the component so `z-chart-legend` can inject the parent
 * without the two files importing each other.
 */
export interface ZardChartHost {
  /** One entry per series — or per slice, for pie and single-series radial charts. */
  readonly legendEntries: Signal<ZardChartLegendEntry[]>;
  /** Names currently toggled off through the legend. */
  readonly hiddenSeries: Signal<ReadonlySet<string>>;
  /** Toggles a series on the live ECharts instance. */
  toggleSeries(name: string): void;
}

export const ZARD_CHART = new InjectionToken<ZardChartHost>('ZARD_CHART');

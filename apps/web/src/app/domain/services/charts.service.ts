import { Injectable } from '@angular/core';

import { CHARTS_REGISTRY, type ChartExample } from '../config/charts-registry';

export type ChartCategory = 'area' | 'bar' | 'line' | 'pie' | 'radar' | 'radial';

export const CHART_CATEGORIES: ChartCategory[] = ['area', 'bar', 'line', 'pie', 'radar', 'radial'];

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private readonly charts = new Map<ChartCategory, ChartExample[]>();

  constructor() {
    this.initializeCharts();
  }

  /**
   * Get every example of a category, in registry order.
   */
  getChartsByCategory(category: ChartCategory): ChartExample[] {
    return this.charts.get(category) ?? [];
  }

  /**
   * Get every example from every category.
   */
  getAllCharts(): ChartExample[] {
    return CHART_CATEGORIES.flatMap(category => this.getChartsByCategory(category));
  }

  /**
   * Get the categories that actually have examples registered.
   */
  getCategories(): ChartCategory[] {
    return CHART_CATEGORIES.filter(category => this.getChartsByCategory(category).length > 0);
  }

  /**
   * Narrows an arbitrary route parameter to a known category.
   */
  isChartCategory(value: string | null | undefined): value is ChartCategory {
    return !!value && (CHART_CATEGORIES as string[]).includes(value);
  }

  private initializeCharts(): void {
    for (const category of CHART_CATEGORIES) {
      this.charts.set(category, CHARTS_REGISTRY[category] ?? []);
    }
  }
}

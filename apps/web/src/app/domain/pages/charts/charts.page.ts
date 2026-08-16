import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CategoryTabsComponent, type CategoryTab } from '@doc/shared/components/category-tabs/category-tabs.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { ChartCardComponent } from './chart-card/chart-card.component';
import type { ChartExample } from '../../config/charts-registry';
import { ChartsService, type ChartCategory } from '../../services/charts.service';

const DEFAULT_CATEGORY: ChartCategory = 'area';

/** What each category is called in a title — the tab label, without the trailing noise. */
const CATEGORY_LABELS: Record<ChartCategory, string> = {
  area: 'Area Charts',
  bar: 'Bar Charts',
  line: 'Line Charts',
  pie: 'Pie Charts',
  radar: 'Radar Charts',
  radial: 'Radial Charts',
  tooltip: 'Chart Tooltips',
};

@Component({
  selector: 'z-charts',
  imports: [CategoryTabsComponent, ChartCardComponent, RouterLink, ZardButtonComponent],
  templateUrl: './charts.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsPage implements OnInit {
  private readonly chartsService = inject(ChartsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);

  protected readonly charts = signal<ChartExample[]>([]);
  protected readonly currentCategory = signal<ChartCategory>(DEFAULT_CATEGORY);

  protected readonly categoryTabs: CategoryTab[] = [
    { label: 'Area Charts', route: '/charts' },
    { label: 'Bar Charts', route: '/charts/bar' },
    { label: 'Line Charts', route: '/charts/line' },
    { label: 'Pie Charts', route: '/charts/pie' },
    { label: 'Radar Charts', route: '/charts/radar' },
    { label: 'Radial Charts', route: '/charts/radial' },
    { label: 'Tooltips', route: '/charts/tooltip' },
  ];

  /** Every category is its own page: it deserves its own title, description and canonical URL. */
  private setSeo(category: ChartCategory): void {
    const label = CATEGORY_LABELS[category];
    const path = category === DEFAULT_CATEGORY ? '/charts' : `/charts/${category}`;

    this.seoService.setDocsSeo(
      `${label} for the Web`,
      `Ready-made ${label.toLowerCase()} built with Apache ECharts. Copy and paste into your apps. Works with all Angular ecosystems. Open Source. Free forever.`,
      path,
      'og-blockspage.jpg',
    );
  }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const requested = params['category'];
      const category = this.chartsService.isChartCategory(requested) ? requested : DEFAULT_CATEGORY;
      this.currentCategory.set(category);
      this.charts.set(this.chartsService.getChartsByCategory(category));
      this.setSeo(category);
    });
  }
}

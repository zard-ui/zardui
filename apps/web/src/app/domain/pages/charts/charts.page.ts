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
    { label: 'Area', route: '/charts' },
    { label: 'Bar', route: '/charts/bar' },
    { label: 'Line', route: '/charts/line' },
    { label: 'Pie', route: '/charts/pie' },
    { label: 'Radar', route: '/charts/radar' },
    { label: 'Radial', route: '/charts/radial' },
  ];

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const requested = params['category'];
      const category = this.chartsService.isChartCategory(requested) ? requested : DEFAULT_CATEGORY;
      this.currentCategory.set(category);
      this.charts.set(this.chartsService.getChartsByCategory(category));
    });

    this.seoService.setDocsSeo(
      'Beautiful Charts for the Web',
      'Ready-made charts built with Apache ECharts. Copy and paste into your apps. Works with all Angular ecosystems. Open Source. Free forever.',
      '/charts',
      'og-blockspage.jpg',
    );
  }
}

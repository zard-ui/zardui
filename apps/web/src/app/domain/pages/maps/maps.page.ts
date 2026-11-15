import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { injectIsMobile } from '@doc/domain/pages/typeset/utils/inject-is-mobile';
import { CategoryTabsComponent, type CategoryTab } from '@doc/shared/components/category-tabs/category-tabs.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardMapStyleSelectComponent } from '@zard/components/map-style-select/map-style-select.component';

import { MapBlockComponent } from './map-block/map-block.component';
import type { MapBlock } from '../../config/maps-registry';
import { MAP_CATEGORIES, MapsService, type MapCategory } from '../../services/maps.service';

const DEFAULT_CATEGORY: MapCategory = MAP_CATEGORIES[0].id;

/** What each category is called in a title and a description. */
const CATEGORY_SEO: Record<MapCategory, { title: string; about: string }> = {
  analytics: {
    title: 'Analytics Maps',
    about: 'analytics dashboards with a world map, a choropleth and an uptime monitor',
  },
  logistics: { title: 'Logistics Maps', about: 'a delivery tracker, a logistics network and a store locator' },
  data: { title: 'Data Maps', about: 'heatmaps, clusters and flights' },
  '3d': { title: '3D Maps', about: 'a 3D city and terrain' },
  draw: { title: 'Map Drawing', about: 'drawing and editing shapes on a map' },
};

@Component({
  selector: 'z-maps',
  imports: [CategoryTabsComponent, MapBlockComponent, RouterLink, ZardButtonComponent, ZardMapStyleSelectComponent],
  templateUrl: './maps.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapsService = inject(MapsService);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);

  /** On a phone the picker sits at the start of its row, so its list opens to the right of it. */
  protected readonly isMobile = injectIsMobile();
  protected readonly blocks = signal<MapBlock[]>([]);
  protected readonly currentCategory = signal<MapCategory>(DEFAULT_CATEGORY);

  /** One tab and one page per group of blocks: `/maps`, `/maps/logistics`, ... */
  protected readonly categoryTabs: CategoryTab[] = MAP_CATEGORIES.map(category => ({
    label: category.label,
    route: category.id === DEFAULT_CATEGORY ? '/maps' : `/maps/${category.id}`,
  }));

  /** Every category is its own page: it deserves its own title, description and canonical URL. */
  private setSeo(category: MapCategory): void {
    const { title, about } = CATEGORY_SEO[category];
    const path = category === DEFAULT_CATEGORY ? '/maps' : `/maps/${category}`;

    this.seoService.setDocsSeo(
      `Beautiful ${title} for the Web`,
      `Ready-made map blocks: ${about}. Built with MapLibre GL and ng-mapcn, themed with zard. Copy and paste into your apps. Works with all Angular ecosystems. Open Source. Free forever.`,
      path,
      'og-blockspage.jpg',
    );
  }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const requested = params['category'];
      const category = this.mapsService.isMapCategory(requested) ? requested : DEFAULT_CATEGORY;
      this.currentCategory.set(category);
      this.blocks.set(this.mapsService.getBlocksByCategory(category));
      this.setSeo(category);
    });
  }
}

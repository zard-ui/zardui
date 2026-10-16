import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CategoryTabsComponent, type CategoryTab } from '@doc/shared/components/category-tabs/category-tabs.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardMapStyleSelectComponent } from '@zard/components/map-style-select/map-style-select.component';

import { MapCardComponent } from './map-card/map-card.component';
import type { MapBlock } from '../../config/maps-registry';
import { MapsService, type MapCategory } from '../../services/maps.service';

const DEFAULT_CATEGORY: MapCategory = 'analytics';

/** What each category is called in a title and a description. */
const CATEGORY_COPY: Record<MapCategory, { label: string; description: string }> = {
  analytics: {
    label: 'Analytics Maps',
    description: 'Dashboards that put numbers on a map: visitors by region, a choropleth and an uptime monitor.',
  },
  logistics: {
    label: 'Logistics Maps',
    description: 'A delivery tracker, a freight network and a store locator, built from routes, arcs and markers.',
  },
  data: {
    label: 'Data Maps',
    description: 'Heatmaps, clusters and flight arcs for datasets with thousands of points.',
  },
  '3d': {
    label: '3D Maps',
    description: 'Extruded buildings and terrain with hillshade, with the camera in your hands.',
  },
  draw: {
    label: 'Draw Maps',
    description: 'Draw, select and edit points, lines and polygons, and read the measurements back.',
  },
};

@Component({
  selector: 'z-maps',
  imports: [CategoryTabsComponent, MapCardComponent, RouterLink, ZardButtonComponent, ZardMapStyleSelectComponent],
  templateUrl: './maps.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapsService = inject(MapsService);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);

  protected readonly blocks = signal<MapBlock[]>([]);
  protected readonly currentCategory = signal<MapCategory>(DEFAULT_CATEGORY);
  protected readonly categoryCopy = CATEGORY_COPY;

  protected readonly categoryTabs: CategoryTab[] = [
    { label: 'Analytics', route: '/maps' },
    { label: 'Logistics', route: '/maps/logistics' },
    { label: 'Data', route: '/maps/data' },
    { label: '3D', route: '/maps/3d' },
    { label: 'Draw', route: '/maps/draw' },
  ];

  /** Every category is its own page: it deserves its own title, description and canonical URL. */
  private setSeo(category: MapCategory): void {
    const { label, description } = CATEGORY_COPY[category];
    const path = category === DEFAULT_CATEGORY ? '/maps' : `/maps/${category}`;

    this.seoService.setDocsSeo(
      `${label} for the Web`,
      `${description} Built with MapLibre GL and ng-mapcn, themed with zard. Copy and paste into your apps. Works with all Angular ecosystems. Open Source. Free forever.`,
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

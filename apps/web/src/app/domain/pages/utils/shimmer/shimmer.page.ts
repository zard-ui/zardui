import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { BLOCK_1 as INSTALL_IMPORT, TABS_0 as INSTALL_TABS } from '@generated/pages/utils/installation';
import { BLOCK_0, BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, BLOCK_5, BLOCK_6, BLOCK_7 } from '@generated/pages/utils/shimmer';
import { UTILS_SHIMMER_BASIC } from '@generated/utils/shimmer/basic';
import { UTILS_SHIMMER_COLOR } from '@generated/utils/shimmer/color';
import { UTILS_SHIMMER_DURATION } from '@generated/utils/shimmer/duration';
import { UTILS_SHIMMER_ONCE } from '@generated/utils/shimmer/once';
import { UTILS_SHIMMER_SPREAD_ANGLE } from '@generated/utils/shimmer/spread-angle';
import { UTILS_SHIMMER_STATUS } from '@generated/utils/shimmer/status';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { UtilsClassTableComponent, type UtilsClassRow } from '../components/utils-class-table.component';
import { UtilsSectionComponent } from '../components/utils-section.component';
import { ZardUtilsShimmerBasicComponent } from '../demos/shimmer/basic';
import { ZardUtilsShimmerColorComponent } from '../demos/shimmer/color';
import { ZardUtilsShimmerDurationComponent } from '../demos/shimmer/duration';
import { ZardUtilsShimmerOnceComponent } from '../demos/shimmer/once';
import { ZardUtilsShimmerSpreadAngleComponent } from '../demos/shimmer/spread-angle';
import { ZardUtilsShimmerStatusComponent } from '../demos/shimmer/status';

const CLASS_ROWS: UtilsClassRow[] = [
  { name: 'shimmer', description: 'Sweeps a highlight across the text; 2s, linear, infinite.' },
  { name: 'shimmer-once', description: 'A single sweep instead of a loop.' },
  { name: 'shimmer-reverse', description: 'Reverses the sweep direction.' },
  { name: 'shimmer-none', description: 'Disables the effect; the text renders in currentColor.' },
  {
    name: 'shimmer-color-<color>',
    description: 'Highlight colour — a theme colour or an arbitrary one; supports the /<opacity> modifier.',
  },
  {
    name: 'shimmer-duration-<number>',
    description: 'Sweep duration in milliseconds (shimmer-duration-1000 is one second).',
  },
  {
    name: 'shimmer-spread-<number>',
    description: 'Width of the highlight band, from the spacing scale or an arbitrary length or percentage.',
  },
  { name: 'shimmer-angle-<number>', description: 'Tilt of the band, in degrees.' },
];

const PROPERTY_ROWS: UtilsClassRow[] = [
  {
    name: '--shimmer-color',
    description: 'Highlight colour. Derived from currentColor, and brighter in dark mode.',
    default: 'oklch(from currentColor l c h / calc(alpha * 0.2))',
  },
  { name: '--shimmer-duration', description: 'Sweep duration.', default: '2s' },
  { name: '--shimmer-spread', description: 'Band width.', default: 'calc(3ch + 40px)' },
  { name: '--shimmer-angle', description: 'Band tilt.', default: '20deg' },
];

@Component({
  selector: 'z-shimmer',
  templateUrl: './shimmer.page.html',
  imports: [
    CodeBlockComponent,
    CodeTabsComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    UtilsClassTableComponent,
    UtilsSectionComponent,
    ZardCodeBoxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShimmerPage implements OnInit {
  private readonly seoService = inject(SeoService);

  activeAnchor?: string;

  protected readonly demos = {
    basic: { component: ZardUtilsShimmerBasicComponent, code: UTILS_SHIMMER_BASIC },
    color: { component: ZardUtilsShimmerColorComponent, code: UTILS_SHIMMER_COLOR },
    duration: { component: ZardUtilsShimmerDurationComponent, code: UTILS_SHIMMER_DURATION },
    spreadAngle: { component: ZardUtilsShimmerSpreadAngleComponent, code: UTILS_SHIMMER_SPREAD_ANGLE },
    once: { component: ZardUtilsShimmerOnceComponent, code: UTILS_SHIMMER_ONCE },
    status: { component: ZardUtilsShimmerStatusComponent, code: UTILS_SHIMMER_STATUS },
  } as const;

  protected readonly blocks = {
    installTabs: INSTALL_TABS,
    installImport: INSTALL_IMPORT,
    usage: BLOCK_0,
    internals: BLOCK_1,
    color: BLOCK_2,
    duration: BLOCK_3,
    spreadAngle: BLOCK_4,
    once: BLOCK_5,
    none: BLOCK_6,
    guard: BLOCK_7,
  } as const;

  protected readonly classRows = CLASS_ROWS;
  protected readonly propertyRows = PROPERTY_ROWS;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'usage', label: 'Usage', type: 'custom' },
      { id: 'how-it-works', label: 'How it works', type: 'custom' },
      { id: 'color', label: 'Color', type: 'custom' },
      { id: 'duration', label: 'Duration', type: 'custom' },
      { id: 'spread-and-angle', label: 'Spread and angle', type: 'custom' },
      { id: 'once-and-direction', label: 'Once and direction', type: 'custom' },
      { id: 'composition', label: 'Composition', type: 'custom' },
      { id: 'reduced-motion', label: 'Reduced motion', type: 'custom' },
      { id: 'class-reference', label: 'Class reference', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Shimmer',
      'A sweeping highlight across text, for the seconds where something is being generated — a pure CSS utility that inherits the text colour it runs on.',
      '/docs/utils/shimmer',
      'og-utils.jpg',
    );
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { BLOCK_1 as INSTALL_IMPORT, TABS_0 as INSTALL_TABS } from '@generated/pages/utils/installation';
import { BLOCK_0, BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, BLOCK_5, BLOCK_6 } from '@generated/pages/utils/scroll-fade';
import { UTILS_SCROLL_FADE_BASIC } from '@generated/utils/scroll-fade/basic';
import { UTILS_SCROLL_FADE_EDGES } from '@generated/utils/scroll-fade/edges';
import { UTILS_SCROLL_FADE_HORIZONTAL } from '@generated/utils/scroll-fade/horizontal';
import { UTILS_SCROLL_FADE_PER_EDGE } from '@generated/utils/scroll-fade/per-edge';
import { UTILS_SCROLL_FADE_REVEAL } from '@generated/utils/scroll-fade/reveal';
import { UTILS_SCROLL_FADE_SIZE } from '@generated/utils/scroll-fade/size';
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
import { ZardUtilsScrollFadeBasicComponent } from '../demos/scroll-fade/basic';
import { ZardUtilsScrollFadeEdgesComponent } from '../demos/scroll-fade/edges';
import { ZardUtilsScrollFadeHorizontalComponent } from '../demos/scroll-fade/horizontal';
import { ZardUtilsScrollFadePerEdgeComponent } from '../demos/scroll-fade/per-edge';
import { ZardUtilsScrollFadeRevealComponent } from '../demos/scroll-fade/reveal';
import { ZardUtilsScrollFadeSizeComponent } from '../demos/scroll-fade/size';

const CLASS_ROWS: UtilsClassRow[] = [
  { name: 'scroll-fade', description: 'Fades both vertical edges, tracking vertical scroll.' },
  { name: 'scroll-fade-y', description: 'Identical to scroll-fade; the explicit axis form.' },
  { name: 'scroll-fade-x', description: 'Fades both inline edges, tracking horizontal scroll. Mirrors under RTL.' },
  { name: 'scroll-fade-t', description: 'Top edge only.' },
  { name: 'scroll-fade-b', description: 'Bottom edge only.' },
  { name: 'scroll-fade-l', description: 'Left edge only (physical — does not mirror).' },
  { name: 'scroll-fade-r', description: 'Right edge only (physical — does not mirror).' },
  { name: 'scroll-fade-s', description: 'Inline start edge — left in LTR, right in RTL.' },
  { name: 'scroll-fade-e', description: 'Inline end edge — right in LTR, left in RTL.' },
  { name: 'scroll-fade-<number>', description: 'Fade depth from the spacing scale (scroll-fade-4 is 1rem).' },
  { name: 'scroll-fade-[<value>]', description: 'Arbitrary fade depth: any length or percentage.' },
  { name: 'scroll-fade-t-<number>', description: 'Top-edge depth only. Also accepts an arbitrary value.' },
  { name: 'scroll-fade-b-<number>', description: 'Bottom-edge depth only. Also accepts an arbitrary value.' },
  { name: 'scroll-fade-s-<number>', description: 'Inline-start depth only. Also accepts an arbitrary value.' },
  { name: 'scroll-fade-e-<number>', description: 'Inline-end depth only. Also accepts an arbitrary value.' },
  { name: 'scroll-fade-none', description: 'Disables the mask. Useful with variants, e.g. md:scroll-fade-none.' },
];

const PROPERTY_ROWS: UtilsClassRow[] = [
  {
    name: '--scroll-fade-size',
    description: 'Fade depth for every edge — 12% of the container, capped at 40px.',
    default: 'min(12%, calc(var(--spacing) * 10))',
  },
  {
    name: '--scroll-fade-t-size',
    description: 'Top-edge depth.',
    default: '--scroll-fade-size',
  },
  {
    name: '--scroll-fade-b-size',
    description: 'Bottom-edge depth.',
    default: '--scroll-fade-size',
  },
  {
    name: '--scroll-fade-s-size',
    description: 'Inline-start depth.',
    default: '--scroll-fade-size',
  },
  {
    name: '--scroll-fade-e-size',
    description: 'Inline-end depth.',
    default: '--scroll-fade-size',
  },
  {
    name: '--scroll-fade-reveal',
    description: 'How far you scroll before an edge is fully faded — 96px.',
    default: 'calc(var(--spacing) * 24)',
  },
];

@Component({
  selector: 'z-scroll-fade',
  templateUrl: './scroll-fade.page.html',
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
export class ScrollFadePage implements OnInit {
  private readonly seoService = inject(SeoService);

  activeAnchor?: string;

  protected readonly demos = {
    basic: { component: ZardUtilsScrollFadeBasicComponent, code: UTILS_SCROLL_FADE_BASIC },
    horizontal: { component: ZardUtilsScrollFadeHorizontalComponent, code: UTILS_SCROLL_FADE_HORIZONTAL },
    edges: { component: ZardUtilsScrollFadeEdgesComponent, code: UTILS_SCROLL_FADE_EDGES },
    size: { component: ZardUtilsScrollFadeSizeComponent, code: UTILS_SCROLL_FADE_SIZE },
    perEdge: { component: ZardUtilsScrollFadePerEdgeComponent, code: UTILS_SCROLL_FADE_PER_EDGE },
    reveal: { component: ZardUtilsScrollFadeRevealComponent, code: UTILS_SCROLL_FADE_REVEAL },
  } as const;

  protected readonly blocks = {
    installTabs: INSTALL_TABS,
    installImport: INSTALL_IMPORT,
    usage: BLOCK_0,
    edges: BLOCK_1,
    size: BLOCK_2,
    properties: BLOCK_3,
    reveal: BLOCK_4,
    rtl: BLOCK_5,
    fallback: BLOCK_6,
  } as const;

  protected readonly classRows = CLASS_ROWS;
  protected readonly propertyRows = PROPERTY_ROWS;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'usage', label: 'Usage', type: 'custom' },
      { id: 'how-it-works', label: 'How it works', type: 'custom' },
      { id: 'edges', label: 'Edges', type: 'custom' },
      { id: 'size', label: 'Size', type: 'custom' },
      { id: 'reveal', label: 'Reveal', type: 'custom' },
      { id: 'rtl', label: 'RTL', type: 'custom' },
      { id: 'browser-support', label: 'Browser support', type: 'custom' },
      { id: 'class-reference', label: 'Class reference', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Scroll Fade',
      'Fade the edges of a scroll container, in sync with the scroll position — a pure CSS utility, with no JavaScript and no scroll listener.',
      '/docs/utils/scroll-fade',
      'og-utils.jpg',
    );
  }
}

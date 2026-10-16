import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  type Type,
} from '@angular/core';

import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChartPie,
  lucideGlobe,
  lucideMapPin,
  lucideMountain,
  lucidePencilRuler,
  lucideTruck,
} from '@ng-icons/lucide';

import { MapStateComponent } from '@doc/domain/components/map-state/map-state.component';
import { LazyRenderDirective } from '@doc/domain/directives/lazy-render.directive';
import { supportsWebGL2 } from '@doc/shared/utils/webgl';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSheetService } from '@zard/components/sheet/sheet.service';
import { mergeClasses } from '@zard/utils/merge-classes';

import { MapCodeSheetComponent, type MapCodeSheetData } from './map-code-sheet.component';
import type { MapBlock } from '../../../config/maps-registry';
import type { MapCategory } from '../../../services/maps.service';

/** The icon and caption above every block, one per category. */
const CATEGORY_CHROME: Record<MapCategory, { icon: string; label: string }> = {
  analytics: { icon: 'lucideChartPie', label: 'Analytics' },
  logistics: { icon: 'lucideTruck', label: 'Logistics' },
  data: { icon: 'lucideMapPin', label: 'Data' },
  '3d': { icon: 'lucideMountain', label: '3D' },
  draw: { icon: 'lucidePencilRuler', label: 'Draw' },
};

/**
 * A gallery card: the block's title, copy and "View Code", and the block itself once the card comes on screen.
 *
 * Every block is a map, and every map is a WebGL context, so the block is loaded and created only while the card is
 * near the viewport, and destroyed again when it is far. A category never holds more than a few contexts, and
 * switching categories leaves none behind.
 */
@Component({
  selector: 'z-map-card',
  imports: [
    NgComponentOutlet,
    CopyButtonComponent,
    NgIcon,
    ZardButtonComponent,
    ZardSeparatorComponent,
    LazyRenderDirective,
    MapStateComponent,
  ],
  template: `
    @let item = block();
    @let chrome = categoryChrome();
    <div class="group relative flex h-full flex-col" [attr.data-block]="item.id">
      <div class="relative z-20 flex items-center gap-2 px-3 py-2.5">
        <div class="text-muted-foreground flex items-center gap-1.5 pl-1 text-[13px]">
          <ng-icon [name]="chrome.icon" class="h-[0.9rem] w-[0.9rem]" aria-hidden="true" />
          {{ item.title }}
        </div>

        <div class="ml-auto flex items-center gap-2">
          <z-copy-button
            [code]="item.codeData.code"
            class="text-foreground hover:bg-muted focus-visible:ring-ring flex h-6 w-6 cursor-pointer items-center justify-center rounded-[6px] bg-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none [&_img]:size-3"
          />
          <z-separator zOrientation="vertical" class="mx-0 hidden h-4! self-center! md:flex" />
          <button z-button zType="outline" zSize="sm" type="button" (click)="viewCode()">View Code</button>
        </div>
      </div>

      <div lazyRender lazyRenderMargin="400px 0px" [class]="frameClasses()" [style.min-height]="reserved()">
        @if (!visible()) {
          <z-map-state class="flex-1" />
        } @else if (!supported) {
          <z-map-state class="flex-1" state="unsupported" />
        } @else if (component(); as blockType) {
          <ng-container *ngComponentOutlet="blockType" />
        } @else {
          <z-map-state class="flex-1" />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({ lucideChartPie, lucideGlobe, lucideMapPin, lucideMountain, lucidePencilRuler, lucideTruck }),
  ],
})
export class MapCardComponent {
  private readonly sheetService = inject(ZardSheetService);
  private readonly lazy = viewChild.required(LazyRenderDirective);

  readonly block = input.required<MapBlock>();

  protected readonly categoryChrome = computed(() => CATEGORY_CHROME[this.block().category]);
  protected readonly component = signal<Type<unknown> | null>(null);
  protected readonly visible = computed(() => this.lazy().visible());
  protected readonly reserved = computed(() =>
    this.lazy().reservedHeight() ? `${this.lazy().reservedHeight()}px` : null,
  );

  /** Probed in the browser; on the server it answers yes, and no block is created there anyway. */
  protected readonly supported = supportsWebGL2();

  /** The placeholder holds the card open until the block is there, then the block sets its own height. */
  protected readonly frameClasses = computed(() =>
    mergeClasses(
      'flex flex-1 flex-col [&>*:not(z-map-state)]:block [&>*:not(z-map-state)]:w-full',
      !(this.visible() && this.component()) && this.block().placeholderClass,
    ),
  );

  constructor() {
    // The block's code is fetched the first time the card comes on screen, and kept: coming back is instant.
    effect(() => {
      if (!this.visible() || this.component() || !this.supported) {
        return;
      }

      this.block()
        .load()
        .then(component => this.component.set(component));
    });
  }

  protected viewCode(): void {
    const item = this.block();
    // A drawer up from the bottom on a phone, a panel in from the side on a desktop.
    const narrow = typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(max-width: 768px)').matches;

    this.sheetService.create<MapCodeSheetComponent, MapCodeSheetData>({
      zTitle: `${this.categoryChrome().label} — ${item.title}`,
      zDescription: 'Copy and paste the following code into your project.',
      zContent: MapCodeSheetComponent,
      zData: { codeData: item.codeData, fileName: `block-${item.id}.ts` },
      zSide: narrow ? 'bottom' : 'right',
      zSize: 'custom',
      ...(narrow ? { zHeight: '88vh' } : { zWidth: 'min(52rem, 92vw)' }),
      zHideFooter: true,
    });
  }
}

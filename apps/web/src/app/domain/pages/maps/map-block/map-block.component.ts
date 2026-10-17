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
import { lucideMap } from '@ng-icons/lucide';

import { MapStateComponent } from '@doc/domain/components/map-state/map-state.component';
import { LazyRenderDirective } from '@doc/domain/directives/lazy-render.directive';
import { supportsWebGL2 } from '@doc/shared/utils/webgl';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSheetService } from '@zard/components/sheet/sheet.service';
import { mergeClasses } from '@zard/utils/merge-classes';

import type { MapBlock } from '../../../config/maps-registry';
import { ChartCodeSheetComponent, type ChartCodeSheetData } from '../../charts/chart-card/chart-code-sheet.component';

/**
 * One block of the gallery, laid out like a chart card: the block's name, copy and "View Code" over a frame where
 * the map fills the frame and the UI floats over it. Blocks are full width, one per row.
 *
 * Every block is a map, and every map is a WebGL context. The block is loaded the first time it comes near the
 * viewport and then stays: a map that disappears when you scroll away and comes back empty looks broken. The page
 * is the unit that is bounded (one category), so leaving it destroys them all and no context outlives it.
 */
@Component({
  selector: 'z-map-block',
  imports: [
    NgComponentOutlet,
    NgIcon,
    CopyButtonComponent,
    LazyRenderDirective,
    MapStateComponent,
    ZardButtonComponent,
    ZardSeparatorComponent,
  ],
  template: `
    @let item = block();
    <div class="flex items-center gap-2 px-3 py-2.5">
      <h2 class="text-muted-foreground flex items-center gap-1.5 pl-1 text-[13px] font-normal">
        <ng-icon name="lucideMap" class="h-[0.9rem] w-[0.9rem]" aria-hidden="true" />
        {{ item.title }}
      </h2>

      <div class="ml-auto flex items-center gap-2">
        <z-copy-button
          [code]="item.codeData.code"
          class="text-foreground hover:bg-muted focus-visible:ring-ring flex h-6 w-6 cursor-pointer items-center justify-center rounded-[6px] bg-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none [&_img]:size-3"
        />
        <z-separator zOrientation="vertical" class="mx-0 hidden h-4! self-center! md:flex" />
        <button z-button zType="outline" zSize="sm" type="button" (click)="viewCode()">View Code</button>
      </div>
    </div>

    <div lazyRender lazyRenderKeep lazyRenderMargin="600px 0px" data-slot="map-block-frame" [class]="frameClasses()">
      @if (!visible()) {
        <z-map-state class="absolute inset-0 rounded-none border-0" />
      } @else if (!supported) {
        <z-map-state class="absolute inset-0 rounded-none border-0" state="unsupported" />
      } @else if (component(); as blockType) {
        <ng-container *ngComponentOutlet="blockType" />
      } @else {
        <z-map-state class="absolute inset-0 rounded-none border-0" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMap })],
  host: {
    class: 'block',
    '[attr.id]': 'block().id',
    '[attr.data-block]': 'block().id',
  },
})
export class MapBlockComponent {
  private readonly sheetService = inject(ZardSheetService);
  private readonly lazy = viewChild(LazyRenderDirective);

  readonly block = input.required<MapBlock>();

  protected readonly component = signal<Type<unknown> | null>(null);
  protected readonly visible = computed(() => this.lazy()?.visible() ?? false);

  /** Probed in the browser; on the server it answers yes, and no block is created there anyway. */
  protected readonly supported = supportsWebGL2();

  /** A fixed height, so the frame holds its place before the map is there and nothing moves while tiles load. */
  protected readonly frameClasses = computed(() =>
    mergeClasses('bg-background relative w-full overflow-hidden rounded-xl border', this.block().frameClass),
  );

  constructor() {
    // The block's code is fetched the first time it comes on screen, and kept.
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
    const block = this.block();
    // A drawer up from the bottom on a phone, a panel in from the side on a desktop.
    const narrow = typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(max-width: 768px)').matches;

    this.sheetService.create<ChartCodeSheetComponent, ChartCodeSheetData>({
      zTitle: block.title,
      zDescription: block.description,
      zContent: ChartCodeSheetComponent,
      zData: { codeData: block.codeData, fileName: `block-${block.id}.ts` },
      zSide: narrow ? 'bottom' : 'right',
      zSize: 'custom',
      ...(narrow ? { zHeight: '88vh' } : { zWidth: 'min(46rem, 92vw)' }),
      zHideFooter: true,
    });
  }
}

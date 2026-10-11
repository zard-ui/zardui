import { isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import type { Block } from '@doc/domain/components/block-container/block-container.component';
import { COMPONENTS_REGISTRY, type ExampleData } from '@doc/shared/constants/components.constant';

import { ZardDarkMode } from '@zard/services/dark-mode';

import { CanvasOneComponent } from '../canvas/canvas-01.component';
import { CanvasTwoComponent } from '../canvas/canvas-02.component';
import { shortcutAction } from '../lib/create-shortcuts';
import { parseCreateParams } from '../lib/create-url';
import {
  BLOCK_ITEM_PREFIX,
  COMPONENT_ITEM_PREFIX,
  CREATE_CHANNEL,
  isCreateMessage,
  type FromPreviewMessage,
} from '../lib/create.protocol';
import { DesignApplier } from '../lib/design-applier';
import { PreviewDesignContext } from '../lib/preview-design.context';

interface DemoExample {
  readonly name: string;
  readonly component: NonNullable<ExampleData['component']>;
}

/**
 * The document the `/create` page loads in its iframe: one canvas, one component's demos or one block, with the
 * design applied from outside.
 *
 * It is a bare route (no header, no footer). It reads the initial design from its own query string so the very
 * first paint is right, then follows `design` messages from the host without ever reloading.
 */
@Component({
  selector: 'z-create-preview-page',
  imports: [NgComponentOutlet, CanvasOneComponent, CanvasTwoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../create-fonts.css',
  host: { '(click)': 'swallowAnchorNavigation($event)' },
  template: `
    <main class="bg-muted dark:bg-muted/30 text-foreground min-h-svh overflow-auto" [attr.data-item]="item()">
      @switch (kind()) {
        @case ('canvas-1') {
          <z-create-canvas-01 />
        }
        @case ('canvas-2') {
          <z-create-canvas-02 />
        }
        @case ('component') {
          <div class="mx-auto flex max-w-3xl flex-col gap-10 p-8">
            @for (example of examples(); track example.name) {
              <section class="flex flex-col gap-3">
                <h2 class="text-muted-foreground text-sm font-medium capitalize">{{ example.name }}</h2>
                <div
                  class="bg-background ring-foreground/10 flex min-h-40 items-center justify-center rounded-xl p-8 ring-1"
                >
                  <ng-container *ngComponentOutlet="example.component" />
                </div>
              </section>
            }
          </div>
        }
        @case ('block') {
          @if (block(); as b) {
            <div class="bg-background min-h-svh">
              <ng-container *ngComponentOutlet="b.component" />
            </div>
          }
        }
      }
    </main>
  `,
})
export class CreatePreviewPage {
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly context = inject(PreviewDesignContext);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly darkMode = inject(ZardDarkMode);

  protected readonly item = toSignal(this.route.paramMap.pipe(map(params => params.get('item') ?? 'preview-01')), {
    initialValue: 'preview-01',
  });

  protected readonly kind = computed(() => {
    const item = this.item();
    if (item === 'preview-02') return 'canvas-2';
    if (item.startsWith(COMPONENT_ITEM_PREFIX)) return 'component';
    if (item.startsWith(BLOCK_ITEM_PREFIX)) return 'block';
    return 'canvas-1';
  });

  protected readonly block = signal<Block | undefined>(undefined);

  protected readonly examples = signal<readonly DemoExample[]>([]);

  private applier: DesignApplier | null = null;

  constructor() {
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });

    // Component items load their demos on demand; the registry only holds loaders.
    effect(() => {
      const item = this.item();
      if (item.startsWith(COMPONENT_ITEM_PREFIX)) void this.loadExamples(item.slice(COMPONENT_ITEM_PREFIX.length));
      if (item.startsWith(BLOCK_ITEM_PREFIX)) void this.loadBlock(item.slice(BLOCK_ITEM_PREFIX.length));
    });

    if (!this.isBrowser) return;

    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;

      const applier = new DesignApplier(this.document);
      this.applier = applier;

      const initial = parseCreateParams({
        keys: Array.from(new URLSearchParams(view.location.search).keys()),
        get: name => new URLSearchParams(view.location.search).get(name),
      });
      this.context.design.set(initial.design);
      applier.apply(initial.design, this.darkMode.themeMode() === 'dark');

      const onMessage = (event: MessageEvent): void => {
        if (event.origin !== view.location.origin || event.source !== view.parent) return;
        if (!isCreateMessage(event.data) || event.data.type !== 'design') return;

        this.context.design.set(event.data.design);
        applier.apply(event.data.design, event.data.dark);
      };

      const onKeydown = (event: KeyboardEvent): void => {
        const action = shortcutAction(event);
        if (!action || view.parent === view) return;

        event.preventDefault();
        const message: FromPreviewMessage = { channel: CREATE_CHANNEL, type: 'action', action };
        view.parent.postMessage(message, view.location.origin);
      };

      view.addEventListener('message', onMessage);
      this.document.addEventListener('keydown', onKeydown);
      this.destroyRef.onDestroy(() => {
        view.removeEventListener('message', onMessage);
        this.document.removeEventListener('keydown', onKeydown);
        applier.destroy();
      });

      if (view.parent !== view) {
        const ready: FromPreviewMessage = { channel: CREATE_CHANNEL, type: 'ready' };
        view.parent.postMessage(ready, view.location.origin);
      }
    });
  }

  /** The blocks' registry carries every block's code, so it is only fetched when a block is asked for. */
  private async loadBlock(id: string): Promise<void> {
    const { BlocksService } = await import('@doc/domain/services/blocks.service');
    this.block.set(
      this.injector
        .get(BlocksService)
        .getAllBlocks()
        .find(block => block.id === id),
    );
  }

  private async loadExamples(name: string): Promise<void> {
    const data = await COMPONENTS_REGISTRY.find(entry => entry.componentName === name)?.loadData();
    if (!data) return;

    const all = [...(data.preview ? [data.preview] : []), ...data.examples];
    this.examples.set(all.filter((example): example is DemoExample => Boolean(example.component)));
  }

  /** Blocks and demos ship placeholder `href="#"` links; a click would navigate the preview away. */
  protected swallowAnchorNavigation(event: MouseEvent): void {
    if ((event.target as Element | null)?.closest('a')) event.preventDefault();
  }
}

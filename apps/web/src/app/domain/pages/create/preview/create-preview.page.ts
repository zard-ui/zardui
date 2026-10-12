import { isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
  type Type,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import type { Block } from '@doc/domain/components/block-container/block-container.component';

import { ZardDarkMode } from '@zard/services/dark-mode';

import { CanvasOneComponent } from '../canvas/canvas-01.component';
import { CanvasTwoComponent } from '../canvas/canvas-02.component';
import { CREATE_EXAMPLES } from '../lib/create-examples';
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

/** What is on screen. It only changes once the next item's examples or block have loaded, so a switch never blanks. */
type Shown =
  | { readonly kind: 'canvas-1' | 'canvas-2'; readonly item: string }
  | { readonly kind: 'component'; readonly item: string; readonly component: Type<unknown> }
  | { readonly kind: 'block'; readonly item: string; readonly block: Block };

/** The document's own scroll is off: `main` is the one scroll container, on both axes. */
const PREVIEW_DOCUMENT_CLASS = 'create-preview-document';

/**
 * The document the `/create` page loads in its iframe: one canvas, one component's examples or one block, with the
 * design applied from outside.
 *
 * It is a bare route (no header, no footer). It reads the initial design from its own query string so the very
 * first paint is right, then follows `design` and `item` messages from the host without ever reloading.
 */
@Component({
  selector: 'z-create-preview-page',
  imports: [NgComponentOutlet, CanvasOneComponent, CanvasTwoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../create-fonts.css',
  host: { '(click)': 'swallowAnchorNavigation($event)' },
  template: `
    <main
      #scroller
      class="bg-background text-foreground h-svh overflow-auto overscroll-none"
      [attr.data-item]="shown()?.item"
    >
      <!-- A canvas stays mounted once seen: switching back is a toggle, not a rebuild of hundreds of components. -->
      <!-- An idle canvas is skipped with content-visibility, which keeps its rendering state: showing it again does not
           restyle and relayout thousands of nodes or resize every chart, as display: none would. -->
      @if (mounted().has('canvas-1')) {
        <z-create-canvas-01
          class="block"
          [class]="shown()?.kind === 'canvas-1' ? '' : idleCanvasClass"
          [inert]="shown()?.kind !== 'canvas-1'"
        />
      }
      @if (mounted().has('canvas-2')) {
        <z-create-canvas-02
          class="block"
          [class]="shown()?.kind === 'canvas-2' ? '' : idleCanvasClass"
          [inert]="shown()?.kind !== 'canvas-2'"
        />
      }
      @switch (shown()?.kind) {
        @case ('component') {
          @if (example(); as component) {
            <ng-container *ngComponentOutlet="component" />
          }
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
  private readonly router = inject(Router);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  protected readonly item = toSignal(this.route.paramMap.pipe(map(params => params.get('item') ?? 'preview-01')), {
    initialValue: 'preview-01',
  });

  protected readonly idleCanvasClass = '[content-visibility:hidden]';
  protected readonly shown = signal<Shown | null>(null);
  protected readonly mounted = signal<ReadonlySet<Shown['kind']>>(new Set());

  protected readonly example = computed(() => {
    const shown = this.shown();
    return shown?.kind === 'component' ? shown.component : undefined;
  });

  protected readonly block = computed(() => {
    const shown = this.shown();
    return shown?.kind === 'block' ? shown.block : undefined;
  });

  private applier: DesignApplier | null = null;

  constructor() {
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });

    // Component and block items load on demand; the registry only holds loaders.
    effect(() => void this.show(this.item()));

    if (!this.isBrowser) return;

    this.document.documentElement.classList.add(PREVIEW_DOCUMENT_CLASS);
    this.destroyRef.onDestroy(() => this.document.documentElement.classList.remove(PREVIEW_DOCUMENT_CLASS));

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
        if (!isCreateMessage(event.data)) return;

        if (event.data.type === 'item') {
          // In place: the same document, so nothing boots again. Replacing keeps the host's history clean.
          void this.router.navigate(['/create/preview', event.data.item], {
            queryParamsHandling: 'preserve',
            replaceUrl: true,
          });
        } else if (event.data.type === 'design') {
          this.context.design.set(event.data.design);
          applier.apply(event.data.design, event.data.dark);
        }
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

  /** Loads what `item` needs, then swaps it in at once and starts it from the top-left corner. */
  private async show(item: string): Promise<void> {
    const next = await this.resolve(item);
    // A newer item was asked for while this one loaded.
    if (!next || this.item() !== item) return;

    this.shown.set(next);
    this.mount(next.kind);
    if (!this.isBrowser) return;

    this.scroller()?.nativeElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Each canvas takes seconds to build. The other one is built while the page is idle, so 01/02 is only a toggle.
    if (next.kind === 'canvas-1' || next.kind === 'canvas-2') {
      this.whenIdle(() => this.mount(next.kind === 'canvas-1' ? 'canvas-2' : 'canvas-1'));
    }
  }

  private mount(kind: Shown['kind']): void {
    if (!this.mounted().has(kind)) this.mounted.update(kinds => new Set([...kinds, kind]));
  }

  private whenIdle(callback: () => void): void {
    const view = this.document.defaultView;
    if (!view) return;
    if (typeof view.requestIdleCallback === 'function') view.requestIdleCallback(callback, { timeout: 4000 });
    else view.setTimeout(callback, 1500);
  }

  private async resolve(item: string): Promise<Shown | null> {
    if (item === 'preview-02') return { kind: 'canvas-2', item };

    if (item.startsWith(COMPONENT_ITEM_PREFIX)) {
      const name = item.slice(COMPONENT_ITEM_PREFIX.length);
      const component = await CREATE_EXAMPLES.find(example => example.name === name)?.load();
      return component ? { kind: 'component', item, component } : null;
    }

    if (item.startsWith(BLOCK_ITEM_PREFIX)) {
      // The blocks' registry carries every block's code, so it is only fetched when a block is asked for.
      const id = item.slice(BLOCK_ITEM_PREFIX.length);
      const { BlocksService } = await import('@doc/domain/services/blocks.service');
      const block = this.injector
        .get(BlocksService)
        .getAllBlocks()
        .find(candidate => candidate.id === id);
      return block ? { kind: 'block', item, block } : null;
    }

    return { kind: 'canvas-1', item };
  }

  /** Blocks and demos ship placeholder `href="#"` links; a click would navigate the preview away. */
  protected swallowAnchorNavigation(event: MouseEvent): void {
    if ((event.target as Element | null)?.closest('a')) event.preventDefault();
  }
}

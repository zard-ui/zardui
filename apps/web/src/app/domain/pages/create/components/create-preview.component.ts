import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

import { serializeCreateParams } from '../lib/create-url';
import { CREATE_CHANNEL, isCanvasItem, isCreateMessage, type DesignMessage } from '../lib/create.protocol';
import { CreateStateService } from '../services/create-state.service';

const SWITCHER = [
  { label: '01', item: 'preview-01' },
  { label: '02', item: 'preview-02' },
] as const;

/**
 * The preview: an iframe on the bare `/create/preview/:item` route.
 *
 * The iframe only reloads when the item changes. Everything else — the committed design, a hover preview, the
 * light/dark mode — is a `design` message, so scroll position and open overlays inside the iframe survive every
 * change. The source is computed from the item alone; the design it carries is only the one the page opened with.
 */
@Component({
  selector: 'z-create-preview',
  imports: [ZardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'relative flex min-h-0 min-w-0 flex-1 flex-col justify-center overflow-hidden rounded-2xl ring ring-foreground/10 md:ring-muted',
  },
  template: `
    <div class="relative z-0 mx-auto flex w-full flex-1 flex-col overflow-hidden">
      <div class="bg-muted dark:bg-muted/30 absolute inset-0"></div>
      @if (src(); as src) {
        <iframe
          #frame
          class="z-10 size-full flex-1"
          title="Preview"
          [src]="src"
          [attr.data-item]="state.item()"
          (load)="onLoad()"
        ></iframe>
      }
      @if (!loaded()) {
        <z-skeleton class="absolute inset-0 z-20 rounded-none" data-testid="preview-skeleton" />
      }
    </div>

    @if (isCanvas()) {
      <div
        class="dark bg-card/90 absolute right-3 bottom-3 z-30 flex items-center gap-1 rounded-xl p-1 shadow-xl backdrop-blur-xl"
        role="group"
        aria-label="Canvas"
      >
        @for (entry of switcher; track entry.item) {
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground h-7 min-w-8 cursor-pointer rounded-lg px-2.5 text-xs font-medium transition-colors"
            [attr.data-active]="state.item() === entry.item"
            [attr.aria-pressed]="state.item() === entry.item"
            (click)="state.setItem(entry.item)"
          >
            {{ entry.label }}
          </button>
        }
      </div>
    }
  `,
})
export class CreatePreviewComponent {
  protected readonly state = inject(CreateStateService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  protected readonly switcher = SWITCHER;
  protected readonly isCanvas = computed(() => isCanvasItem(this.state.item()));
  protected readonly loaded = signal(false);

  private ready = false;
  private lastSent = '';

  /**
   * The iframe's address. It reads the design without tracking it: a new design must not become a new `src`, because
   * that is a reload. Only the item is a dependency.
   */
  protected readonly src = computed<SafeResourceUrl | null>(() => {
    const item = this.state.item();
    const design = untracked(() => this.state.design());

    const query = new URLSearchParams(serializeCreateParams(design, item));
    query.delete('item');
    const path = `/create/preview/${encodeURIComponent(item)}?${query.toString()}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  });

  constructor() {
    // A new item is a new document: it has not loaded, has not announced itself and has received nothing.
    effect(() => {
      this.state.item();
      untracked(() => {
        this.loaded.set(false);
        this.ready = false;
        this.lastSent = '';
      });
    });

    if (!this.isBrowser) return;

    const view = this.document.defaultView;
    const onMessage = (event: MessageEvent): void => {
      const frame = this.frame()?.nativeElement.contentWindow;
      if (!view || !frame || event.origin !== view.location.origin || event.source !== frame) return;
      if (!isCreateMessage(event.data)) return;

      if (event.data.type === 'ready') {
        this.ready = true;
        this.lastSent = '';
        this.send();
      } else if (event.data.type === 'action') {
        this.state.run(event.data.action);
      }
    };

    view?.addEventListener('message', onMessage);
    inject(DestroyRef).onDestroy(() => view?.removeEventListener('message', onMessage));

    // Every committed change, hover preview and mode switch lands here.
    effect(() => {
      this.state.effectiveDesign();
      this.state.dark();
      this.send();
    });
  }

  protected onLoad(): void {
    this.loaded.set(true);
    // The iframe's app announces itself with `ready`; sending on `load` too covers a ready that came too early.
    this.send();
  }

  private send(): void {
    const frame = this.frame()?.nativeElement.contentWindow;
    const view = this.document.defaultView;
    if (!frame || !view || !this.ready) return;

    const message: DesignMessage = {
      channel: CREATE_CHANNEL,
      type: 'design',
      design: this.state.effectiveDesign(),
      dark: this.state.dark(),
    };

    const key = JSON.stringify(message);
    if (key === this.lastSent) return;

    this.lastSent = key;
    frame.postMessage(message, view.location.origin);
  }
}

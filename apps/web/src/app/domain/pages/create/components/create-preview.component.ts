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
import {
  CREATE_CHANNEL,
  isCanvasItem,
  isCreateMessage,
  type DesignMessage,
  type ItemMessage,
} from '../lib/create.protocol';
import { CreateStateService } from '../services/create-state.service';

const SWITCHER = [
  { label: '01', item: 'preview-01' },
  { label: '02', item: 'preview-02' },
] as const;

/**
 * The preview: an iframe on the bare `/create/preview/:item` route.
 *
 * The iframe loads once. A new design or light/dark mode is a `design` message and a new item an `item` message the
 * preview routes to in place, so switching never pays for booting the app again. The source is only the item and
 * design the page opened with.
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
        <iframe #frame class="z-10 size-full flex-1" title="Preview" [src]="src" (load)="onLoad()"></iframe>
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
  private lastItem = '';

  /**
   * The iframe's address, read once: a new `src` is a reload, so neither the design nor the item is tracked. Later
   * changes reach the iframe as messages.
   */
  protected readonly src = computed<SafeResourceUrl | null>(() =>
    untracked(() => {
      const item = this.state.item();
      const query = new URLSearchParams(serializeCreateParams(this.state.design(), item));
      query.delete('item');
      this.lastItem = item;
      const path = `/create/preview/${encodeURIComponent(item)}?${query.toString()}`;

      return this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }),
  );

  constructor() {
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
        this.sendItem();
      } else if (event.data.type === 'action') {
        this.state.run(event.data.action);
      }
    };

    view?.addEventListener('message', onMessage);
    inject(DestroyRef).onDestroy(() => view?.removeEventListener('message', onMessage));

    // Every committed change and mode switch lands here.
    effect(() => {
      this.state.design();
      this.state.dark();
      this.send();
    });

    effect(() => {
      this.state.item();
      this.sendItem();
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
      design: this.state.design(),
      dark: this.state.dark(),
    };

    const key = JSON.stringify(message);
    if (key === this.lastSent) return;

    this.lastSent = key;
    frame.postMessage(message, view.location.origin);
  }

  private sendItem(): void {
    const frame = this.frame()?.nativeElement.contentWindow;
    const view = this.document.defaultView;
    const item = this.state.item();
    if (!frame || !view || !this.ready || item === this.lastItem) return;

    this.lastItem = item;
    const message: ItemMessage = { channel: CREATE_CHANNEL, type: 'item', item };
    frame.postMessage(message, view.location.origin);
  }
}

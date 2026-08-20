import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ZardResizableHandleComponent } from '@zard/components/resizable/resizable-handle.component';
import { ZardResizablePanelComponent } from '@zard/components/resizable/resizable-panel.component';
import { ZardResizableComponent } from '@zard/components/resizable/resizable.component';
import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import type { Block, BlockViewportSize } from '../block-container/block-container.component';

@Component({
  selector: 'z-block-preview',
  standalone: true,
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  templateUrl: './block-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockPreviewComponent {
  readonly block = input.required<Block>();
  /** Width of the preview panel as a percentage, driven by the toolbar's viewport toggle. */
  readonly viewportSize = input<BlockViewportSize>('100');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly darkModeService = inject(ZardDarkMode);

  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly iframeLoaded = signal(false);

  /**
   * True while the handle is being dragged. The iframe swallows the mouse events of its own
   * document, so without turning its pointer events off the drag dies the moment the cursor crosses
   * back over the preview.
   */
  protected readonly resizing = signal(false);

  /** Bumped by `reload()`; part of the iframe URL so a refresh forces a fresh document. */
  private readonly reloadToken = signal(0);

  protected readonly iframeUrl = computed(() => {
    const token = this.reloadToken();
    const url = token === 0 ? `/blocks/preview/${this.block().id}` : `/blocks/preview/${this.block().id}?r=${token}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  protected readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('previewIframe');
  private readonly resizable = viewChild(ZardResizableComponent);

  constructor() {
    effect(() => {
      const size = Number(this.viewportSize());
      const resizable = this.resizable();
      if (!resizable) {
        return;
      }

      // `untracked`: `updatePanelStyles()` reads `panelSizes`, and tracking that read would make
      // every drag re-run this effect and snap the panel back to the toolbar's viewport size.
      untracked(() => {
        resizable.panelSizes.set([size, 100 - size]);
        resizable.updatePanelStyles();
      });
    });

    if (this.isBrowser) {
      effect(() => {
        const isDark = this.darkModeService.themeMode() === EDarkModes.DARK;
        const iframeEl = this.iframe()?.nativeElement;
        if (iframeEl?.contentDocument) {
          const html = iframeEl.contentDocument.documentElement;
          html.classList.toggle('dark', isDark);
          html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
      });
    }
  }

  /** Reloads the previewed block, the way shadcn's refresh button does. */
  reload(): void {
    this.iframeLoaded.set(false);
    this.reloadToken.update(token => token + 1);
  }

  protected onIframeLoad(): void {
    const iframeEl = this.iframe()?.nativeElement;
    if (!iframeEl?.contentDocument) return;

    const isDark = this.darkModeService.themeMode() === EDarkModes.DARK;
    const html = iframeEl.contentDocument.documentElement;
    html.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    this.iframeLoaded.set(true);
  }
}

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
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import type { Block } from '../block-container/block-container.component';

@Component({
  selector: 'z-block-preview',
  standalone: true,
  templateUrl: './block-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockPreviewComponent {
  readonly block = input.required<Block>();
  readonly viewportSize = input<'desktop' | 'tablet' | 'mobile'>('desktop');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly darkModeService = inject(ZardDarkMode);

  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly iframeUrl = computed(() => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`/blocks/preview/${this.block().id}`);
  });

  protected readonly viewportWidth = computed(() => {
    switch (this.viewportSize()) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  });

  protected readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('previewIframe');

  constructor() {
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

  protected onIframeLoad(): void {
    const iframeEl = this.iframe()?.nativeElement;
    if (!iframeEl?.contentDocument) return;

    const isDark = this.darkModeService.themeMode() === EDarkModes.DARK;
    const html = iframeEl.contentDocument.documentElement;
    html.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}

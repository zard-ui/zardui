import { isPlatformBrowser, Location, TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, DOCUMENT, inject, input, PLATFORM_ID } from '@angular/core';

import { getHeaderOffset } from '@doc/domain/directives/scroll-spy.directive';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';

export interface NavigationItem {
  id: string;
  label: string;
  type?: 'core' | 'custom';
  children?: NavigationItem[];
}

export interface NavigationConfig {
  items: NavigationItem[];
}

@Component({
  selector: 'z-dynamic-anchor',
  imports: [TitleCasePipe, HyphenToSpacePipe],
  templateUrl: './dynamic-anchor.component.html',
})
export class DynamicAnchorComponent {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  activeAnchor = input<string | undefined>();
  navigation = input<NavigationConfig>({ items: [] });
  onAnchorClick = input<((anchorId: string) => void | Promise<void>) | null>(null);

  async scrollToAnchor(anchor: string) {
    const customCallback = this.onAnchorClick();
    if (customCallback) {
      await customCallback(anchor);
      return;
    }

    const anchorElement = this.document.getElementById(anchor);

    if (anchorElement) {
      const currentPath = this.location.path().split('#')[0];
      this.location.replaceState(`${currentPath}#${anchor}`);

      const headerOffset = getHeaderOffset(this.isBrowser);
      const yScrollPosition = anchorElement.offsetTop - headerOffset;
      this.viewportScroller.scrollToPosition([0, Math.max(0, yScrollPosition)]);
    }
  }

  hasExamplesItem(): boolean {
    return this.navigation().items.some(item => item.id === 'examples');
  }
}

import { Location, TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, DOCUMENT, inject, input } from '@angular/core';

import { HeaderOffset } from '@doc/domain/directives/scroll-spy.directive';
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

      const yScrollPosition = anchorElement.offsetTop - HeaderOffset;
      this.viewportScroller.scrollToPosition([0, Math.max(HeaderOffset, yScrollPosition)]);
    }
  }

  hasExamplesItem(): boolean {
    return this.navigation().items.some(item => item.id === 'examples');
  }
}

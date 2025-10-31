import { Location, TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';

import { HyphenToSpacePipe } from '../../../shared/pipes/hyphen-to-space.pipe';

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
  private location = inject(Location);
  private viewportScroller = inject(ViewportScroller);

  activeAnchor = model<string | undefined>();
  navigation = input<NavigationConfig>({ items: [] });
  onAnchorClick = input<((anchorId: string) => void | Promise<void>) | null>(null);

  async scrollToAnchor(anchor: string) {
    const customCallback = this.onAnchorClick();
    if (customCallback) {
      await customCallback(anchor);
      return;
    }

    const anchorElement = document.getElementById(anchor);

    if (anchorElement) {
      const currentPath = this.location.path().split('#')[0];
      this.location.replaceState(`${currentPath}#${anchor}`);

      const elementTop = anchorElement.offsetTop;
      const windowHeight = window.innerHeight;
      const elementHeight = anchorElement.offsetHeight;

      const centerPosition = elementTop - windowHeight / 2 + elementHeight / 2 + 150;

      this.viewportScroller.scrollToPosition([0, Math.max(0, centerPosition)]);
    }
  }

  hasExamplesItem(): boolean {
    return this.navigation().items.some(item => item.id === 'examples');
  }
}

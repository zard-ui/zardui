import { HyphenToSpacePipe } from '@zard/shared/pipes/hyphen-to-space.pipe';
import { TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';

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

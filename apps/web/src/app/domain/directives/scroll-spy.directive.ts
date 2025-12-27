import { isPlatformBrowser } from '@angular/common';
import { contentChildren, Directive, DOCUMENT, inject, input, output, PLATFORM_ID } from '@angular/core';

import { ScrollSpyItemDirective } from './scroll-spy-item.directive';

let headerHeight = -1;
export const getHeaderOffset = (isBrowser: boolean): number => {
  // optimization assumes that header have constant height
  if (headerHeight !== -1) {
    return headerHeight;
  }

  if (isBrowser) {
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerHeight = headerElement.offsetHeight;
    }
  } else {
    headerHeight = 56;
  }

  return headerHeight;
};

@Directive({
  selector: '[scrollSpy]',
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class ScrollSpyDirective {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly scrollSpyChange = output<string>();
  readonly headerOffset = input<number>();
  readonly items = contentChildren(ScrollSpyItemDirective, { descendants: true });

  private currentSection?: string;
  private ticking = false;

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private handleScroll() {
    const scrollingElement = this.document.scrollingElement as HTMLElement;
    if (!scrollingElement) {
      return;
    }

    const scrollTop = scrollingElement.scrollTop;
    const parentOffset = scrollingElement.offsetTop;
    let offset = this.headerOffset();
    if (!offset) {
      offset = getHeaderOffset(this.isBrowser);
    }

    let currentSection: string | undefined;
    for (const item of this.items()) {
      const element = item.elementRef.nativeElement as HTMLElement;
      if (element.offsetTop - parentOffset <= scrollTop + offset) {
        currentSection = item.scrollSpyItem();
      }
    }

    if (currentSection && currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.scrollSpyChange.emit(currentSection);
    }
  }
}

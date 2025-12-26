import { contentChildren, Directive, output } from '@angular/core';

import { ScrollSpyItemDirective } from './scroll-spy-item.directive';

export const HeaderOffset = 56;

@Directive({
  selector: '[scrollSpy]',
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class ScrollSpyDirective {
  readonly scrollSpyChange = output<string>();
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
    const scrollingElement = document.scrollingElement as HTMLElement;
    if (!scrollingElement) {
      return;
    }

    const scrollTop = scrollingElement.scrollTop;
    const parentOffset = scrollingElement.offsetTop;

    let currentSection: string | undefined;
    for (const item of this.items()) {
      const element = item.elementRef.nativeElement as HTMLElement;
      if (element.offsetTop - parentOffset <= scrollTop + HeaderOffset) {
        currentSection = item.scrollSpyItem();
      }
    }

    if (currentSection && currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.scrollSpyChange.emit(currentSection);
    }
  }
}

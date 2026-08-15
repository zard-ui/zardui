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

interface SectionPosition {
  id: string | undefined;
  top: number;
}

@Directive({
  selector: '[scrollSpy]',
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:resize)': 'invalidatePositions()',
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
  private positions?: SectionPosition[];
  private positionsScrollHeight = -1;

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  /** Drops the cached offsets so the next scroll frame measures the page again. */
  invalidatePositions() {
    this.positions = undefined;
  }

  /**
   * Section offsets, measured once and reused across scroll frames. Reading
   * `offsetTop` for every item on every frame is one layout read per section,
   * and pages like the changelog gain a section every month — so measure only
   * when the page actually changed, which its total scroll height reveals.
   */
  private sectionPositions(scrollingElement: HTMLElement): SectionPosition[] {
    const items = this.items();
    const scrollHeight = scrollingElement.scrollHeight;

    if (this.positions && this.positions.length === items.length && this.positionsScrollHeight === scrollHeight) {
      return this.positions;
    }

    const parentOffset = scrollingElement.offsetTop;
    this.positions = items.map(item => ({
      id: item.scrollSpyItem(),
      top: (item.elementRef.nativeElement as HTMLElement).offsetTop - parentOffset,
    }));
    this.positionsScrollHeight = scrollHeight;

    return this.positions;
  }

  private handleScroll() {
    const scrollingElement = this.document.scrollingElement as HTMLElement;
    if (!scrollingElement) {
      return;
    }

    const scrollTop = scrollingElement.scrollTop;
    let offset = this.headerOffset();
    if (!offset) {
      offset = getHeaderOffset(this.isBrowser);
    }

    let currentSection: string | undefined;
    for (const position of this.sectionPositions(scrollingElement)) {
      if (position.top <= scrollTop + offset) {
        currentSection = position.id;
      }
    }

    if (currentSection && currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.scrollSpyChange.emit(currentSection);
    }
  }
}

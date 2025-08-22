import { contentChildren, Directive, EventEmitter, HostListener, Output } from '@angular/core';

import { ScrollSpyItemDirective } from './scroll-spy-item.directive';

@Directive({
  selector: '[scrollSpy]',
  standalone: true,
})
export class ScrollSpyDirective {
  @Output() public scrollSpyChange = new EventEmitter<string>();
  private currentSection?: string;

  readonly items = contentChildren(ScrollSpyItemDirective, { descendants: true });

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string | undefined;
    const scrollTop = event.target.scrollingElement.scrollTop;
    const parentOffset = event.target.scrollingElement.offsetTop;

    this.items()?.forEach(item => {
      if (item.elementRef.nativeElement.offsetTop - parentOffset <= scrollTop) {
        currentSection = item.scrollSpyItem;
      }
    });
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.scrollSpyChange.emit(this.currentSection);
    }
  }
}

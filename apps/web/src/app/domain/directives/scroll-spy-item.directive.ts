import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[scrollSpyItem]',
})
export class ScrollSpyItemDirective {
  elementRef = inject(ElementRef);

  scrollSpyItem = input<string | undefined>();
}

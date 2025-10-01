import { Directive, ElementRef, HostBinding, inject, Input } from '@angular/core';

@Directive({
  selector: '[scrollSpyItem]',
  standalone: true,
})
export class ScrollSpyItemDirective {
  @Input() @HostBinding('class.active') active = false;
  @Input() scrollSpyItem?: string;

  readonly elementRef = inject(ElementRef);
}

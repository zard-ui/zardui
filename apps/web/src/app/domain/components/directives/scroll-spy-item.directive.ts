import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[scrollSpyItem]',
  standalone: true,
})
export class ScrollSpyItemDirective {
  @Input() @HostBinding('class.active') active = false;
  @Input() scrollSpyItem?: string;

  constructor(public elementRef: ElementRef) {}
}

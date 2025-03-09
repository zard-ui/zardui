import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[z-icon]',
  exportAs: 'zIcon',
  standalone: true,
  host: {
    class: 'material-icons-outlined',
  },
})
export class ZardIconDirective implements OnInit {
  private elementRef = inject(ElementRef);

  zType = input.required<string>();

  ngOnInit(): void {
    this.elementRef.nativeElement.innerHTML = this.zType();
  }
}

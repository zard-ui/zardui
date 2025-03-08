import { Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';

const VARIANTS = {
  base: 'flex h-10 w-full rounded-md border bg-background px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:text-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  variants: {
    type: {
      default: 'border-input text-base focus-visible:ring-ring',
      primary: 'border-primary text-primary focus-visible:ring-primary',
      secondary: 'border-secondary text-secondary-foreground focus-visible:ring-secondary',
      destructive: 'border-destructive text-destructive focus-visible:ring-destructive',
    },
  },
};

export type ZardInputType = 'default' | 'primary' | 'secondary' | 'destructive';

@Directive({
  selector: 'input[z-input]',
  standalone: true,
})
export class ZardInputDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  zType = input<ZardInputType>('default');

  ngOnInit(): void {
    this.applyClasses();
  }

  private applyClasses(): void {
    const classes = [VARIANTS.base, VARIANTS.variants.type[this.zType()]].filter(Boolean).join(' ');

    this.renderer.setAttribute(this.elementRef.nativeElement, 'class', classes);
  }
}

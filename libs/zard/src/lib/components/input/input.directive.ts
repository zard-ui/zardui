import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { inputVariants, ZardInputVariants } from './input.variants';

@Directive({
  selector: 'input[z-input]',
  standalone: true,
})
export class ZardInputDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  readonly zSize = input<ZardInputVariants['zSize']>('default');
  readonly zStatus = input<ZardInputVariants['zStatus']>();
  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform });

  ngOnInit(): void {
    this.applyClasses();
  }

  private applyClasses(): void {
    const classes = mergeClasses(inputVariants({ zSize: this.zSize(), zStatus: this.zStatus(), zBorderless: this.zBorderless() }), this.class());

    this.renderer.setAttribute(this.elementRef.nativeElement, 'class', classes);
  }
}

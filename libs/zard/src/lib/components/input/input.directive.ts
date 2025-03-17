import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { inputBase, inputVariants, textAreaVariants, ZardInputVariants } from './input.variants';

@Directive({
  selector: 'input[z-input], textarea[z-input]',
  standalone: true,
})
export class ZardInputDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private readonly isTextarea = this.elementRef.nativeElement.tagName.toLowerCase() === 'textarea';
  private readonly nativeElement = this.elementRef.nativeElement;

  readonly zSize = input<ZardInputVariants['zSize']>('default');
  readonly zStatus = input<ZardInputVariants['zStatus']>();
  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform });

  ngOnInit(): void {
    this.applyClasses();
  }

  private applyClasses(): void {
    const baseClasses = this.isTextarea ? textAreaVariants() : inputBase();

    const variantClasses = inputVariants({
      zSize: this.zSize(),
      zStatus: this.zStatus(),
      zBorderless: this.zBorderless(),
    });

    const classes = mergeClasses(baseClasses, variantClasses, this.class);
    this.renderer.setAttribute(this.nativeElement, 'class', classes);
  }
}

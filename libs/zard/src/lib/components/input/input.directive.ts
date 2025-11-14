import { Directive, ElementRef, AfterViewInit, OnDestroy, inject, Renderer2, input, computed } from '@angular/core';
import { FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';

import { ClassValue } from 'clsx';
import { Subscription, fromEvent } from 'rxjs';

import { ZardInputVariants, inputVariants } from './input.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

@Directive({
  selector: 'input[z-input], textarea[z-input]',
  exportAs: 'Input',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardInputDirective implements AfterViewInit, OnDestroy {
  readonly elementRef = inject(ElementRef);
  readonly renderer = inject(Renderer2);
  readonly ngControl = inject(NgControl, { optional: true, self: true });
  readonly ngModel = inject(NgModel, { optional: true, self: true });
  readonly formControlName = inject(FormControlName, { optional: true, self: true });
  readonly formControlDirective = inject(FormControlDirective, { optional: true, self: true });

  readonly isTextarea = this.elementRef.nativeElement.tagName.toLowerCase() === 'textarea';
  private subscription = new Subscription();

  readonly zBorderless = input(false, { transform });
  readonly zSize = input<ZardInputVariants['zSize']>('default');
  readonly zStatus = input<ZardInputVariants['zStatus']>();

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(inputVariants({ zType: !this.isTextarea ? 'default' : 'textarea', zSize: this.zSize(), zStatus: this.zStatus(), zBorderless: this.zBorderless() }), this.class()),
  );

  ngAfterViewInit(): void {
    setTimeout(() => {
      const nativeElement = this.elementRef.nativeElement;

      const control = this.formControlName || this.formControlDirective || this.ngControl;

      /** Reactive Forms */
      if (control?.control) {
        this.subscription.add(control.control.valueChanges.subscribe(() => this.updateInputState()));
      }
      /** Template-driven Forms */
      if (this.ngModel?.valueChanges) {
        this.subscription.add(this.ngModel.valueChanges.subscribe(() => this.updateInputState()));
      }

      this.subscription.add(fromEvent(nativeElement, 'input').subscribe(() => this.updateInputState()));
      this.subscription.add(fromEvent(nativeElement, 'change').subscribe(() => this.updateInputState()));

      this.updateInputState();
    });
  }

  updateInputState = () => {
    const nativeElement = this.elementRef.nativeElement;
    const value = nativeElement.value;

    if (value) {
      this.renderer.addClass(nativeElement, 'input-has-value');
    } else {
      this.renderer.removeClass(nativeElement, 'input-has-value');
    }
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

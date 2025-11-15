

```angular-ts title="input.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Directive, ElementRef, AfterViewInit, OnDestroy, inject, Renderer2, input, computed } from '@angular/core';
import { FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';
import { Subscription, fromEvent } from 'rxjs';
import { ClassValue } from 'clsx';

import { ZardInputVariants, inputVariants } from './input.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';


@Directive({
  selector: 'input[z-input], textarea[z-input]',
  exportAs: 'zInput',
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

  }

  updateInputState = () => {
    const nativeElement = this.elementRef.nativeElement;
    const value = nativeElement.value;

    if (value) {
      this.renderer.addClass(nativeElement, 'input-has-value');
    } else {
      this.renderer.removeClass(nativeElement, 'input-has-value');
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-status', this.zStatus() || 'default');
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

```



```angular-ts title="input.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';


export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva('w-full', {
  variants: {
    zType: {
      default:
        'flex rounded-md border px-4 font-normal border-input bg-transparent text-base md:text-sm ring-offset-background file:border-0 file:text-foreground file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      textarea:
        'flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    },
    zSize: {
      default: 'h-10 py-2 file:max-md:py-0',
      sm: 'h-9 file:md:py-2 file:max-md:py-1.5',
      lg: 'h-11 py-1 file:md:py-3 file:max-md:py-2.5',
    },
    zStatus: {
      error: 'border-destructive focus-visible:ring-destructive',
      warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      success: 'border-green-500 focus-visible:ring-green-500',
    },
    zBorderless: {
      true: 'flex-1 bg-transparent border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
});

export type ZardInputVariants = VariantProps<typeof inputVariants>;

```



```angular-ts title="float.label.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Component, ElementRef, AfterViewInit, HostListener, PLATFORM_ID, ViewEncapsulation, computed, input, inject, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { floatLabelStyles } from './float.label.variants';
import { mergeClasses } from '../../shared/utils/utils';


@Component({
  selector: 'z-float-label',
  standalone: true,
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFloatLabelComponent implements AfterViewInit {
  readonly class = input<string>('');

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly classes = computed(() =>
    mergeClasses(floatLabelStyles(), this.class())
  );

  ngAfterViewInit() {
    this.updateLabelState();
  }

  @HostListener('input')
  @HostListener('focus')
  @HostListener('blur')
  onInteraction() {
    this.updateLabelState();
  }

  private updateLabelState() {
    if (!isPlatformBrowser(this.platformId)) return;

    const input: HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null =
      this.el.nativeElement.querySelector('input, textarea, button');

    if (!input) return;

    const hasValue = !!input.value;
    input.classList.toggle('input-has-value', hasValue);
  }
}

```



```angular-ts title="float.label.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva } from 'class-variance-authority';


export const floatLabelStyles = cva(
  [
    'relative block',

    // base label
    '[&>label]:absolute',
    '[&>label]:left-4',
    '[&>label]:top-1/2',
    '[&>label]:-translate-y-1/2',
    '[&>label]:pointer-events-none',
    '[&>label]:transition-all',
    '[&>label]:duration-200',
    '[&>label]:ease-in-out',
    '[&>label]:text-muted-foreground',
    '[&>label]:text-sm',
    '[&>label]:leading-none',
    '[&>label]:z-10',

    // FOCUS — when input/textarea/button inside receives focus
    '[&:has(input:focus)>label]:top-2',
    '[&:has(textarea:focus)>label]:top-2',
    '[&:has(button:focus)>label]:top-2',

    '[&:has(input:focus)>label]:text-xs',
    '[&:has(textarea:focus)>label]:text-xs',
    '[&:has(button:focus)>label]:text-xs',

    '[&:has(input:focus)>label]:text-primary',
    '[&:has(textarea:focus)>label]:text-primary',
    '[&:has(button:focus)>label]:text-primary',

    // VALUE — when input has a value
    '[&:has(input.input-has-value)>label]:top-2',
    '[&:has(textarea.input-has-value)>label]:top-2',
    '[&:has(button.input-has-value)>label]:top-2',

    '[&:has(input.input-has-value)>label]:text-xs',
    '[&:has(textarea.input-has-value)>label]:text-xs',
    '[&:has(button.input-has-value)>label]:text-xs',

    // STATES — via data-status (sem depender de border-*)
    '[&:has(input[data-status=error]:not(:disabled))>label]:text-yellow-500',
    '[&:has(textarea[data-status=error]:not(:disabled))>label]:text-yellow-500',
    '[&:has(button[data-status=error]:not(:disabled))>label]:text-yellow-500',
    '[&:has(z-select[data-status=error]:not(:disabled))>label]:text-yellow-500',

    '[&:has(input[data-status=warning]:not(:disabled))>label]:text-destructive',
    '[&:has(textarea[data-status=warning]:not(:disabled))>label]:text-destructive',
    '[&:has(button[data-status=warning]:not(:disabled))>label]:text-destructive',
    '[&:has(z-select[data-status=warning]:not(:disabled))>label]:text-destructive',

    '[&:has(input[data-status=success]:not(:disabled))>label]:text-green-500',
    '[&:has(textarea[data-status=success]:not(:disabled))>label]:text-green-500',
    '[&:has(button[data-status=success]:not(:disabled))>label]:text-green-500',
    '[&:has(z-select[data-status=success]:not(:disabled))>label]:text-green-500',
  ]
);

```


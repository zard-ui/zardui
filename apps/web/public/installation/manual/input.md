

```angular-ts title="input.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Directive, ElementRef, AfterViewInit, OnDestroy, inject, Renderer2, input, computed } from '@angular/core';
import { FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';
import { Subscription, fromEvent } from 'rxjs';
import { ClassValue } from 'clsx';

import { ZardInputVariants, inputVariants } from './input.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';


@Directive({
  selector: 'input[z-input], textarea[z-input]',
  exportAs: 'Input',
  standalone: true,
  host: {
    '[class]': 'classes()'
  }
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

  protected readonly classes = computed(() => {
    const isDisabled = this.elementRef.nativeElement.disabled;
    const status = isDisabled ? undefined : this.zStatus();

    return mergeClasses(
      inputVariants({
        zType: this.isTextarea ? 'default' : 'textarea',
        zSize: this.zSize(),
        zStatus: status,
        zBorderless: this.zBorderless()
      }),
      this.class()
    );
  });

  ngAfterViewInit(): void {
    setTimeout(() => {
      const nativeElement = this.elementRef.nativeElement;

      const control = this.formControlName || this.formControlDirective || this.ngControl;
      if (control?.control) {
        this.subscription.add(control.control.valueChanges.subscribe(() => this.updateInputState()));
      }

      if (this.ngModel?.valueChanges) {
        this.subscription.add(this.ngModel.valueChanges.subscribe(() => this.updateInputState()));
      }

      this.subscription.add(fromEvent(nativeElement, 'input').subscribe(() => this.updateInputState()));
      this.subscription.add(fromEvent(nativeElement, 'change').subscribe(() => this.updateInputState()));

      this.updateInputState();
    }, 0);
  }

  updateInputState = () => {
    const nativeElement = this.elementRef.nativeElement;
    const value = nativeElement.value;
    const hasValue = value != null && value !== '';

    if (hasValue) {
      this.renderer.addClass(nativeElement, 'input-has-value');
    } else {
      this.renderer.removeClass(nativeElement, 'input-has-value');
    }
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
        'flex rounded-md border px-4 font-normal border-input bg-transparent text-base md:text-sm file:border-0 file:text-foreground file:bg-transparent file:font-medium placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      textarea:
        'flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
import { Component, ElementRef, AfterViewInit, ViewEncapsulation, Inject, Renderer2, HostListener } from '@angular/core';


@Component({
  selector: 'zard-float-label',
  standalone: true,
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  styles: `
    zard-float-label {
      display: block;
      position: relative;
    }

    zard-float-label label {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      transition: all 0.2s ease-in-out;
      color: var(--color-muted-foreground);
      padding: 0;
      font-size: 0.875rem;
      line-height: 1;
      z-index: 1;
    }

    zard-float-label:has(input:focus) label,
    zard-float-label:has(textarea:focus) label,
    zard-float-label:has(button:focus) label,
    zard-float-label:has(input.input-has-value) label,
    zard-float-label:has(textarea.input-has-value) label,
    zard-float-label:has(button.input-has-value) label {
      top: 0.5rem;
      font-size: 0.75rem;
      color: color-mix(in oklab, var(--color-primary) 70%, var(--color-foreground));
    }

    zard-float-label:has(input.border-destructive:not(:disabled)) label,
    zard-float-label:has(textarea.border-destructive:not(:disabled)) label,
    zard-float-label:has(button.border-destructive:not(:disabled)) label {
      color: var(--color-destructive);
    }

    zard-float-label:has(input.border-warning:not(:disabled)) label,
    zard-float-label:has(textarea.border-warning:not(:disabled)) label,
    zard-float-label:has(button.border-warning:not(:disabled)) label {
      color: var(--color-yellow-500);
    }

    zard-float-label:has(input.border-success:not(:disabled)) label,
    zard-float-label:has(textarea.border-success:not(:disabled)) label,
    zard-float-label:has(button.border-success:not(:disabled)) label {
      color: var(--color-green-500);
    }
  `
})
export class ZardFloatLabelComponent implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.updateLabelState();
  }

  @HostListener('input', ['$event'])
  @HostListener('focus', ['$event'])
  @HostListener('blur', ['$event'])
  onInteraction(event: Event) {
    this.updateLabelState();
  }

  private updateLabelState() {
    const input = this.el.nativeElement.querySelector('input, textarea, button');
    if (input) {
      const hasValue = !!input.value;
      const isFocused = document.activeElement === input;
      if (hasValue || isFocused) {
        this.renderer.addClass(input, 'input-has-value');
      } else {
        this.renderer.removeClass(input, 'input-has-value');
      }
    }
  }
}

```




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

    // OPACITY 0 for placeholder text inside z-select
    '[&>z-select_span#select-placeholder]:opacity-0',
    '[&>[z-select]_span#select-placeholder]:opacity-0',
    '[&>z-select_[id="select-placeholder"]]:opacity-0',
    '[&>[z-select]_[id="select-placeholder"]]:opacity-0',

    // STATES — destructive / warning / success
    '[&:has(input.border-destructive:not(:disabled))>label]:text-destructive',
    '[&:has(textarea.border-destructive:not(:disabled))>label]:text-destructive',
    '[&:has(button.border-destructive:not(:disabled))>label]:text-destructive',

    '[&:has(input.border-warning:not(:disabled))>label]:text-yellow-500',
    '[&:has(textarea.border-warning:not(:disabled))>label]:text-yellow-500',
    '[&:has(button.border-warning:not(:disabled))>label]:text-yellow-500',

    '[&:has(input.border-success:not(:disabled))>label]:text-green-500',
    '[&:has(textarea.border-success:not(:disabled))>label]:text-green-500',
    '[&:has(button.border-success:not(:disabled))>label]:text-green-500',
  ]
);

```


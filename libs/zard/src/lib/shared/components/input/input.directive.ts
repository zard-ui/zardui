import { computed, Directive, effect, ElementRef, inject, input, linkedSignal, model } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  inputVariants,
  type ZardInputSizeVariants,
  type ZardInputStatusVariants,
  type ZardInputTypeVariants,
} from './input.variants';

import { mergeClasses, transform } from '@/shared/utils/merge-classes';

@Directive({
  selector: 'input[z-input], textarea[z-input]',
  host: {
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
  },
  exportAs: 'zInput',
})
export class ZardInputDirective {
  private readonly elementRef = inject(ElementRef);

  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform });
  readonly zSize = input<ZardInputSizeVariants>('default');
  readonly zStatus = input<ZardInputStatusVariants>();
  readonly value = model<string>('');

  readonly size = linkedSignal<ZardInputSizeVariants>(() => this.zSize());

  protected readonly classes = computed(() =>
    mergeClasses(
      inputVariants({
        zType: this.getType(),
        zSize: this.size(),
        zStatus: this.zStatus(),
        zBorderless: this.zBorderless(),
      }),
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const value = this.value();

      if (value !== undefined && value !== null) {
        this.elementRef.nativeElement.value = value;
      }
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  setDataSlot(name: string): void {
    if (this.elementRef?.nativeElement?.dataset) {
      this.elementRef.nativeElement.dataset.slot = name;
    }
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as HTMLInputElement | HTMLTextAreaElement | null;
    this.value.set(el?.value ?? '');
  }

  getType(): ZardInputTypeVariants {
    const isTextarea = this.elementRef.nativeElement.tagName.toLowerCase() === 'textarea';
    return isTextarea ? 'textarea' : 'default';
  }
}

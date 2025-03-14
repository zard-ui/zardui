import { ClassValue } from 'class-variance-authority/dist/types';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { inputVariants, ZardInputVariants } from './input.variants';

@Component({
  selector: 'z-input, input[z-input]',
  exportAs: 'zInput',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardInputComponent {
  protected elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly zSize = input<ZardInputVariants['zSize']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(inputVariants({ zSize: this.zSize() }), this.class()));
}

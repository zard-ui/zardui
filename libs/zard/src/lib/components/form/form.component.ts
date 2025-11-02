import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  formFieldVariants,
  formControlVariants,
  formLabelVariants,
  formMessageVariants,
  type ZardFormMessageVariants,
} from './form.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

@Component({
  selector: 'z-form-field, [z-form-field]',
  exportAs: 'zFormField',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormFieldComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(formFieldVariants(), this.class()));
}

@Component({
  selector: 'z-form-control, [z-form-control]',
  exportAs: 'zFormControl',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="relative">
      <ng-content></ng-content>
    </div>
    @if (errorMessage() || helpText()) {
      <div class="mt-1.5 min-h-[1.25rem]">
        @if (errorMessage()) {
          <p class="text-sm text-red-500">{{ errorMessage() }}</p>
        } @else if (helpText()) {
          <p class="text-muted-foreground text-sm">{{ helpText() }}</p>
        }
      </div>
    }
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormControlComponent {
  readonly class = input<ClassValue>('');
  readonly errorMessage = input<string>('');
  readonly helpText = input<string>('');

  protected readonly classes = computed(() => mergeClasses(formControlVariants(), this.class()));
}

@Component({
  selector: 'z-form-label, label[z-form-label]',
  exportAs: 'zFormLabel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormLabelComponent {
  readonly class = input<ClassValue>('');
  readonly zRequired = input(false, { transform });

  protected readonly classes = computed(() =>
    mergeClasses(formLabelVariants({ zRequired: this.zRequired() }), this.class()),
  );
}

@Component({
  selector: 'z-form-message, [z-form-message]',
  exportAs: 'zFormMessage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormMessageComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<ZardFormMessageVariants['zType']>('default');

  protected readonly classes = computed(() => mergeClasses(formMessageVariants({ zType: this.zType() }), this.class()));
}

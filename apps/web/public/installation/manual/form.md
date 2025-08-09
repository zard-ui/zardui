### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">form.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const formFieldVariants = cva('space-y-2');

export const formLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      zRequired: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      },
    },
  }
);

export const formControlVariants = cva('relative');

export const formMessageVariants = cva('text-sm', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      error: 'text-red-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardFormFieldVariants = VariantProps<typeof formFieldVariants>;
export type ZardFormLabelVariants = VariantProps<typeof formLabelVariants>;
export type ZardFormControlVariants = VariantProps<typeof formControlVariants>;
export type ZardFormMessageVariants = VariantProps<typeof formMessageVariants>;
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">form-control.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { formControlVariants, ZardFormControlVariants } from './form.variants';

@Component({
  selector: 'z-form-control, [z-form-control]',
  exportAs: 'zFormControl',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormControlComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(formControlVariants(), this.class())
  );
}
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">form-field.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { formFieldVariants, ZardFormFieldVariants } from './form.variants';

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

  protected readonly classes = computed(() =>
    mergeClasses(formFieldVariants(), this.class())
  );
}
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">form-label.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { formLabelVariants, ZardFormLabelVariants } from './form.variants';

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
    mergeClasses(
      formLabelVariants({ zRequired: this.zRequired() }),
      this.class()
    )
  );
}
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">form-message.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { formMessageVariants, ZardFormMessageVariants } from './form.variants';

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

  protected readonly classes = computed(() =>
    mergeClasses(
      formMessageVariants({ zType: this.zType() }),
      this.class()
    )
  );
}
```


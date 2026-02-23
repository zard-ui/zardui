

```angular-ts title="form.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  formControlVariants,
  formFieldVariants,
  formLabelVariants,
  formMessageVariants,
  type ZardFormMessageTypeVariants,
} from '@/shared/components/form/form.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-form-field, [z-form-field]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormField',
})
export class ZardFormFieldComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(formFieldVariants(), this.class()));
}

@Component({
  selector: 'z-form-control, [z-form-control]',
  imports: [],
  template: `
    <div class="relative">
      <ng-content />
    </div>
    @if (errorMessage() || helpText()) {
      <div class="mt-1.5 min-h-5">
        @if (errorMessage()) {
          <p class="text-sm text-red-500">{{ errorMessage() }}</p>
        } @else if (helpText()) {
          <p class="text-muted-foreground text-sm">{{ helpText() }}</p>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormControl',
})
export class ZardFormControlComponent {
  readonly class = input<ClassValue>('');
  readonly errorMessage = input<string>('');
  readonly helpText = input<string>('');

  protected readonly classes = computed(() => mergeClasses(formControlVariants(), this.class()));
}

@Component({
  selector: 'z-form-label, label[z-form-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormLabel',
})
export class ZardFormLabelComponent {
  readonly class = input<ClassValue>('');
  readonly zRequired = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(formLabelVariants({ zRequired: this.zRequired() }), this.class()),
  );
}

@Component({
  selector: 'z-form-message, [z-form-message]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormMessage',
})
export class ZardFormMessageComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<ZardFormMessageTypeVariants>('default');

  protected readonly classes = computed(() => mergeClasses(formMessageVariants({ zType: this.zType() }), this.class()));
}

```



```angular-ts title="form.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const formFieldVariants = cva('grid gap-2');

export const formLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      zRequired: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      },
    },
  },
);

export const formControlVariants = cva('');

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

export type ZardFormMessageTypeVariants = NonNullable<VariantProps<typeof formMessageVariants>['zType']>;

```



```angular-ts title="form.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent,
} from '@/shared/components/form/form.component';

export const ZardFormImports = [
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormControlComponent,
  ZardFormMessageComponent,
] as const;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from '@/shared/components/form/form.component';
export * from '@/shared/components/form/form.imports';
export * from '@/shared/components/form/form.variants';

```




```angular-ts title="input-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  inputGroupAddonVariants,
  inputGroupInputVariants,
  inputGroupVariants,
  type ZardInputGroupAddonAlignVariants,
  type ZardInputGroupAddonPositionVariants,
} from './input-group.variants';
import { generateId, mergeClasses } from '../../shared/utils/utils';
import {
  isTemplateRef,
  ZardStringTemplateOutletDirective,
} from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { ZardInputDirective } from '../input/input.directive';
import type { ZardInputSizeVariants } from '../input/input.variants';
import { ZardLoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'z-input-group',
  imports: [ZardStringTemplateOutletDirective, ZardLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let addonBefore = zAddonBefore();
    @if (addonBefore) {
      <div [class]="addonBeforeClasses()" [id]="addonBeforeId" [attr.aria-disabled]="zDisabled() || zLoading()">
        <ng-container *zStringTemplateOutlet="addonBefore">{{ addonBefore }}</ng-container>
      </div>
    }

    <div [class]="inputWrapperClasses()">
      <ng-content select="input[z-input], textarea[z-input]" />

      @if (zLoading()) {
        <z-loader zSize="sm" />
      }
    </div>

    @let addonAfter = zAddonAfter();
    @if (addonAfter) {
      <div [class]="addonAfterClasses()" [id]="addonAfterId" [attr.aria-disabled]="zDisabled() || zLoading()">
        <ng-container *zStringTemplateOutlet="addonAfter">{{ addonAfter }}</ng-container>
      </div>
    }
  `,
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'zDisabled() || zLoading()',
    '[attr.data-disabled]': 'zDisabled() || zLoading()',
    '[attr.aria-busy]': 'zLoading()',
    'data-slot': 'input-group',
    role: 'group',
  },
})
export class ZardInputGroupComponent {
  readonly class = input<ClassValue>('');
  readonly zAddonAfter = input<string | TemplateRef<void>>('');
  readonly zAddonAlign = input<ZardInputGroupAddonAlignVariants>('inline');
  readonly zAddonBefore = input<string | TemplateRef<void>>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zLoading = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardInputSizeVariants>('default');

  private readonly contentInput = contentChild<ZardInputDirective>(ZardInputDirective);
  private readonly uniqueId = generateId('input-group');

  protected readonly addonBeforeId = `${this.uniqueId}-addon-before`;
  protected readonly addonAfterId = `${this.uniqueId}-addon-after`;
  protected readonly isAddonBeforeTemplate = computed(() => isTemplateRef(this.zAddonBefore()));
  protected readonly classes = computed(() =>
    mergeClasses(
      'w-full',
      inputGroupVariants({
        zSize: this.zSize(),
        zDisabled: this.zDisabled() || this.zLoading(),
      }),
      this.class(),
    ),
  );

  protected readonly inputWrapperClasses = computed(() =>
    mergeClasses(
      inputGroupInputVariants({
        zSize: this.zSize(),
        zHasAddonBefore: Boolean(this.zAddonBefore()),
        zHasAddonAfter: Boolean(this.zAddonAfter()),
        zDisabled: this.zDisabled() || this.zLoading(),
      }),
      'relative',
    ),
  );

  protected readonly addonAfterClasses = computed(() => this.addonClasses('after'));
  protected readonly addonBeforeClasses = computed(() =>
    mergeClasses(this.addonClasses('before'), this.isAddonBeforeTemplate() ? 'pr-0.5' : ''),
  );

  constructor() {
    effect(() => {
      const contentInput = this.contentInput();
      const disabled = this.zDisabled();
      const size = this.zSize();

      if (size) {
        contentInput?.size.set(size);
      }
      contentInput?.disable(disabled);
      contentInput?.setDataSlot('input-group-control');
    });
  }

  private addonClasses(position: ZardInputGroupAddonPositionVariants): string {
    return mergeClasses(
      inputGroupAddonVariants({
        zAlign: this.zAddonAlign(),
        zDisabled: this.zDisabled() || this.zLoading(),
        zPosition: position,
        zSize: this.zSize(),
        zType: this.contentInput()?.getType() ?? 'default',
      }),
    );
  }
}

```



```angular-ts title="input-group.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '../../shared/utils/utils';

export const inputGroupVariants = cva(
  mergeClasses(
    'rounded-md flex px-3 items-stretch w-full',
    '[&_input[z-input]]:border-0! [&_input[z-input]]:bg-transparent! [&_input[z-input]]:outline-none!',
    '[&_input[z-input]]:ring-0! [&_input[z-input]]:ring-offset-0! [&_input[z-input]]:px-0!',
    '[&_input[z-input]]:py-0! [&_input[z-input]]:h-full! [&_input[z-input]]:flex-1',
    '[&_textarea[z-input]]:border-0! [&_textarea[z-input]]:bg-transparent! [&_textarea[z-input]]:outline-none!',
    '[&_textarea[z-input]]:ring-0! [&_textarea[z-input]]:ring-offset-0! [&_textarea[z-input]]:px-0! [&_textarea[z-input]]:py-0!',
    'min-w-0 has-[textarea]:flex-col has-[textarea]:p-3 has-[textarea]:h-auto border border-input',
    // focus state
    'has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-8',
        default: 'h-9',
        lg: 'h-10',
      },
      zDisabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zDisabled: false,
    },
  },
);

export const inputGroupAddonVariants = cva(
  'items-center whitespace-nowrap font-medium text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      zType: {
        default: 'justify-center',
        textarea: 'justify-start w-full',
      },
      zSize: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      zPosition: {
        before: 'rounded-l-md border-r-0',
        after: 'rounded-r-md border-l-0',
      },
      zDisabled: {
        true: 'cursor-not-allowed opacity-50 pointer-events-none',
        false: '',
      },
      zAlign: {
        block: 'flex',
        inline: 'inline-flex',
      },
    },
    defaultVariants: {
      zAlign: 'inline',
      zPosition: 'before',
      zDisabled: false,
      zSize: 'default',
    },
    compoundVariants: [
      {
        zType: 'default',
        zSize: 'default',
        class: 'h-8.5',
      },
      {
        zType: 'default',
        zSize: 'sm',
        class: 'h-7.5',
      },
      {
        zType: 'default',
        zSize: 'lg',
        class: 'h-9.5',
      },
      {
        zType: 'textarea',
        zPosition: 'before',
        class: 'mb-2',
      },
      {
        zType: 'textarea',
        zPosition: 'after',
        class: 'mt-2',
      },
    ],
  },
);

export const inputGroupInputVariants = cva(
  mergeClasses(
    'font-normal flex has-[textarea]:h-auto w-full items-center rounded-md bg-background ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
    'focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-7.5 px-0.5 py-0 text-xs',
        default: 'h-8.5 px-0.5 py-0 text-sm',
        lg: 'h-9.5 px-0.5 py-0 text-base',
      },
      zHasAddonBefore: {
        true: 'border-l-0 rounded-l-none',
        false: '',
      },
      zHasAddonAfter: {
        true: 'border-r-0 rounded-r-none',
        false: '',
      },
      zDisabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zHasAddonBefore: false,
      zHasAddonAfter: false,
      zDisabled: false,
    },
  },
);

export type ZardInputGroupAddonAlignVariants = NonNullable<VariantProps<typeof inputGroupAddonVariants>['zAlign']>;
export type ZardInputGroupAddonPositionVariants = NonNullable<
  VariantProps<typeof inputGroupAddonVariants>['zPosition']
>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export { ZardInputGroupComponent } from './input-group.component';
export * from './input-group.variants';

```


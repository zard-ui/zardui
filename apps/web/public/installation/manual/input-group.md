

```angular-ts title="input-group.component.ts" copyButton showLineNumbers
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { inputGroupAddonVariants, inputGroupAffixVariants, inputGroupInputVariants, inputGroupVariants, ZardInputGroupVariants } from './input-group.variants';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { generateId, mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-input-group',
  exportAs: 'zInputGroup',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class]="wrapperClasses()"
      [attr.role]="'group'"
      [attr.aria-label]="zAriaLabel()"
      [attr.aria-labelledby]="zAriaLabelledBy()"
      [attr.aria-describedby]="zAriaDescribedBy()"
      [attr.aria-disabled]="zDisabled()"
      [attr.data-disabled]="zDisabled()"
    >
      @if (zAddOnBefore()) {
        <div [class]="addonBeforeClasses()" [id]="addonBeforeId()" [attr.aria-label]="zAddOnBeforeAriaLabel()" [attr.aria-disabled]="zDisabled()">
          <ng-container *zStringTemplateOutlet="zAddOnBefore()">{{ zAddOnBefore() }}</ng-container>
        </div>
      }

      <div [class]="inputWrapperClasses()">
        @if (zPrefix()) {
          <div [class]="prefixClasses()" [id]="prefixId()" [attr.aria-label]="zPrefixAriaLabel()" [attr.aria-hidden]="true">
            <ng-container *zStringTemplateOutlet="zPrefix()">{{ zPrefix() }}</ng-container>
          </div>
        }

        <ng-content select="input[z-input], textarea[z-input]"></ng-content>

        @if (zSuffix()) {
          <div [class]="suffixClasses()" [id]="suffixId()" [attr.aria-label]="zSuffixAriaLabel()" [attr.aria-hidden]="true">
            <ng-container *zStringTemplateOutlet="zSuffix()">{{ zSuffix() }}</ng-container>
          </div>
        }
      </div>

      @if (zAddOnAfter()) {
        <div [class]="addonAfterClasses()" [id]="addonAfterId()" [attr.aria-label]="zAddOnAfterAriaLabel()" [attr.aria-disabled]="zDisabled()">
          <ng-container *zStringTemplateOutlet="zAddOnAfter()">{{ zAddOnAfter() }}</ng-container>
        </div>
      }
    </div>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardInputGroupComponent {
  readonly zSize = input<ZardInputGroupVariants['zSize']>('default');
  readonly zAddOnBefore = input<string | TemplateRef<void>>();
  readonly zAddOnAfter = input<string | TemplateRef<void>>();
  readonly zPrefix = input<string | TemplateRef<void>>();
  readonly zSuffix = input<string | TemplateRef<void>>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zAriaLabel = input<string>();
  readonly zAriaLabelledBy = input<string>();
  readonly zAriaDescribedBy = input<string>();
  readonly zAddOnBeforeAriaLabel = input<string>();
  readonly zAddOnAfterAriaLabel = input<string>();
  readonly zPrefixAriaLabel = input<string>();
  readonly zSuffixAriaLabel = input<string>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses('w-full', this.class()));

  private readonly uniqueId = generateId('input-group');
  protected readonly addonBeforeId = computed(() => `${this.uniqueId}-addon-before`);
  protected readonly addonAfterId = computed(() => `${this.uniqueId}-addon-after`);
  protected readonly prefixId = computed(() => `${this.uniqueId}-prefix`);
  protected readonly suffixId = computed(() => `${this.uniqueId}-suffix`);

  protected readonly wrapperClasses = computed(() =>
    inputGroupVariants({
      zSize: this.zSize(),
      zDisabled: this.zDisabled(),
    }),
  );

  protected readonly addonBeforeClasses = computed(() =>
    inputGroupAddonVariants({
      zSize: this.zSize(),
      zPosition: 'before',
      zDisabled: this.zDisabled(),
      zBorderless: this.zBorderless(),
    }),
  );

  protected readonly addonAfterClasses = computed(() =>
    inputGroupAddonVariants({
      zSize: this.zSize(),
      zPosition: 'after',
      zDisabled: this.zDisabled(),
      zBorderless: this.zBorderless(),
    }),
  );

  protected readonly prefixClasses = computed(() =>
    inputGroupAffixVariants({
      zSize: this.zSize(),
      zPosition: 'prefix',
    }),
  );

  protected readonly suffixClasses = computed(() =>
    inputGroupAffixVariants({
      zSize: this.zSize(),
      zPosition: 'suffix',
    }),
  );

  protected readonly inputWrapperClasses = computed(() => {
    return mergeClasses(
      inputGroupInputVariants({
        zSize: this.zSize(),
        zHasPrefix: Boolean(this.zPrefix()),
        zHasSuffix: Boolean(this.zSuffix()),
        zHasAddonBefore: Boolean(this.zAddOnBefore()),
        zHasAddonAfter: Boolean(this.zAddOnAfter()),
        zDisabled: this.zDisabled(),
        zBorderless: this.zBorderless(),
      }),
      'relative',
    );
  });
}

```



```angular-ts title="input-group.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const inputGroupVariants = cva(
  'flex items-stretch w-full [&_input[z-input]]:!border-0 [&_input[z-input]]:!bg-transparent [&_input[z-input]]:!outline-none [&_input[z-input]]:!ring-0 [&_input[z-input]]:!ring-offset-0 [&_input[z-input]]:!px-0 [&_input[z-input]]:!py-0 [&_input[z-input]]:!h-full [&_input[z-input]]:flex-1 [&_textarea[z-input]]:!border-0 [&_textarea[z-input]]:!bg-transparent [&_textarea[z-input]]:!outline-none [&_textarea[z-input]]:!ring-0 [&_textarea[z-input]]:!ring-offset-0 [&_textarea[z-input]]:!px-0 [&_textarea[z-input]]:!py-0',
  {
    variants: {
      zSize: {
        sm: 'h-9',
        default: 'h-10',
        lg: 'h-11',
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
  'addon inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      zSize: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
      zPosition: {
        before: 'rounded-l-md border-r-0',
        after: 'rounded-r-md border-l-0',
      },
      zDisabled: {
        true: 'cursor-not-allowed opacity-50 pointer-events-none',
        false: '',
      },
      zBorderless: {
        true: 'border-0 shadow-none',
        false: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zPosition: 'before',
      zDisabled: false,
      zBorderless: false,
    },
  },
);

export const inputGroupAffixVariants = cva('absolute inset-y-0 flex items-center text-muted-foreground pointer-events-none z-10', {
  variants: {
    zSize: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
    zPosition: {
      prefix: 'left-0 pl-3',
      suffix: 'right-0 pr-3',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zPosition: 'prefix',
  },
});

export const inputGroupInputVariants = cva(
  'input-wrapper flex h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  {
    variants: {
      zSize: {
        sm: 'h-9 px-3 py-1 text-sm',
        default: 'h-10 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2 text-base',
      },
      zHasPrefix: {
        true: '',
        false: '',
      },
      zHasSuffix: {
        true: '',
        false: '',
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
      zBorderless: {
        true: 'border-0 bg-transparent shadow-none',
        false: '',
      },
    },
    compoundVariants: [
      {
        zHasPrefix: true,
        zSize: 'sm',
        class: 'pl-7',
      },
      {
        zHasPrefix: true,
        zSize: 'default',
        class: 'pl-8',
      },
      {
        zHasPrefix: true,
        zSize: 'lg',
        class: 'pl-9',
      },
      {
        zHasSuffix: true,
        zSize: 'sm',
        class: 'pr-12',
      },
      {
        zHasSuffix: true,
        zSize: 'default',
        class: 'pr-14',
      },
      {
        zHasSuffix: true,
        zSize: 'lg',
        class: 'pr-16',
      },
    ],
    defaultVariants: {
      zSize: 'default',
      zHasPrefix: false,
      zHasSuffix: false,
      zHasAddonBefore: false,
      zHasAddonAfter: false,
      zDisabled: false,
      zBorderless: false,
    },
  },
);

export type ZardInputGroupVariants = VariantProps<typeof inputGroupVariants>;

```



```angular-ts title="index.ts" copyButton showLineNumbers
export { ZardInputGroupComponent } from './input-group.component';
export { ZardInputGroupInputDirective } from './input-group-input.directive';
export * from './input-group.variants';

```


import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const inputGroupVariants = cva(
  mergeClasses(
    'rounded-lg flex items-stretch w-full min-w-0 transition-colors',
    'border border-input dark:bg-input/30',
    '[&_input[z-input]]:border-0! [&_input[z-input]]:bg-transparent! [&_input[z-input]]:outline-none!',
    '[&_input[z-input]]:ring-0! [&_input[z-input]]:ring-offset-0! [&_input[z-input]]:px-0!',
    '[&_input[z-input]]:py-0! [&_input[z-input]]:h-full! [&_input[z-input]]:flex-1',
    '[&_textarea[z-input]]:border-0! [&_textarea[z-input]]:bg-transparent! [&_textarea[z-input]]:outline-none!',
    '[&_textarea[z-input]]:ring-0! [&_textarea[z-input]]:ring-offset-0! [&_textarea[z-input]]:px-2.5! [&_textarea[z-input]]:py-2!',
    'has-[textarea]:flex-col has-[textarea]:h-auto',
    // focus state
    'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
    // disabled state
    'has-disabled:bg-input/50 has-disabled:opacity-50 dark:has-disabled:bg-input/80',
    // block align
    'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-8',
        default: 'h-9',
        lg: 'h-10',
      },
      zDisabled: {
        true: 'cursor-not-allowed',
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
  'items-center gap-1 py-1.5 cursor-text whitespace-nowrap font-medium text-muted-foreground select-none transition-colors disabled:pointer-events-none disabled:opacity-50 [&>svg:not([class*=size-])]:size-4',
  {
    variants: {
      zType: {
        default: 'justify-center',
        textarea: 'justify-start w-full',
      },
      zSize: {
        sm: 'text-sm',
        default: 'text-sm',
        lg: 'text-base',
      },
      zPosition: {
        before: 'order-first',
        after: 'order-last',
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
        zPosition: 'before',
        class: 'pl-2 has-[>button]:ml-[-0.3rem]',
      },
      {
        zType: 'default',
        zPosition: 'after',
        class: 'pr-2 has-[>button]:mr-[-0.3rem]',
      },
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
        class: 'w-full justify-start px-3 pt-2',
      },
      {
        zType: 'textarea',
        zPosition: 'after',
        class: 'w-full justify-start px-3 pb-2',
      },
    ],
  },
);

export const inputGroupInputVariants = cva(
  mergeClasses(
    'font-normal flex has-[textarea]:h-auto w-full items-center rounded-lg bg-transparent ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
    'focus-within:outline-none disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50 transition-colors',
    'dark:bg-transparent dark:disabled:bg-transparent',
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

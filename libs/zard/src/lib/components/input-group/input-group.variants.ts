import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '../../shared/utils/utils';

export const inputGroupVariants = cva(
  mergeClasses(
    'rounded-md flex px-3 items-stretch w-full [&_input[z-input]]:border-0! [&_input[z-input]]:bg-transparent! [&_input[z-input]]:outline-none! [&_input[z-input]]:ring-0! [&_input[z-input]]:ring-offset-0! [&_input[z-input]]:px-0! [&_input[z-input]]:py-0! [&_input[z-input]]:h-full! [&_input[z-input]]:flex-1 [&_textarea[z-input]]:border-0! [&_textarea[z-input]]:bg-transparent! [&_textarea[z-input]]:outline-none! [&_textarea[z-input]]:ring-0! [&_textarea[z-input]]:ring-offset-0! [&_textarea[z-input]]:px-0! [&_textarea[z-input]]:py-0!',
    // focus state
    'has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
    'min-w-0 has-[textarea]:flex-col has-[textarea]:p-3 border border-input',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-8.5 has-[textarea]:h-auto',
        default: 'h-9.5 has-[textarea]:h-auto',
        lg: 'h-10.5 has-[textarea]:h-auto',
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
        class: 'h-9',
      },
      {
        zType: 'default',
        zSize: 'sm',
        class: 'h-8',
      },
      {
        zType: 'default',
        zSize: 'lg',
        class: 'h-10',
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
  'font-normal flex h-full w-full items-center rounded-md bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  {
    variants: {
      zSize: {
        sm: 'h-8 px-0.5 py-0 text-xs has-[textarea]:h-auto',
        default: 'h-9 px-0.5 py-0 text-sm has-[textarea]:h-auto',
        lg: 'h-10 px-0.5 py-0 text-base has-[textarea]:h-auto',
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
    },
  },
);

export type ZardInputGroupAddonAlignVariants = NonNullable<VariantProps<typeof inputGroupAddonVariants>['zAlign']>;
export type ZardInputGroupAddonPositionVariants = NonNullable<
  VariantProps<typeof inputGroupAddonVariants>['zPosition']
>;

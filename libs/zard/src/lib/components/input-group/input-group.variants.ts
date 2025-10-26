import { cva, type VariantProps } from 'class-variance-authority';

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

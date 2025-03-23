import { cva, VariantProps } from 'class-variance-authority';

export const alertVariants = cva('relative flex gap-3 w-full rounded-lg p-4', {
  variants: {
    zType: {
      default: 'dark:data-[appearance="soft"]:text-zinc-800 data-[appearance="fill"]:text-white',
      info: 'text-blue-500 data-[appearance="fill"]:text-white',
      success: 'text-green-600 data-[appearance="fill"]:text-white',
      warning: 'text-yellow-600 data-[appearance="fill"]:text-white',
      error: 'text-red-500 data-[appearance="fill"]:text-white',
    },
    zAppearance: {
      outline: 'border data-[type="info"]:border-blue-500 data-[type="success"]:border-green-600 data-[type="warning"]:border-yellow-600 data-[type="error"]:border-red-500',
      soft: 'bg-zinc-100 data-[type="info"]:bg-blue-50 data-[type="success"]:bg-green-50 data-[type="warning"]:bg-yellow-50 data-[type="error"]:bg-red-50',
      fill: 'bg-zinc-500 data-[type="info"]:bg-blue-500 data-[type="success"]:bg-green-600 data-[type="warning"]:bg-yellow-600 data-[type="error"]:bg-red-500',
    },
  },
  defaultVariants: {
    zType: 'default',
    zAppearance: 'outline',
  },
});
export type ZardAlertVariants = VariantProps<typeof alertVariants>;

export const alertIconVariants = cva(
  'flex items-center justify-center before:flex before:items-center before:justify-center before:w-full before:h-full before:min-w-full before:min-h-full before:max-w-full before:max-h-full',
  {
    variants: {
      zSize: {
        sm: 'w-4 h-4 min-w-4 min-h-4 font-4 line-4 before:text-[1rem]',
        md: 'w-5 h-5 min-w-5 min-h-5 font-5 line-5 before:text-[1.25rem]',
        lg: 'w-6 h-6 min-w-6 min-h-6 font-6 line-6 before:text-[1.5rem]',
        xl: 'w-8 h-8 min-w-8 min-h-8 font-8 line-8 before:text-[2rem]',
        '2xl': 'w-10 h-10 min-w-10 min-h-10 font-10 line-10 before:text-[2.5rem]',
      },
    },
    defaultVariants: {
      zSize: 'md',
    },
  },
);
export type ZardAlertIconVariants = VariantProps<typeof alertIconVariants>;

export const alertTitleVariants = cva('font-medium leading-none tracking-tight', {
  variants: {},
});
export type ZardAlertTitleVariants = VariantProps<typeof alertTitleVariants>;

export const alertDescriptionVariants = cva('text-sm', {
  variants: {},
});
export type ZardAlertDescriptionVariants = VariantProps<typeof alertDescriptionVariants>;

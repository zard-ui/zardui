import { cva, VariantProps } from 'class-variance-authority';

export const alertVariants = cva('relative flex gap-2 w-full rounded-lg p-4', {
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

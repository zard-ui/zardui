import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot='alert-action']:pr-18 has-data-[slot='alert-icon']:grid-cols-[auto_1fr] has-data-[slot='alert-icon']:gap-x-2 **:data-[slot='alert-icon']:row-span-2 **:data-[slot='alert-icon']:translate-y-0.5 **:data-[slot='alert-icon']:text-current [&_[data-slot='alert-icon']_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      zType: {
        default: 'bg-card text-card-foreground',
        destructive:
          "bg-card text-destructive **:data-[slot='alert-description']:text-destructive/90 [&_[data-slot='alert-icon']_svg]:text-current",
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export const alertIconVariants = cva('shrink-0 self-start text-base!');

export const alertActionVariants = cva('absolute top-2 right-2');

export const alertTitleVariants = cva(
  "font-medium group-has-data-[slot='alert-icon']/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
);

export const alertDescriptionVariants = cva(
  'text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
  {
    variants: {
      zType: {
        default: 'text-muted-foreground',
        destructive: '',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardAlertTypeVariants = NonNullable<VariantProps<typeof alertVariants>['zType']>;

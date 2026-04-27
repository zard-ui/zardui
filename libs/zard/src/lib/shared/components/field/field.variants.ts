import { cva, type VariantProps } from 'class-variance-authority';

export const fieldSetVariants = cva(
  'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
);

export const fieldLegendVariants = cva(
  'mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
);

export const fieldGroupVariants = cva(
  'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
);

export const fieldVariants = cva('group/field flex w-full gap-2 data-[invalid=true]:text-destructive', {
  variants: {
    zOrientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    zOrientation: 'vertical',
  },
});

export const fieldContentVariants = cva('group/field-content flex flex-1 flex-col gap-0.5 leading-snug');

export const fieldLabelVariants = cva(
  [
    'group/field-label peer/field-label flex w-fit gap-2 text-sm font-medium leading-snug',
    'group-data-[disabled=true]/field:opacity-50',
    'has-data-checked:border-primary/30 has-data-checked:bg-primary/5',
    'has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5',
    'dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10',
    'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
  ].join(' '),
);

export const fieldTitleVariants = cva(
  'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50',
);

export const fieldDescriptionVariants = cva(
  [
    'text-left text-sm leading-normal font-normal text-muted-foreground',
    'group-has-data-horizontal/field:text-balance',
    '[[data-variant=legend]+&]:-mt-1.5',
    'last:mt-0 nth-last-2:-mt-1',
    '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
  ].join(' '),
);

export const fieldSeparatorVariants = cva(
  'relative -my-2 flex h-5 items-center text-sm group-data-[variant=outline]/field-group:-mb-2',
);

export const fieldErrorVariants = cva('text-sm font-normal text-destructive');

export type ZardFieldOrientationVariants = NonNullable<VariantProps<typeof fieldVariants>['zOrientation']>;
export type ZardFieldLegendVariants = 'legend' | 'label';

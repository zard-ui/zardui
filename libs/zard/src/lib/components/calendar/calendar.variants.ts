import { cva, VariantProps } from 'class-variance-authority';

export const calendarVariants = cva('bg-background p-3 w-fit rounded-lg border', {
  variants: {
    zSize: {
      sm: 'text-sm',
      default: '',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const calendarMonthVariants = cva('flex flex-col w-full gap-4');

export const calendarNavVariants = cva('flex items-center justify-between gap-2 w-full mb-4');

export const calendarNavButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
);

export const calendarWeekdaysVariants = cva('flex');

export const calendarWeekdayVariants = cva('text-muted-foreground font-normal text-center', {
  variants: {
    zSize: {
      sm: 'text-xs w-7',
      default: 'text-[0.8rem] w-9',
      lg: 'text-sm w-11',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const calendarWeekVariants = cva('flex w-full mt-2');

export const calendarDayVariants = cva('text-center p-0 relative focus-within:relative focus-within:z-20', {
  variants: {
    zSize: {
      sm: 'h-7 w-7 text-xs',
      default: 'h-9 w-9 text-sm',
      lg: 'h-11 w-11 text-base',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const calendarDayButtonVariants = cva(
  'p-0 font-normal inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      zSize: {
        sm: 'h-7 w-7 text-xs',
        default: 'h-9 w-9 text-sm',
        lg: 'h-11 w-11 text-base',
      },
      selected: {
        true: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        false: '',
      },
      today: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
      outside: {
        true: 'text-muted-foreground opacity-50',
        false: '',
      },
      disabled: {
        true: 'text-muted-foreground opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      {
        today: true,
        selected: false,
        className: 'bg-accent text-accent-foreground',
      },
      {
        today: true,
        selected: true,
        className: 'bg-primary text-primary-foreground',
      },
    ],
    defaultVariants: {
      zSize: 'default',
      selected: false,
      today: false,
      outside: false,
      disabled: false,
    },
  },
);

export type ZardCalendarVariants = VariantProps<typeof calendarVariants>;
export type ZardCalendarWeekdayVariants = VariantProps<typeof calendarWeekdayVariants>;
export type ZardCalendarDayVariants = VariantProps<typeof calendarDayVariants>;
export type ZardCalendarDayButtonVariants = VariantProps<typeof calendarDayButtonVariants>;

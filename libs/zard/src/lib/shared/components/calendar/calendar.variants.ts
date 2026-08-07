import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * Every measurement of the calendar derives from two CSS variables declared on the root:
 *
 * - `--cell-size`: the width/height of a single day cell (default `--spacing(7)`)
 * - `--cell-radius`: the corner radius of a day cell (default `var(--radius-md)`)
 *
 * Overriding them through the `class` input rescales the whole calendar, e.g.
 * `class="[--cell-size:--spacing(12)]"`.
 */
export const calendarVariants = cva(
  mergeClasses(
    'group/calendar w-fit bg-background p-2',
    '[--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)]',
    'in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
  ),
);

export const calendarMonthVariants = cva('relative flex w-full flex-col gap-4');

export const calendarNavVariants = cva('absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1');

/**
 * Extra classes layered on top of `buttonVariants` — the navigation arrows are rendered with
 * `<button z-button [zType]="zButtonVariant()">`, so the button component supplies the base styling.
 */
export const calendarNavButtonVariants = cva('size-(--cell-size) p-0 select-none aria-disabled:opacity-50');

export const calendarCaptionVariants = cva('flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)');

export const calendarDropdownsVariants = cva(
  'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
);

export const calendarCaptionLabelVariants = cva('font-medium select-none', {
  variants: {
    layout: {
      label: 'text-sm',
      dropdown:
        'flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
    },
  },
  defaultVariants: {
    layout: 'label',
  },
});

/**
 * Classes handed to `<z-select>` through its `class` input so the caption dropdowns match shadcn.
 * The select component itself is left untouched — only its trigger is restyled from the outside.
 */
export const calendarDropdownVariants = cva(
  mergeClasses(
    'w-auto rounded-(--cell-radius)',
    '[&_button]:h-(--cell-size) [&_button]:w-auto [&_button]:gap-1 [&_button]:rounded-(--cell-radius)',
    '[&_button]:px-2 [&_button]:text-sm [&_button]:font-medium [&_button]:shadow-xs',
    '[&_button_ng-icon]:size-3.5!',
  ),
);

export const calendarWeekdaysVariants = cva('grid w-full grid-cols-7');

export const calendarWeekdayVariants = cva(
  mergeClasses(
    'flex h-(--cell-size) w-full min-w-(--cell-size) items-center justify-center',
    'rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none',
  ),
);

/** The day rows. `gap-y-2` reproduces the `week: mt-2` of shadcn; `gap-x-0` keeps the range rail continuous. */
export const calendarWeekVariants = cva('mt-2 grid w-full grid-cols-7 gap-x-0 gap-y-2');

export const calendarDayVariants = cva(
  mergeClasses(
    'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none',
    // Round the range rail at both ends of every week.
    '[&:nth-child(7n+1)]:rounded-s-(--cell-radius) [&:nth-child(7n)]:rounded-e-(--cell-radius)',
  ),
  {
    variants: {
      selected: {
        true: '',
        false: '',
      },
      today: {
        true: 'rounded-(--cell-radius) bg-muted text-foreground',
        false: '',
      },
      rangeStart: {
        true: mergeClasses(
          'relative isolate z-0 rounded-s-(--cell-radius) bg-muted',
          'after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-muted',
          // No neighbour to bridge to at the end of a week — do not bleed outside the grid.
          '[&:nth-child(7n)]:after:hidden',
        ),
        false: '',
      },
      rangeMiddle: {
        true: 'rounded-none bg-muted',
        false: '',
      },
      rangeEnd: {
        true: mergeClasses(
          'relative isolate z-0 rounded-e-(--cell-radius) bg-muted',
          'after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-muted',
          '[&:nth-child(7n+1)]:after:hidden',
        ),
        false: '',
      },
    },
    compoundVariants: [
      {
        // A one-day range is a plain selected day: full radius, no rail.
        rangeStart: true,
        rangeEnd: true,
        className: 'rounded-(--cell-radius) bg-transparent after:hidden',
      },
      {
        // Today + selected outside of a range: the day button owns the highlight.
        today: true,
        selected: true,
        rangeStart: false,
        rangeMiddle: false,
        rangeEnd: false,
        className: 'bg-transparent',
      },
    ],
    defaultVariants: {
      selected: false,
      today: false,
      rangeStart: false,
      rangeMiddle: false,
      rangeEnd: false,
    },
  },
);

export const calendarDayButtonVariants = cva(
  mergeClasses(
    'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-1',
    'rounded-(--cell-radius) border border-transparent p-0 text-sm leading-none font-normal',
    'transition-colors outline-none',
    'hover:bg-muted hover:text-foreground dark:hover:text-foreground',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&>span]:text-xs [&>span]:opacity-70',
  ),
  {
    variants: {
      selected: {
        true: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      rangeStart: {
        true: 'rounded-(--cell-radius) rounded-s-(--cell-radius) bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      rangeEnd: {
        true: 'rounded-(--cell-radius) rounded-e-(--cell-radius) bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      rangeMiddle: {
        true: 'rounded-none bg-muted text-foreground hover:bg-muted hover:text-foreground',
        false: '',
      },
      outside: {
        true: 'text-muted-foreground aria-selected:text-muted-foreground',
        false: '',
      },
      disabled: {
        true: 'text-muted-foreground opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      {
        // A one-day range renders as a regular selected day.
        rangeStart: true,
        rangeEnd: true,
        className: 'rounded-(--cell-radius) bg-primary text-primary-foreground',
      },
    ],
    defaultVariants: {
      selected: false,
      rangeStart: false,
      rangeEnd: false,
      rangeMiddle: false,
      outside: false,
      disabled: false,
    },
  },
);

export type ZardCalendarCaptionLabelVariants = NonNullable<VariantProps<typeof calendarCaptionLabelVariants>['layout']>;

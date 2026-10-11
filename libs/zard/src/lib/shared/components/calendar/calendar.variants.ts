import { cva, type VariantProps } from 'class-variance-authority';

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
  // `block` because these classes land on the `<z-calendar>` host, which is inline by default.
  'cn-calendar group/calendar',
);

/** Wraps every rendered month. Stacks on small screens and sits side by side from `md` up. */
export const calendarMonthsVariants = cva('cn-calendar-months');

export const calendarMonthVariants = cva('cn-calendar-month');

export const calendarNavVariants = cva('cn-calendar-nav');

/**
 * Extra classes layered on top of `buttonVariants` — the navigation arrows are rendered with
 * `<button z-button [zType]="zButtonVariant()">`, so the button component supplies the base styling.
 */
export const calendarNavButtonVariants = cva('cn-calendar-nav-button select-none aria-disabled:opacity-50');

/** Placeholder that holds an arrow's slot on the months that do not own it. */
export const calendarNavSpacerVariants = cva('cn-calendar-nav-spacer');

export const calendarCaptionVariants = cva('cn-calendar-caption');

export const calendarDropdownsVariants = cva('cn-calendar-dropdowns');

export const calendarCaptionLabelVariants = cva('cn-calendar-caption-label select-none', {
  variants: {
    layout: {
      label: 'cn-calendar-caption-label-layout-label',
      // In dropdown layout this label is what the user sees of the select underneath it,
      // so it carries the control's height and padding.
      dropdown: 'cn-calendar-caption-label-layout-dropdown',
    },
  },
  defaultVariants: {
    layout: 'label',
  },
});

/**
 * Wraps a caption dropdown. A native `<select>` is laid invisible on top of the visible label,
 * so the browser owns the popup while the label owns the looks — the same trick shadcn uses.
 * The focus ring therefore has to come from the select, through `has-[:focus-visible]`.
 */
export const calendarDropdownRootVariants = cva('cn-calendar-dropdown-root');

/** The native select itself: invisible, but on top and still clickable. */
export const calendarDropdownVariants = cva('cn-calendar-dropdown');

export const calendarWeekdaysVariants = cva('cn-calendar-weekdays');

export const calendarWeekdayVariants = cva('cn-calendar-weekday select-none');

/** The container for the day rows. */
export const calendarWeeksVariants = cva('cn-calendar-weeks');
/** @deprecated Use `calendarWeeksVariants` and `calendarRowVariants`. Kept for backward compatibility. */
export const calendarWeekVariants = cva('cn-calendar-week');

/** The day row: 7 columns for the days of the week. `gap-x-0` keeps the range rail continuous. */
export const calendarRowVariants = cva('cn-calendar-row');

export const calendarDayVariants = cva(
  // Round the range rail at both ends of every week row (supports both nested rows and flat grid).
  'cn-calendar-day group/day select-none',
  {
    variants: {
      selected: {
        true: '',
        false: '',
      },
      today: {
        true: 'cn-calendar-day-today-true',
        false: '',
      },
      rangeStart: {
        // No neighbour to bridge to at the end of a week — do not bleed outside the grid.
        true: 'cn-calendar-day-range-start-true',
        false: '',
      },
      rangeMiddle: {
        true: 'cn-calendar-day-range-middle-true',
        false: '',
      },
      rangeEnd: {
        true: 'cn-calendar-day-range-end-true',
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

export const calendarDayButtonVariants = cva('cn-calendar-day-button outline-none disabled:pointer-events-none', {
  variants: {
    selected: {
      true: 'cn-calendar-day-button-selected-true',
      false: '',
    },
    rangeStart: {
      true: 'cn-calendar-day-button-range-start-true',
      false: '',
    },
    rangeEnd: {
      true: 'cn-calendar-day-button-range-end-true',
      false: '',
    },
    rangeMiddle: {
      true: 'cn-calendar-day-button-range-middle-true',
      false: '',
    },
    outside: {
      true: 'cn-calendar-day-button-outside-true',
      false: '',
    },
    disabled: {
      true: 'cn-calendar-day-button-disabled-true',
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
});

export type ZardCalendarCaptionLabelVariants = NonNullable<VariantProps<typeof calendarCaptionLabelVariants>['layout']>;

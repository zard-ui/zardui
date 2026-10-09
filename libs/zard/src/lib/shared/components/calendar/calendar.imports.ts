/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardCalendarGridComponent } from '@/shared/components/calendar/calendar-grid.component';
import { ZardCalendarNavigationComponent } from '@/shared/components/calendar/calendar-navigation.component';
import { ZardCalendarComponent } from '@/shared/components/calendar/calendar.component';

/** Every part of the calendar component, for a template that uses more than one. */
export const ZardCalendarImports = [
  ZardCalendarComponent,
  ZardCalendarGridComponent,
  ZardCalendarNavigationComponent,
] as const;

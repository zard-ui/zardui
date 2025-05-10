import { ZardDemoCalendarWithEventsComponent } from './with-events';
import { ZardDemoCalendarWeekViewComponent } from './week-view';
import { ZardDemoCalendarDayViewComponent } from './day-view';
import { ZardDemoCalendarDefaultComponent } from './default';

export const CALENDAR = {
  componentName: 'calendar',
  componentType: 'calendar',
  examples: [
    {
      name: 'default',
      component: ZardDemoCalendarDefaultComponent,
      isDefineSizeContainer: false,
    },
    {
      name: 'day-view',
      component: ZardDemoCalendarDayViewComponent,
      isDefineSizeContainer: false,
    },
    {
      name: 'week-view',
      component: ZardDemoCalendarWeekViewComponent,
      isDefineSizeContainer: false,
    },
    {
      name: 'with-events',
      component: ZardDemoCalendarWithEventsComponent,
      isDefineSizeContainer: false,
    },
  ],
};

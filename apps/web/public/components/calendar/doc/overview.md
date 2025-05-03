# Calendar

The Calendar component provides a flexible and customizable date selection interface for your app. It supports different views (month, week, day), locale configuration, and event handling for date selection.

## Features

- **Multiple Views**: Switch between month, week, and day views
- **Date Selection**: Select and deselect dates with click events
- **Event Display**: Show events on the calendar with start and end times
- **Localization**: Configure the calendar for different locales
- **Navigation**: Easily navigate between time periods (previous, next, today)

## Basic Usage

```html
<z-calendar
  [defaultView]="'month'"
  [config]="{ firstDayOfWeek: 1, locale: 'en-US' }"
  (dateSelected)="onDateSelected($event)"
></z-calendar>
```

## Working with Events

You can display events on the calendar by providing an array of `CalendarEvent` objects:

```typescript
const events = [
  {
    start: new Date(2023, 5, 10, 9, 0), // June 10, 2023, 9:00 AM
    end: new Date(2023, 5, 10, 11, 0),  // June 10, 2023, 11:00 AM
    title: 'Team Meeting',
    status: 'info'
  },
  {
    start: new Date(2023, 5, 15),      // June 15, 2023 (all day)
    end: new Date(2023, 5, 15, 23, 59), // June 15, 2023, 11:59 PM
    title: 'Project Deadline',
    status: 'warning'
  }
];
```

```html
<z-calendar [events]="events"></z-calendar>
```

## Import

```ts
import { CalendarComponent } from '@zard/calendar';
```
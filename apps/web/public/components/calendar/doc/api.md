# API

## [z-calendar] <span class="api-type-label component">Component</span>

> z-calendar is a component that provides a flexible calendar interface for displaying and selecting dates, with support for different views (month, week, day) and event display.

| Property          | Description                                      | Type                         | Default                                  |
| ----------------- | ------------------------------------------------ | ---------------------------- | ---------------------------------------- |
| `[defaultView]`   | The default view to display                      | `'month' \| 'week' \| 'day'` | `'month'`                                |
| `[selectedDates]` | Array of selected dates                          | `Date[]`                     | `[]`                                     |
| `[events]`        | Array of calendar events to display              | `CalendarEvent[]`            | `[]`                                     |
| `[config]`        | Calendar configuration options                   | `CalendarConfig`             | `{ firstDayOfWeek: 0, locale: 'en-US' }` |
| `(dateSelected)`  | Event emitted when dates are selected/deselected | `EventEmitter<Date[]>`       | -                                        |

## CalendarEvent Interface

```typescript
interface CalendarEvent {
  start: Date;      // Start date and time of the event
  end: Date;        // End date and time of the event
  status?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
}
```

## CalendarConfig Interface

```typescript
interface CalendarConfig {
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  locale?: string;        // Locale for date formatting (e.g., 'en-US')
}
```

## Calendar Views

The calendar component supports three different views:

- **Month View**: Displays a traditional month calendar with all days of the month
- **Week View**: Displays a single week with all days of the week
- **Day View**: Displays a single day with detailed information

You can switch between views programmatically using the `switchView()` method or by configuring the `defaultView` input property.

## Event Handling

The calendar component provides event handling for date selection:

```html
<z-calendar
  [config]="{ firstDayOfWeek: 1, locale: 'en-US' }"
  (dateSelected)="onDateSelected($event)"
>
</z-calendar>
```

```typescript
onDateSelected(dates: Date[]): void {
  console.log('Selected dates:', dates);
}
```

## Public Methods

| Method                           | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `switchView(view: CalendarView)` | Switch to a different calendar view ('month', 'week', or 'day') |
| `navigatePrevious()`             | Navigate to the previous time period (month, week, or day)      |
| `navigateNext()`                 | Navigate to the next time period (month, week, or day)          |
| `navigateToday()`                | Navigate to today's date                                        |
| `formatMonthYear(date: Date)`    | Format the month and year for display in the header             |
| `onDateClick(date: Date)`        | Handle date click events - toggle selection                      |

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CalendarConfig, CalendarDay, CalendarEvent, CalendarMonth, CalendarView, CalendarWeek } from './models/calendar.models';
import { CalendarUtilsService } from './services/calendar-utils.service';

@Component({
  selector: 'z-calendar',
  exportAs: 'zCalendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnChanges {
  /**
   * The default view to display (month, week, or day)
   */
  @Input() defaultView: CalendarView = 'month';

  /**
   * Array of selected dates
   */
  @Input() selectedDates: Date[] = [];

  /**
   * Array of calendar events to display
   */
  @Input() events: CalendarEvent[] = [];

  /**
   * Calendar configuration options
   */
  @Input() config: CalendarConfig = {
    firstDayOfWeek: 0, // Sunday
    locale: 'en-US',
  };

  /**
   * Event emitted when dates are selected/deselected
   */
  @Output() dateSelected = new EventEmitter<Date[]>();

  // Current view state
  currentView: CalendarView = 'month';
  currentDate: Date = new Date();
  weekdays: string[] = [];

  // View data
  monthData: CalendarMonth = { weeks: [] };
  weekData: CalendarWeek = { days: [] };
  dayData: CalendarDay = {
    date: new Date(),
    isCurrentMonth: true,
    isToday: true,
    isSelected: false,
    events: [],
  };

  constructor(private calendarUtils: CalendarUtilsService) {}

  ngOnInit(): void {
    this.currentView = this.defaultView;
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDates'] || changes['events'] || changes['config'] || changes['defaultView']) {
      this.initializeCalendar();
    }
  }

  /**
   * Initialize the calendar with the current settings
   */
  private initializeCalendar(): void {
    // Set weekday names based on locale and first day of week
    this.weekdays = this.calendarUtils.getWeekdayNames(this.config.locale || 'en-US', 'short', this.config.firstDayOfWeek);

    // Generate the appropriate view data
    this.generateViewData();
  }

  /**
   * Generate the data for the current view (month, week, or day)
   */
  private generateViewData(): void {
    switch (this.currentView) {
      case 'month':
        this.monthData = this.calendarUtils.generateMonthView(this.currentDate, this.config.firstDayOfWeek, this.selectedDates, this.events);
        break;
      case 'week':
        this.weekData = this.calendarUtils.generateWeekView(this.currentDate, this.config.firstDayOfWeek, this.selectedDates, this.events);
        break;
      case 'day':
        this.dayData = this.calendarUtils.generateDayView(this.currentDate, this.selectedDates, this.events);
        break;
    }
  }

  /**
   * Switch to a different calendar view
   */
  switchView(view: CalendarView): void {
    this.currentView = view;
    this.generateViewData();
  }

  /**
   * Navigate to the previous time period (month, week, or day)
   */
  navigatePrevious(): void {
    const newDate = new Date(this.currentDate);

    switch (this.currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }

    this.currentDate = newDate;
    this.generateViewData();
  }

  /**
   * Navigate to the next time period (month, week, or day)
   */
  navigateNext(): void {
    const newDate = new Date(this.currentDate);

    switch (this.currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }

    this.currentDate = newDate;
    this.generateViewData();
  }

  /**
   * Navigate to today's date
   */
  navigateToday(): void {
    this.currentDate = new Date();
    this.generateViewData();
  }

  /**
   * Handle date click events - toggle selection
   */
  onDateClick(date: Date): void {
    // Create a copy of the selected dates array
    const updatedSelection = [...this.selectedDates];

    // Check if the date is already selected
    const existingIndex = updatedSelection.findIndex(selectedDate => this.calendarUtils.isSameDay(selectedDate, date));

    if (existingIndex >= 0) {
      // If already selected, remove it (toggle off)
      updatedSelection.splice(existingIndex, 1);
    } else {
      // If not selected, add it (toggle on)
      updatedSelection.push(new Date(date));
    }

    // Update the internal state
    this.selectedDates = updatedSelection;

    // Emit the updated selection
    this.dateSelected.emit(this.selectedDates);

    // Refresh the view
    this.generateViewData();
  }

  /**
   * Format the month and year for display in the header
   */
  formatMonthYear(date: Date): string {
    return date.toLocaleDateString(this.config.locale || 'en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Format the date for display in day view
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString(this.config.locale || 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

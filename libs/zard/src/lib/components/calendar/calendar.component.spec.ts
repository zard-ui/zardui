import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCalendarComponent, CalendarDay } from './calendar.component';
import { isSameDay, isDateDisabled, getDayAriaLabel, generateCalendarDays } from './calendar.utils';

describe('ZardCalendarComponent', () => {
  let component: ZardCalendarComponent;
  let fixture: ComponentFixture<ZardCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.class()).toBe('');
      expect(component.value()).toBeNull();
      expect(component.minDate()).toBeNull();
      expect(component.maxDate()).toBeNull();
      expect(component.disabled()).toBe(false);
    });
  });

  describe('Date Selection', () => {
    it('should emit dateChange when a date is selected', () => {
      const testDate = new Date(2024, 0, 15);
      let emittedDate: Date | Date[] | undefined;

      component.dateChange.subscribe((date: Date | Date[]) => {
        emittedDate = date;
      });

      // Simulate clicking on a date through the grid component
      component['onDateSelect']({ date: testDate, index: 0 });

      expect(emittedDate).toEqual(testDate);
    });

    it('should not select date when component is disabled', () => {
      Object.defineProperty(component, 'disabled', {
        value: () => true,
        writable: true,
      });

      const testDate = new Date(2024, 0, 15);
      let emittedDate: Date | Date[] | undefined;

      component.dateChange.subscribe((date: Date | Date[]) => {
        emittedDate = date;
      });

      component['onDateSelect']({ date: testDate, index: 0 });

      expect(emittedDate).toBeUndefined();
    });
  });

  describe('Navigation', () => {
    it('should navigate to previous month', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      component['previousMonth']();

      expect(component['currentMonthValue']()).toBe('4'); // May
      expect(component['currentYearValue']()).toBe('2024');
    });

    it('should navigate to next month', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      component['nextMonth']();

      expect(component['currentMonthValue']()).toBe('6'); // July
      expect(component['currentYearValue']()).toBe('2024');
    });
  });

  describe('Month and Year Selection', () => {
    it('should change month when valid month index is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      component['onMonthChange']('2'); // March (index 2)

      expect(component['currentMonthValue']()).toBe('2');
      expect(component['currentYearValue']()).toBe('2024');
    });

    it('should not change month when invalid month index is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      const beforeMonth = component['currentMonthValue']();

      component['onMonthChange']('invalid');
      component['onMonthChange']('12'); // Invalid month
      component['onMonthChange'](''); // Empty string

      expect(component['currentMonthValue']()).toBe(beforeMonth);
    });

    it('should change year when valid year is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      component['onYearChange']('2025');

      expect(component['currentYearValue']()).toBe('2025');
      expect(component['currentMonthValue']()).toBe('5'); // Should remain June
    });

    it('should not change year when invalid year is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      component['onYearChange']('invalid');
      component['onYearChange']('1899'); // Too old (below 1900)
      component['onYearChange']('2101'); // Too new (above 2100)
      component['onYearChange'](''); // Empty string

      expect(component['currentYearValue']()).toBe('2024'); // Should remain 2024
    });
  });

  describe('Calendar Days Generation', () => {
    it('should generate calendar days for current month', () => {
      const date = new Date(2024, 0, 1); // January 2024
      component['value'].set(date);

      const calendarDays = component['calendarDays']();
      expect(calendarDays.length).toBeGreaterThan(0);

      // Should include days from previous and next month to fill the grid
      const hasCurrentMonth = calendarDays.some(day => day.isCurrentMonth);
      expect(hasCurrentMonth).toBe(true);
    });

    it('should mark today correctly', () => {
      const today = new Date();
      component['value'].set(new Date(today.getFullYear(), today.getMonth(), 1));

      const calendarDays = component['calendarDays']();
      const todayDay = calendarDays.find(day => day.isToday);

      expect(todayDay).toBeDefined();
      if (todayDay) {
        expect(todayDay.date.getDate()).toBe(today.getDate());
      }
    });

    it('should mark selected date correctly', () => {
      const selectedDate = new Date(2024, 0, 15);
      component['value'].set(selectedDate);

      const calendarDays = component['calendarDays']();
      const selectedDay = calendarDays.find(day => day.isSelected);

      expect(selectedDay).toBeDefined();
      if (selectedDay) {
        expect(selectedDay.date.getDate()).toBe(15);
      }
    });
  });

  describe('Focus Management', () => {
    it('should reset navigation to current value on reset', () => {
      const testDate = new Date(2024, 5, 15);
      component['value'].set(testDate);

      component['previousMonth']();
      component.resetNavigation();

      expect(component['currentDate']().getTime()).toEqual(testDate.getTime());
    });
  });
});

describe('Calendar Utility Functions', () => {
  describe('isSameDay', () => {
    it('should correctly identify same day', () => {
      const date1 = new Date(2024, 5, 15, 10, 30);
      const date2 = new Date(2024, 5, 15, 14, 45);
      const date3 = new Date(2024, 5, 16, 10, 30);

      expect(isSameDay(date1, date2)).toBe(true);
      expect(isSameDay(date1, date3)).toBe(false);
    });
  });

  describe('isDateDisabled', () => {
    it('should correctly identify disabled dates', () => {
      const minDate = new Date(2024, 0, 10);
      const maxDate = new Date(2024, 0, 20);
      const testDate1 = new Date(2024, 0, 5); // Before min
      const testDate2 = new Date(2024, 0, 15); // Within range
      const testDate3 = new Date(2024, 0, 25); // After max

      expect(isDateDisabled(testDate1, minDate, maxDate)).toBe(true);
      expect(isDateDisabled(testDate2, minDate, maxDate)).toBe(false);
      expect(isDateDisabled(testDate3, minDate, maxDate)).toBe(true);
    });

    it('should handle null min/max dates', () => {
      const testDate = new Date(2024, 0, 15);

      expect(isDateDisabled(testDate, null, null)).toBe(false);
    });
  });

  describe('getDayAriaLabel', () => {
    it('should generate correct aria label for regular day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isDisabled: false,
      };

      const ariaLabel = getDayAriaLabel(day);
      expect(ariaLabel).toContain('Monday, January 15, 2024');
    });

    it('should generate correct aria label for today', () => {
      const today = new Date();
      const day: CalendarDay = {
        date: today,
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isDisabled: false,
      };

      const ariaLabel = getDayAriaLabel(day);
      expect(ariaLabel).toContain('Today');
    });

    it('should generate correct aria label for selected day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: true,
        isDisabled: false,
      };

      const ariaLabel = getDayAriaLabel(day);
      expect(ariaLabel).toContain('Selected');
    });

    it('should generate correct aria label for outside month day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 31),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: false,
      };

      const ariaLabel = getDayAriaLabel(day);
      expect(ariaLabel).toContain('Outside month');
    });

    it('should generate correct aria label for disabled day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isDisabled: true,
      };

      const ariaLabel = getDayAriaLabel(day);
      expect(ariaLabel).toContain('Disabled');
    });
  });

  describe('generateCalendarDays', () => {
    it('should generate calendar days with correct structure', () => {
      const days = generateCalendarDays({
        year: 2024,
        month: 0, // January
        mode: 'single',
        selectedDates: [],
        minDate: null,
        maxDate: null,
        disabled: false,
      });

      expect(days.length).toBeGreaterThan(0);
      expect(days[0]).toHaveProperty('date');
      expect(days[0]).toHaveProperty('isCurrentMonth');
      expect(days[0]).toHaveProperty('isToday');
      expect(days[0]).toHaveProperty('isSelected');
      expect(days[0]).toHaveProperty('isDisabled');
    });

    it('should mark selected dates in single mode', () => {
      const selectedDate = new Date(2024, 0, 15);
      const days = generateCalendarDays({
        year: 2024,
        month: 0,
        mode: 'single',
        selectedDates: [selectedDate],
        minDate: null,
        maxDate: null,
        disabled: false,
      });

      const selectedDay = days.find(day => isSameDay(day.date, selectedDate));
      expect(selectedDay?.isSelected).toBe(true);
    });

    it('should mark multiple selected dates in multiple mode', () => {
      const selectedDates = [new Date(2024, 0, 15), new Date(2024, 0, 20)];
      const days = generateCalendarDays({
        year: 2024,
        month: 0,
        mode: 'multiple',
        selectedDates,
        minDate: null,
        maxDate: null,
        disabled: false,
      });

      const selectedDays = days.filter(day => day.isSelected);
      expect(selectedDays.length).toBe(2);
    });

    it('should mark range correctly in range mode', () => {
      const selectedDates = [new Date(2024, 0, 10), new Date(2024, 0, 20)];
      const days = generateCalendarDays({
        year: 2024,
        month: 0,
        mode: 'range',
        selectedDates,
        minDate: null,
        maxDate: null,
        disabled: false,
      });

      const rangeStart = days.find(day => isSameDay(day.date, selectedDates[0]));
      const rangeEnd = days.find(day => isSameDay(day.date, selectedDates[1]));
      const inRange = days.filter(day => day.isInRange);

      expect(rangeStart?.isRangeStart).toBe(true);
      expect(rangeEnd?.isRangeEnd).toBe(true);
      expect(inRange.length).toBeGreaterThan(0);
    });
  });
});

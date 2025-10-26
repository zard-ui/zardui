import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCalendarComponent, CalendarDay } from './calendar.component';

describe('ZardCalendarComponent', () => {
  let component: ZardCalendarComponent;
  let fixture: ComponentFixture<ZardCalendarComponent>;

  beforeEach(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

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
      expect(component.zSize()).toBe('default');
      expect(component.value()).toBeNull();
      expect(component.minDate()).toBeNull();
      expect(component.maxDate()).toBeNull();
      expect(component.disabled()).toBe(false);
    });

    it('should have correct weekdays', () => {
      expect(component.weekdays).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    });

    it('should have correct months', () => {
      expect(component.months).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    });
  });

  describe('Date Selection', () => {
    it('should emit dateChange when a date is selected', () => {
      const testDate = new Date(2024, 0, 15);
      let emittedDate: Date | undefined;

      component.dateChange.subscribe((date: Date) => {
        emittedDate = date;
      });

      component.selectDate(testDate);

      expect(emittedDate).toEqual(testDate);
    });

    it('should not emit dateChange when component is disabled', () => {
      // Mock disabled signal by overriding the input function
      Object.defineProperty(component, 'disabled', {
        value: () => true,
        writable: true,
      });

      const testDate = new Date(2024, 0, 15);
      let emittedDate: Date | undefined;

      component.dateChange.subscribe((date: Date) => {
        emittedDate = date;
      });

      component.selectDate(testDate);

      expect(emittedDate).toBeUndefined();
    });

    it('should not select date if it is before minDate', () => {
      const minDate = new Date(2024, 0, 10);
      const testDate = new Date(2024, 0, 5);

      // Mock minDate signal
      Object.defineProperty(component, 'minDate', {
        value: () => minDate,
        writable: true,
      });

      let emittedDate: Date | undefined;
      component.dateChange.subscribe((date: Date) => {
        emittedDate = date;
      });

      component.selectDate(testDate);

      expect(emittedDate).toBeUndefined();
    });

    it('should not select date if it is after maxDate', () => {
      const maxDate = new Date(2024, 0, 10);
      const testDate = new Date(2024, 0, 15);

      // Mock maxDate signal
      Object.defineProperty(component, 'maxDate', {
        value: () => maxDate,
        writable: true,
      });

      let emittedDate: Date | undefined;
      component.dateChange.subscribe((date: Date) => {
        emittedDate = date;
      });

      component.selectDate(testDate);

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

    it('should disable previous button when minDate prevents navigation', () => {
      const minDate = new Date(2024, 5, 1); // June 1, 2024
      const currentDate = new Date(2024, 5, 15); // June 15, 2024

      // Mock minDate signal
      Object.defineProperty(component, 'minDate', {
        value: () => minDate,
        writable: true,
      });
      component['value'].set(currentDate);

      expect(component['isPreviousDisabled']()).toBe(true);
    });

    it('should disable next button when maxDate prevents navigation', () => {
      const maxDate = new Date(2024, 5, 30); // June 30, 2024
      const currentDate = new Date(2024, 5, 15); // June 15, 2024

      // Mock maxDate signal
      Object.defineProperty(component, 'maxDate', {
        value: () => maxDate,
        writable: true,
      });
      component['value'].set(currentDate);

      expect(component['isNextDisabled']()).toBe(true);
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

      component['onMonthChange']('invalid');
      component['onMonthChange']('12'); // Invalid month
      component['onMonthChange'](''); // Empty string

      const currentDate = component['currentDate']();
      expect(currentDate.getMonth()).toBe(5); // Should remain June
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

    it('should return correct current month name', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['value'].set(date);

      expect(component['currentMonthName']()).toBe('Jun');
    });

    it('should return correct current year', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['value'].set(date);

      expect(component['currentYearValue']()).toBe('2024');
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

  describe('CSS Classes and Styling', () => {
    it('should generate correct day button classes for selected day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: true,
        isDisabled: false,
      };

      const classes = component['dayButtonClasses'](day);
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should generate correct day button classes for today', () => {
      const day: CalendarDay = {
        date: new Date(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isDisabled: false,
      };

      const classes = component['dayButtonClasses'](day);
      expect(classes).toContain('bg-accent');
      expect(classes).toContain('text-accent-foreground');
    });

    it('should generate correct day button classes for outside month', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 31),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: false,
      };

      const classes = component['dayButtonClasses'](day);
      expect(classes).toContain('text-muted-foreground');
      expect(classes).toContain('opacity-50');
    });

    it('should generate correct day button classes for disabled day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isDisabled: true,
      };

      const classes = component['dayButtonClasses'](day);
      expect(classes).toContain('opacity-50');
      expect(classes).toContain('cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('should generate correct aria label for regular day', () => {
      const day: CalendarDay = {
        date: new Date(2024, 0, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isDisabled: false,
      };

      const ariaLabel = component['getDayAriaLabel'](day);
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

      const ariaLabel = component['getDayAriaLabel'](day);
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

      const ariaLabel = component['getDayAriaLabel'](day);
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

      const ariaLabel = component['getDayAriaLabel'](day);
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

      const ariaLabel = component['getDayAriaLabel'](day);
      expect(ariaLabel).toContain('Disabled');
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

  describe('Computed Properties', () => {
    it('should compute available years correctly', () => {
      const currentYear = new Date().getFullYear();
      const availableYears = component['availableYears']();

      expect(availableYears).toContain(currentYear);
      expect(availableYears).toContain(currentYear - 10);
      expect(availableYears).toContain(currentYear + 10);
      expect(availableYears.length).toBe(21);
    });

    it('should compute current month value correctly', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['value'].set(date);

      expect(component['currentMonthValue']()).toBe('5');
    });

    it('should compute current year value correctly', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['value'].set(date);

      expect(component['currentYearValue']()).toBe('2024');
    });

    it('should compute current month year correctly', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['value'].set(date);

      expect(component['currentMonthYear']()).toBe('June 2024');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle arrow key navigation', () => {
      const initialDate = new Date(2024, 0, 15); // January 15, 2024
      component['value'].set(initialDate);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      jest.spyOn(event, 'preventDefault');

      component.onKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle Home and End keys', () => {
      const initialDate = new Date(2024, 0, 15); // January 15, 2024
      component['value'].set(initialDate);

      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      const endEvent = new KeyboardEvent('keydown', { key: 'End' });

      jest.spyOn(homeEvent, 'preventDefault');
      jest.spyOn(endEvent, 'preventDefault');

      component.onKeyDown(homeEvent);
      component.onKeyDown(endEvent);

      expect(homeEvent.preventDefault).toHaveBeenCalled();
      expect(endEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle PageUp and PageDown for month navigation', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      const pageUpEvent = new KeyboardEvent('keydown', { key: 'PageUp' });
      jest.spyOn(pageUpEvent, 'preventDefault');

      component.onKeyDown(pageUpEvent);

      expect(pageUpEvent.preventDefault).toHaveBeenCalled();
      // Should navigate to previous month (May)
      expect(component['currentMonthValue']()).toBe('4');
    });

    it('should handle Ctrl+PageUp and Ctrl+PageDown for year navigation', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['value'].set(initialDate);

      const ctrlPageUpEvent = new KeyboardEvent('keydown', {
        key: 'PageUp',
        ctrlKey: true,
      });
      jest.spyOn(ctrlPageUpEvent, 'preventDefault');

      component.onKeyDown(ctrlPageUpEvent);

      expect(ctrlPageUpEvent.preventDefault).toHaveBeenCalled();
      // Should navigate to previous year (2023)
      expect(component['currentYearValue']()).toBe('2023');
    });

    it('should handle Enter and Space for date selection', () => {
      const initialDate = new Date(2024, 0, 15);
      component['value'].set(initialDate);
      component['value'].set(new Date(2024, 0, 1));

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      jest.spyOn(enterEvent, 'preventDefault');

      component.onKeyDown(enterEvent);

      expect(enterEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not handle keyboard events when disabled', () => {
      // Mock disabled signal
      Object.defineProperty(component, 'disabled', {
        value: () => true,
        writable: true,
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      jest.spyOn(event, 'preventDefault');

      component.onKeyDown(event);

      // Should not prevent default when disabled
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Private Helper Methods', () => {
    it('should correctly identify same day', () => {
      const date1 = new Date(2024, 5, 15, 10, 30);
      const date2 = new Date(2024, 5, 15, 14, 45);
      const date3 = new Date(2024, 5, 16, 10, 30);

      expect(component['isSameDay'](date1, date2)).toBe(true);
      expect(component['isSameDay'](date1, date3)).toBe(false);
    });

    it('should correctly identify disabled dates', () => {
      const minDate = new Date(2024, 0, 10);
      const maxDate = new Date(2024, 0, 20);
      const testDate1 = new Date(2024, 0, 5); // Before min
      const testDate2 = new Date(2024, 0, 15); // Within range
      const testDate3 = new Date(2024, 0, 25); // After max

      expect(component['isDateDisabled'](testDate1, minDate, maxDate)).toBe(true);
      expect(component['isDateDisabled'](testDate2, minDate, maxDate)).toBe(false);
      expect(component['isDateDisabled'](testDate3, minDate, maxDate)).toBe(true);
    });

    it('should handle null min/max dates', () => {
      const testDate = new Date(2024, 0, 15);

      expect(component['isDateDisabled'](testDate, null, null)).toBe(false);
    });
  });
});

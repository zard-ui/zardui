import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardCalendarComponent, CalendarDay } from './calendar.component';
import { ZardButtonComponent } from '../button/button.component';
import { ZardSelectComponent } from '../select/select.component';
import { ZardSelectItemComponent } from '../select/select-item.component';

describe('ZardCalendarComponent', () => {
  let component: ZardCalendarComponent;
  let fixture: ComponentFixture<ZardCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCalendarComponent, ZardButtonComponent, ZardSelectComponent, ZardSelectItemComponent],
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
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

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

      fixture.componentRef.setInput('minDate', minDate);
      fixture.detectChanges();

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

      fixture.componentRef.setInput('maxDate', maxDate);
      fixture.detectChanges();

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
      component['currentDate'].set(initialDate);
      fixture.detectChanges();

      component['previousMonth']();

      const currentDate = component['currentDate']();
      expect(currentDate.getMonth()).toBe(4); // May
      expect(currentDate.getFullYear()).toBe(2024);
    });

    it('should navigate to next month', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(initialDate);
      fixture.detectChanges();

      component['nextMonth']();

      const currentDate = component['currentDate']();
      expect(currentDate.getMonth()).toBe(6); // July
      expect(currentDate.getFullYear()).toBe(2024);
    });

    it('should disable previous button when minDate prevents navigation', () => {
      const minDate = new Date(2024, 5, 1); // June 1, 2024
      const currentDate = new Date(2024, 5, 15); // June 15, 2024

      fixture.componentRef.setInput('minDate', minDate);
      component['currentDate'].set(currentDate);
      fixture.detectChanges();

      expect(component['isPreviousDisabled']()).toBe(true);
    });

    it('should disable next button when maxDate prevents navigation', () => {
      const maxDate = new Date(2024, 5, 30); // June 30, 2024
      const currentDate = new Date(2024, 5, 15); // June 15, 2024

      fixture.componentRef.setInput('maxDate', maxDate);
      component['currentDate'].set(currentDate);
      fixture.detectChanges();

      expect(component['isNextDisabled']()).toBe(true);
    });

    it('should disable navigation when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component['isPreviousDisabled']()).toBe(true);
      expect(component['isNextDisabled']()).toBe(true);
    });
  });

  describe('Month and Year Selection', () => {
    it('should change month when valid month index is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(initialDate);
      fixture.detectChanges();

      component['onMonthChange']('2'); // March (index 2)

      const currentDate = component['currentDate']();
      expect(currentDate.getMonth()).toBe(2);
      expect(currentDate.getFullYear()).toBe(2024);
    });

    it('should not change month when invalid month index is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(initialDate);
      fixture.detectChanges();

      component['onMonthChange']('invalid');
      component['onMonthChange']('12'); // Invalid month
      component['onMonthChange'](''); // Empty string

      const currentDate = component['currentDate']();
      expect(currentDate.getMonth()).toBe(5); // Should remain June
    });

    it('should change year when valid year is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(initialDate);
      fixture.detectChanges();

      component['onYearChange']('2025');

      const currentDate = component['currentDate']();
      expect(currentDate.getFullYear()).toBe(2025);
      expect(currentDate.getMonth()).toBe(5); // Should remain June
    });

    it('should not change year when invalid year is provided', () => {
      const initialDate = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(initialDate);
      fixture.detectChanges();

      component['onYearChange']('invalid');
      component['onYearChange']('1800'); // Too old
      component['onYearChange']('2200'); // Too new
      component['onYearChange'](''); // Empty string

      const currentDate = component['currentDate']();
      expect(currentDate.getFullYear()).toBe(2024); // Should remain 2024
    });

    it('should return correct current month name', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(date);
      fixture.detectChanges();

      expect(component['getCurrentMonthName']()).toBe('Jun');
    });

    it('should return correct current year', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(date);
      fixture.detectChanges();

      expect(component['getCurrentYear']()).toBe(2024);
    });
  });

  describe('Calendar Days Generation', () => {
    it('should generate calendar days for current month', () => {
      const date = new Date(2024, 0, 1); // January 2024
      component['currentDate'].set(date);
      fixture.detectChanges();

      const calendarDays = component['calendarDays']();
      expect(calendarDays.length).toBeGreaterThan(0);

      // Should include days from previous and next month to fill the grid
      const hasCurrentMonth = calendarDays.some(day => day.isCurrentMonth);
      expect(hasCurrentMonth).toBe(true);
    });

    it('should mark today correctly', () => {
      const today = new Date();
      component['currentDate'].set(new Date(today.getFullYear(), today.getMonth(), 1));
      fixture.detectChanges();

      const calendarDays = component['calendarDays']();
      const todayDay = calendarDays.find(day => day.isToday);

      expect(todayDay).toBeDefined();
      if (todayDay) {
        expect(todayDay.date.getDate()).toBe(today.getDate());
      }
    });

    it('should mark selected date correctly', () => {
      const selectedDate = new Date(2024, 0, 15);
      fixture.componentRef.setInput('value', selectedDate);
      component['currentDate'].set(new Date(2024, 0, 1));
      fixture.detectChanges();

      const calendarDays = component['calendarDays']();
      const selectedDay = calendarDays.find(day => day.isSelected);

      expect(selectedDay).toBeDefined();
      if (selectedDay) {
        expect(selectedDay.date.getDate()).toBe(15);
      }
    });

    it('should mark disabled dates correctly', () => {
      const minDate = new Date(2024, 0, 10);
      const maxDate = new Date(2024, 0, 20);

      fixture.componentRef.setInput('minDate', minDate);
      fixture.componentRef.setInput('maxDate', maxDate);
      component['currentDate'].set(new Date(2024, 0, 1));
      fixture.detectChanges();

      const calendarDays = component['calendarDays']();

      // Dates before minDate should be disabled
      const dayBefore = calendarDays.find(day => day.date.getDate() === 5 && day.isCurrentMonth);
      expect(dayBefore?.isDisabled).toBe(true);

      // Dates after maxDate should be disabled
      const dayAfter = calendarDays.find(day => day.date.getDate() === 25 && day.isCurrentMonth);
      expect(dayAfter?.isDisabled).toBe(true);

      // Dates within range should not be disabled
      const dayWithin = calendarDays.find(day => day.date.getDate() === 15 && day.isCurrentMonth);
      expect(dayWithin?.isDisabled).toBe(false);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes based on size variant', () => {
      fixture.componentRef.setInput('zSize', 'lg');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const calendarDiv = compiled.querySelector('div');
      expect(calendarDiv.className).toContain('text-lg');
    });

    it('should apply custom class', () => {
      fixture.componentRef.setInput('class', 'custom-calendar');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const calendarDiv = compiled.querySelector('div');
      expect(calendarDiv.className).toContain('custom-calendar');
    });

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
      component['currentDate'].set(date);
      fixture.detectChanges();

      expect(component['currentMonthValue']()).toBe('5');
    });

    it('should compute current year value correctly', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(date);
      fixture.detectChanges();

      expect(component['currentYearValue']()).toBe('2024');
    });

    it('should compute current month year correctly', () => {
      const date = new Date(2024, 5, 1); // June 2024
      component['currentDate'].set(date);
      fixture.detectChanges();

      expect(component['currentMonthYear']()).toBe('June 2024');
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

import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardCalendarGridComponent } from './calendar-grid.component';
import type { CalendarDay } from './calendar.types';
import { makeSafeDate } from './calendar.utils';

@Component({
  imports: [ZardCalendarGridComponent],
  standalone: true,
  template: `
    <z-calendar-grid
      [calendarDays]="calendarDays"
      [disabled]="disabled"
      (dateSelect)="onDateSelect($event)"
      (previousMonth)="onPreviousMonth($event)"
      (nextMonth)="onNextMonth($event)"
      (navigateYear)="onNavigateYear($event)"
    />
  `,
})
class TestHostComponent {
  calendarDays: CalendarDay[] = [];
  disabled = false;
  onDateSelect = jest.fn();
  onPreviousMonth = jest.fn();
  onNextMonth = jest.fn();
  onNavigateYear = jest.fn();
}

describe('ZardCalendarGridComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const createMockDays = (count: number, options: Partial<CalendarDay> = {}): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    for (let i = 0; i < count; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() + i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: i === 0,
        isSelected: false,
        isDisabled: false,
        ...options,
      });
    }
    return days;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('creates successfully', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('[role="grid"]'));
    expect(grid).toBeTruthy();
  });

  it('renders weekdays header', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const headers = fixture.debugElement.queryAll(By.css('[role="columnheader"]'));
    expect(headers).toHaveLength(7);

    const expectedWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    headers.forEach((header, index) => {
      expect(header.nativeElement).toHaveTextContent(expectedWeekdays[index]);
    });
  });

  it('renders all calendar days', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons).toHaveLength(35);
  });

  it('displays correct day numbers', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    buttons.forEach((button, index) => {
      const dayNumber = host.calendarDays[index].date.getDate();
      expect(button.nativeElement).toHaveTextContent(dayNumber.toString());
    });
  });

  it('emits dateSelect when day is clicked', () => {
    host.calendarDays = createMockDays(35);
    host.onDateSelect = jest.fn();
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    buttons[5].nativeElement.click();
    fixture.detectChanges();

    expect(host.onDateSelect).toHaveBeenCalledWith({
      date: host.calendarDays[5].date,
      index: 5,
    });
  });

  it('does not emit dateSelect when disabled', () => {
    host.calendarDays = createMockDays(35);
    host.disabled = true;
    host.onDateSelect = jest.fn();
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    buttons[5].nativeElement.click();
    fixture.detectChanges();

    expect(host.onDateSelect).not.toHaveBeenCalled();
  });

  it('navigates to previous month on left arrow key', () => {
    host.calendarDays = createMockDays(35);
    host.onPreviousMonth = jest.fn();
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();

    expect(host.onPreviousMonth).toHaveBeenCalledWith({ position: 'last', dayOfWeek: -1 });
  });

  it('navigates to next month on right arrow key', () => {
    host.calendarDays = createMockDays(35);
    host.onNextMonth = jest.fn();
    fixture.detectChanges();

    // Start at the last day (index 34) to trigger boundary navigation
    const gridComponent = fixture.debugElement.query(By.css('z-calendar-grid'))
      .componentInstance as ZardCalendarGridComponent;
    gridComponent.setFocusedDayIndex(34);
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(host.onNextMonth).toHaveBeenCalledWith({ position: 'first', dayOfWeek: -1 });
  });

  it('navigates to previous month on PageUp key', () => {
    host.calendarDays = createMockDays(35);
    host.onPreviousMonth = jest.fn();
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }));
    fixture.detectChanges();

    expect(host.onPreviousMonth).toHaveBeenCalled();
  });

  it('navigates to next month on PageDown key', () => {
    host.calendarDays = createMockDays(35);
    host.onNextMonth = jest.fn();
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }));
    fixture.detectChanges();

    expect(host.onNextMonth).toHaveBeenCalled();
  });

  it('navigates to previous year on Ctrl+PageUp key', () => {
    host.calendarDays = createMockDays(35);
    host.onNavigateYear = jest.fn();
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', ctrlKey: true }));
    fixture.detectChanges();

    expect(host.onNavigateYear).toHaveBeenCalledWith(-1);
  });

  it('navigates to next year on Ctrl+PageDown key', () => {
    host.calendarDays = createMockDays(35);
    host.onNavigateYear = jest.fn();
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', ctrlKey: true }));
    fixture.detectChanges();

    expect(host.onNavigateYear).toHaveBeenCalledWith(1);
  });

  it('does not respond to keyboard events when disabled', () => {
    host.calendarDays = createMockDays(35);
    host.disabled = true;
    host.onPreviousMonth = jest.fn();
    host.onNextMonth = jest.fn();
    fixture.detectChanges();

    const gridHost = fixture.debugElement.query(By.css('z-calendar-grid')).nativeElement as HTMLElement;
    gridHost.focus();
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    gridHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(host.onPreviousMonth).not.toHaveBeenCalled();
    expect(host.onNextMonth).not.toHaveBeenCalled();
  });

  it('sets correct tabindex for focused day', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[0].nativeElement).toHaveAttribute('tabindex', '0');
    expect(buttons[1].nativeElement).toHaveAttribute('tabindex', '-1');
  });

  it('applies selected class when day is selected', () => {
    const days = createMockDays(35);
    days[10].isSelected = true;
    host.calendarDays = days;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[10].nativeElement).toHaveClass('bg-primary');
    expect(buttons[10].nativeElement).toHaveClass('text-primary-foreground');
  });

  it('applies disabled class when day is disabled', () => {
    const days = createMockDays(35);
    days[15].isDisabled = true;
    host.calendarDays = days;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[15].nativeElement).toHaveAttribute('disabled');
    expect(buttons[15].nativeElement).toHaveClass('opacity-50');
    expect(buttons[15].nativeElement).toHaveClass('cursor-not-allowed');
  });

  it('applies outside class when day is not in current month', () => {
    const days = createMockDays(35);
    days[0].isCurrentMonth = false;
    host.calendarDays = days;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[0].nativeElement).toHaveClass('opacity-50');
  });

  it('applies range styles when day is in range', () => {
    const days = createMockDays(35);
    days[5].isRangeStart = true;
    days[10].isInRange = true;
    days[15].isRangeEnd = true;
    host.calendarDays = days;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[5].nativeElement).toHaveClass('rounded-r-none');
    expect(buttons[10].nativeElement).toHaveClass('rounded-none');
    expect(buttons[15].nativeElement).toHaveClass('rounded-l-none');
  });

  it('sets aria-selected attribute correctly', () => {
    const days = createMockDays(35);
    days[7].isSelected = true;
    host.calendarDays = days;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[7].nativeElement).toHaveAttribute('aria-selected', 'true');
    expect(buttons[0].nativeElement).toHaveAttribute('aria-selected', 'false');
  });

  it('generates correct day IDs', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i].nativeElement).toHaveAttribute('id', `calendar-day-${i}`);
    }
  });

  it('generates correct ARIA labels', () => {
    const today = makeSafeDate(2024, 1, 15);
    const mockDay: CalendarDay = {
      date: today,
      isCurrentMonth: true,
      isToday: true,
      isSelected: true,
      isDisabled: false,
    };

    host.calendarDays = [mockDay];
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[role="button"]'));
    const ariaLabel = button.nativeElement.getAttribute('aria-label');

    expect(ariaLabel).toContain('Thursday');
    expect(ariaLabel).toContain('February');
    expect(ariaLabel).toContain('2024');
    expect(ariaLabel).toContain('Today');
    expect(ariaLabel).toContain('Selected');
  });

  it('generates correct ARIA labels for disabled days', () => {
    const today = makeSafeDate(2024, 1, 15);
    const mockDay: CalendarDay = {
      date: today,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: true,
    };

    host.calendarDays = [mockDay];
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[role="button"]'));
    const ariaLabel = button.nativeElement.getAttribute('aria-label');

    expect(ariaLabel).toContain('Disabled');
  });

  it('generates correct ARIA labels for range days', () => {
    const today = makeSafeDate(2024, 1, 15);
    const mockDay: CalendarDay = {
      date: today,
      isCurrentMonth: true,
      isToday: false,
      isSelected: true,
      isDisabled: false,
      isRangeStart: true,
      isRangeEnd: false,
      isInRange: false,
    };

    host.calendarDays = [mockDay];
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[role="button"]'));
    const ariaLabel = button.nativeElement.getAttribute('aria-label');

    expect(ariaLabel).toContain('Range start');
  });

  it('applies today styling when day is today', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('[role="button"]'));
    expect(buttons[0].nativeElement).toHaveClass('bg-accent');
  });

  it('has public methods setFocusedDayIndex and resetFocus', () => {
    host.calendarDays = createMockDays(35);
    fixture.detectChanges();

    const gridComponent = fixture.debugElement.query(By.css('z-calendar-grid'))
      .componentInstance as ZardCalendarGridComponent;

    expect(typeof gridComponent.setFocusedDayIndex).toBe('function');
    expect(typeof gridComponent.resetFocus).toBe('function');
  });

  it('handles empty calendar days', () => {
    host.calendarDays = [];
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('[role="grid"]'));
    expect(grid).toBeTruthy();
  });
});

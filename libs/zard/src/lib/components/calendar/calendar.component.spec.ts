import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CalendarUtilsService } from './services/calendar-utils.service';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let calendarUtilsService: CalendarUtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [CalendarUtilsService],
    }).compileComponents();

    calendarUtilsService = TestBed.inject(CalendarUtilsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default month view', () => {
    expect(component.currentView).toBe('month');
    expect(component.monthData.weeks.length).toBeGreaterThan(0);
  });

  it('should switch views when view buttons are clicked', () => {
    // Get view buttons
    const viewButtons = fixture.debugElement.queryAll(By.css('.z-calendar-view-btn'));

    // Click week view button
    viewButtons[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.currentView).toBe('week');

    // Click day view button
    viewButtons[2].nativeElement.click();
    fixture.detectChanges();
    expect(component.currentView).toBe('day');

    // Click month view button
    viewButtons[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.currentView).toBe('month');
  });

  it('should navigate to previous and next periods', () => {
    const initialDate = new Date(component.currentDate);

    // Click previous button
    const prevButton = fixture.debugElement.query(By.css('.z-calendar-nav-btn:first-child'));
    prevButton.nativeElement.click();
    fixture.detectChanges();

    // In month view, should go back one month
    expect(component.currentDate.getMonth()).toBe(
      (initialDate.getMonth() + 11) % 12, // Handle December to January case
    );

    // Click next button twice to advance one month from initial
    const nextButton = fixture.debugElement.query(By.css('.z-calendar-nav-btn:nth-child(3)'));
    nextButton.nativeElement.click();
    nextButton.nativeElement.click();
    fixture.detectChanges();

    // Should be one month ahead of initial date
    expect(component.currentDate.getMonth()).toBe(
      (initialDate.getMonth() + 1) % 12, // Handle December to January case
    );
  });

  it('should toggle date selection when a date is clicked', () => {
    // Initial selection should be empty
    expect(component.selectedDates.length).toBe(0);

    // Spy on the dateSelected output
    const dateSelectedSpy = spyOn(component.dateSelected, 'emit');

    // Click on a date in the current month
    const dateCell = fixture.debugElement.query(By.css('.z-calendar-day:not(.outside-month)'));
    dateCell.nativeElement.click();
    fixture.detectChanges();

    // Should have one selected date
    expect(component.selectedDates.length).toBe(1);
    expect(dateSelectedSpy).toHaveBeenCalled();

    // Click the same date again to deselect
    dateCell.nativeElement.click();
    fixture.detectChanges();

    // Should have no selected dates
    expect(component.selectedDates.length).toBe(0);
    expect(dateSelectedSpy).toHaveBeenCalledTimes(2);
  });
});

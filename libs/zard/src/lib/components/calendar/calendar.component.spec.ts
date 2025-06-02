import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CalendarComponent } from './calendar.component';
import { CalendarUtilsService } from './services/calendar-utils.service';

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
    const viewButtons = fixture.debugElement.queryAll(By.css('.z-calendar-view-btn'));

    viewButtons[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.currentView).toBe('week');

    viewButtons[2].nativeElement.click();
    fixture.detectChanges();
    expect(component.currentView).toBe('day');

    viewButtons[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.currentView).toBe('month');
  });

  it('should navigate to previous and next periods', () => {
    const initialDate = new Date(component.currentDate);

    const prevButton = fixture.debugElement.query(By.css('.z-calendar-nav-btn:first-child'));
    prevButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.currentDate.getMonth()).toBe((initialDate.getMonth() + 11) % 12);

    const nextButton = fixture.debugElement.query(By.css('.z-calendar-nav-btn:nth-child(3)'));
    nextButton.nativeElement.click();
    nextButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.currentDate.getMonth()).toBe((initialDate.getMonth() + 1) % 12);
  });

  it('should toggle date selection when a date is clicked', () => {
    expect(component.selectedDates.length).toBe(0);

    const dateSelectedSpy = jest.spyOn(component.dateSelected, 'emit');

    const dateCell = fixture.debugElement.query(By.css('.z-calendar-day:not(.outside-month)'));
    dateCell.nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedDates.length).toBe(1);

    expect(dateSelectedSpy).toHaveBeenCalledTimes(1);
  });
});

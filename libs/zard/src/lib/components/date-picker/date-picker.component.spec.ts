import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDatePickerComponent } from './date-picker.component';
import { ZardEventManagerPlugin } from '../core/provider/event-manager-plugins/zard-event-manager-plugin';

describe('ZardDatePickerComponent', () => {
  let component: ZardDatePickerComponent;
  let fixture: ComponentFixture<ZardDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDatePickerComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display placeholder when no date is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toContain('Pick a date');
  });

  it('should format and display selected date', () => {
    const testDate = new Date(2024, 0, 15); // January 15, 2024
    fixture.componentRef.setInput('value', testDate);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toContain('January 15, 2024');
  });

  it('should emit dateChange when calendar date is selected', () => {
    const testDate = new Date(2024, 0, 15);
    let emittedDate: Date | null = null;

    component.dateChange.subscribe(date => {
      emittedDate = date;
    });

    component['onDateChange'](testDate);

    expect(emittedDate).toEqual(testDate);
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('should format date using custom zFormat', () => {
    const testDate = new Date(2024, 0, 15); // January 15, 2024
    fixture.componentRef.setInput('value', testDate);
    fixture.componentRef.setInput('zFormat', 'MM/dd/yyyy');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toContain('01/15/2024');
  });

  it('should format date using European format', () => {
    const testDate = new Date(2024, 0, 15); // January 15, 2024
    fixture.componentRef.setInput('value', testDate);
    fixture.componentRef.setInput('zFormat', 'dd-MM-yyyy');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toContain('15-01-2024');
  });

  it('should format date with day names', () => {
    const testDate = new Date(2024, 0, 15); // January 15, 2024 (Monday)
    fixture.componentRef.setInput('value', testDate);
    fixture.componentRef.setInput('zFormat', 'EEE, MMM d');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toContain('Mon, Jan 15');
  });
});

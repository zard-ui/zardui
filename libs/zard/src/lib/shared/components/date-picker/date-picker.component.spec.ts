import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardDatePickerComponent } from './date-picker.component';

describe('ZardDatePickerComponent', () => {
  let component: ZardDatePickerComponent;
  let fixture: ComponentFixture<ZardDatePickerComponent>;

  const trigger = () => (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  const triggerText = () => trigger().textContent?.trim();
  const host = () => fixture.nativeElement as HTMLElement;

  /** The popover renders into the overlay container, outside the fixture. */
  const openPopover = async () => {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    return document.querySelector('.cdk-overlay-container z-calendar') as HTMLElement | null;
  };

  const dayButton = (day: string) => {
    const cells = Array.from(
      document.querySelectorAll('.cdk-overlay-container [role="gridcell"]:not([data-outside]) button'),
    ) as HTMLButtonElement[];

    return cells.find(cell => cell.textContent?.trim() === day) as HTMLButtonElement;
  };

  const clickDay = async (day: string) => {
    dayButton(day).click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const setValue = (value: CalendarValue) => {
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
  };

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

  describe('trigger label', () => {
    it('should display the placeholder when no date is selected', () => {
      expect(triggerText()).toContain('Pick a date');
    });

    it('should display a custom zPlaceholder', () => {
      fixture.componentRef.setInput('zPlaceholder', 'Select date');
      fixture.detectChanges();

      expect(triggerText()).toContain('Select date');
    });

    it('should mark itself empty while nothing is selected', () => {
      expect(host().getAttribute('data-empty')).toBe('true');
      expect(trigger().getAttribute('data-empty')).toBe('true');
    });

    it('should drop the empty flag once a date is selected', () => {
      setValue(new Date(2024, 0, 15));

      expect(host().getAttribute('data-empty')).toBeNull();
      expect(trigger().getAttribute('data-empty')).toBeNull();
    });

    it('should format the selected date', () => {
      setValue(new Date(2024, 0, 15));

      expect(triggerText()).toContain('January 15, 2024');
    });

    it.each([
      ['MM/dd/yyyy', '01/15/2024'],
      ['dd-MM-yyyy', '15-01-2024'],
      ['yyyy-MM-dd', '2024-01-15'],
      ['EEE, MMM d', 'Mon, Jan 15'],
    ])('should format the selected date with %s', (format, expected) => {
      setValue(new Date(2024, 0, 15));
      fixture.componentRef.setInput('zFormat', format);
      fixture.detectChanges();

      expect(triggerText()).toContain(expected);
    });

    it('should ignore an invalid date', () => {
      setValue(new Date('nope'));

      expect(triggerText()).toContain('Pick a date');
      expect(host().getAttribute('data-empty')).toBe('true');
    });

    it('should join both ends of a range', () => {
      fixture.componentRef.setInput('zMode', 'range');
      fixture.componentRef.setInput('zFormat', 'MMM dd, y');
      setValue([new Date(2024, 0, 20), new Date(2024, 1, 9)]);

      expect(triggerText()).toBe('Jan 20, 2024 - Feb 09, 2024');
    });

    it('should show only the start of an incomplete range', () => {
      fixture.componentRef.setInput('zMode', 'range');
      fixture.componentRef.setInput('zFormat', 'MMM dd, y');
      setValue([new Date(2024, 0, 20)]);

      expect(triggerText()).toBe('Jan 20, 2024');
    });

    it('should join every date selected in multiple mode', () => {
      fixture.componentRef.setInput('zMode', 'multiple');
      fixture.componentRef.setInput('zFormat', 'MMM d');
      setValue([new Date(2024, 0, 20), new Date(2024, 0, 22)]);

      expect(triggerText()).toBe('Jan 20, Jan 22');
    });
  });

  describe('trigger styling', () => {
    it('should own the width on the host, so a single class resizes it', () => {
      expect(host().className).toContain('w-[212px]');

      fixture.componentRef.setInput('class', 'w-44');
      fixture.detectChanges();

      expect(host().className).toContain('w-44');
      expect(host().className).not.toContain('w-[212px]');
    });

    it('should render a trailing chevron by default', () => {
      const icon = trigger().querySelector('ng-icon');

      expect(icon?.getAttribute('data-icon')).toBe('inline-end');
      expect(trigger().className).toContain('justify-between');
    });

    it('should render a leading calendar icon when asked', () => {
      fixture.componentRef.setInput('zIcon', 'calendar');
      fixture.detectChanges();

      const icon = trigger().querySelector('ng-icon');

      expect(icon?.getAttribute('data-icon')).toBe('inline-start');
      expect(trigger().className).toContain('justify-start');
    });

    it('should render no icon at all when asked', () => {
      fixture.componentRef.setInput('zIcon', 'none');
      fixture.detectChanges();

      expect(trigger().querySelector('ng-icon')).toBeNull();
      expect(trigger().className).toContain('justify-start');
    });

    it('should follow the button size scale', () => {
      expect(trigger().getAttribute('data-size')).toBe('default');

      fixture.componentRef.setInput('zSize', 'lg');
      fixture.detectChanges();

      expect(trigger().getAttribute('data-size')).toBe('lg');
      expect(trigger().className).toContain('h-9');
    });

    it('should apply the disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(trigger().disabled).toBe(true);
    });
  });

  describe('labelling', () => {
    it('should label itself when there is no external label', () => {
      expect(trigger().getAttribute('aria-label')).toBe('Choose date');
    });

    it('should step aside once zId points a label at the trigger', () => {
      fixture.componentRef.setInput('zId', 'date-picker');
      fixture.detectChanges();

      expect(trigger().id).toBe('date-picker');
      expect(trigger().getAttribute('aria-label')).toBeNull();
    });
  });

  describe('popover', () => {
    it('should render the calendar with its own root styling', async () => {
      const calendar = await openPopover();

      expect(calendar).toBeTruthy();
      expect(calendar?.getAttribute('data-slot')).toBe('calendar');
      // Without these the cell sizing collapses inside the popover.
      expect(calendar?.className).toContain('[--cell-size:--spacing(7)]');
      expect(calendar?.className).toContain('p-2');
    });

    it('should render a plain caption by default', async () => {
      const calendar = await openPopover();

      expect(calendar?.querySelectorAll('select')).toHaveLength(0);
    });

    it('should forward zCaptionLayout to the calendar', async () => {
      fixture.componentRef.setInput('zCaptionLayout', 'dropdown');
      fixture.detectChanges();

      const calendar = await openPopover();

      expect(calendar?.querySelectorAll('select')).toHaveLength(2);
    });

    it('should forward zNumberOfMonths to the calendar', async () => {
      fixture.componentRef.setInput('zNumberOfMonths', 2);
      fixture.detectChanges();

      const calendar = await openPopover();

      expect(calendar?.querySelectorAll('z-calendar-grid')).toHaveLength(2);
    });

    it('should open on the month of the selected value', async () => {
      setValue(new Date(2020, 4, 10));

      const calendar = await openPopover();

      expect(calendar?.textContent).toContain('May 2020');
    });

    it('should forward zDisabledDates to the calendar', async () => {
      setValue(new Date(2024, 0, 15));
      fixture.componentRef.setInput('zDisabledDates', [new Date(2024, 0, 20)]);
      fixture.detectChanges();

      await openPopover();

      expect(dayButton('20').disabled).toBe(true);
    });
  });

  describe('selection', () => {
    it('should select a date, emit it and close the popover', async () => {
      const emitted: CalendarValue[] = [];
      component.dateChange.subscribe(value => emitted.push(value));

      setValue(new Date(2024, 0, 1));
      await openPopover();
      await clickDay('15');

      expect(component.value()).toEqual(new Date(2024, 0, 15));
      expect(emitted).toEqual([new Date(2024, 0, 15)]);
      expect(document.querySelector('.cdk-overlay-container z-calendar')).toBeNull();
    });

    it('should keep the popover open until both ends of a range are set', async () => {
      fixture.componentRef.setInput('zMode', 'range');
      setValue(null);

      await openPopover();
      await clickDay('10');

      expect(document.querySelector('.cdk-overlay-container z-calendar')).toBeTruthy();

      await clickDay('20');

      expect(document.querySelector('.cdk-overlay-container z-calendar')).toBeNull();
      expect((component.value() as Date[]).map(date => date.getDate())).toEqual([10, 20]);
    });

    it('should stay open in multiple mode', async () => {
      fixture.componentRef.setInput('zMode', 'multiple');
      setValue(null);

      await openPopover();
      await clickDay('10');
      await clickDay('20');

      expect(document.querySelector('.cdk-overlay-container z-calendar')).toBeTruthy();
      expect((component.value() as Date[]).map(date => date.getDate())).toEqual([10, 20]);
    });
  });

  describe('control value accessor', () => {
    it('should write and report the value', async () => {
      const onChange = jest.fn();
      const onTouched = jest.fn();
      component.registerOnChange(onChange);
      component.registerOnTouched(onTouched);

      component.writeValue(new Date(2024, 0, 1));
      fixture.detectChanges();

      expect(triggerText()).toContain('January 1, 2024');

      await openPopover();
      await clickDay('15');

      expect(onChange).toHaveBeenCalledWith(new Date(2024, 0, 15));
      expect(onTouched).toHaveBeenCalled();
    });

    it('should apply the disabled state coming from the form control', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(trigger().disabled).toBe(true);
    });
  });
});

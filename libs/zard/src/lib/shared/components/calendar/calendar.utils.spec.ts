import type { CalendarDay, CalendarDayConfig } from './calendar.types';
import { generateCalendarDays, getDayAriaLabel, isDateDisabled } from './calendar.utils';

describe('Calendar Utilities', () => {
  describe('generateCalendarDays with weekStartsOn', () => {
    const baseConfig: CalendarDayConfig = {
      year: 2024,
      month: 9,
      mode: 'single',
      selectedDates: [],
      minDate: null,
      maxDate: null,
      disabled: false,
    };

    it('aligns the grid to Sunday when weekStartsOn = 0', () => {
      const days = generateCalendarDays({ ...baseConfig, weekStartsOn: 0 });
      expect(days.length % 7).toBe(0);
      expect(days[0].date.getDay()).toBe(0);
      expect(days[days.length - 1].date.getDay()).toBe(6);
      expect(days[0].date.getDate()).toBe(29);
      expect(days[0].isCurrentMonth).toBe(false);
    });

    it('aligns the grid to Monday when weekStartsOn = 1', () => {
      const days = generateCalendarDays({ ...baseConfig, weekStartsOn: 1 });
      expect(days.length % 7).toBe(0);
      expect(days[0].date.getDay()).toBe(1);
      expect(days[days.length - 1].date.getDay()).toBe(0);
      expect(days[0].date.getDate()).toBe(30);
      expect(days[0].isCurrentMonth).toBe(false);
    });

    it('aligns the grid to Saturday when weekStartsOn = 6', () => {
      const days = generateCalendarDays({ ...baseConfig, weekStartsOn: 6 });
      expect(days.length % 7).toBe(0);
      expect(days[0].date.getDay()).toBe(6);
      expect(days[days.length - 1].date.getDay()).toBe(5);
    });

    it('defaults weekStartsOn to 0 when omitted', () => {
      const days = generateCalendarDays(baseConfig);
      expect(days[0].date.getDay()).toBe(0);
      expect(days[days.length - 1].date.getDay()).toBe(6);
    });
  });

  describe('generateCalendarDays with minDate and maxDate', () => {
    const baseConfig: CalendarDayConfig = {
      year: 2024,
      month: 9,
      mode: 'single',
      selectedDates: [],
      minDate: null,
      maxDate: null,
      disabled: false,
    };

    const findDay = (days: CalendarDay[], date: number) =>
      days.find(day => day.isCurrentMonth && day.date.getDate() === date);

    it('keeps the minDate day enabled when minDate carries a time of day', () => {
      const days = generateCalendarDays({ ...baseConfig, minDate: new Date(2024, 9, 15, 14, 30) });

      expect(findDay(days, 14)?.isDisabled).toBe(true);
      expect(findDay(days, 15)?.isDisabled).toBe(false);
    });

    it('keeps the maxDate day enabled when maxDate carries a time of day', () => {
      const days = generateCalendarDays({ ...baseConfig, maxDate: new Date(2024, 9, 15, 14, 30) });

      expect(findDay(days, 15)?.isDisabled).toBe(false);
      expect(findDay(days, 16)?.isDisabled).toBe(true);
    });

    it('compares bounds by day for years below 100', () => {
      const maxDate = new Date(2024, 0, 1);
      maxDate.setFullYear(99);
      const candidate = new Date(2024, 0, 1);
      candidate.setFullYear(1900);

      expect(isDateDisabled(candidate, null, maxDate)).toBe(true);
    });
  });

  describe('getDayAriaLabel with localization and custom labels', () => {
    const mockDay: CalendarDay = {
      date: new Date(2024, 7, 15),
      isCurrentMonth: true,
      isToday: true,
      isSelected: true,
      isDisabled: false,
    };

    it('formats in en-US by default with standard labels', () => {
      const label = getDayAriaLabel(mockDay);
      expect(label).toContain('August 15, 2024');
      expect(label).toContain('Today');
      expect(label).toContain('Selected');
    });

    it('formats date and labels using French locale and translations', () => {
      const frLabels = {
        today: "Aujourd'hui",
        selected: 'Sélectionné',
      };
      const label = getDayAriaLabel(mockDay, 'fr-FR', frLabels);
      expect(label).toContain('août 2024');
      expect(label).toContain("Aujourd'hui");
      expect(label).toContain('Sélectionné');
    });

    it('formats range states with custom labels', () => {
      const rangeDay: CalendarDay = {
        date: new Date(2024, 7, 10),
        isCurrentMonth: true,
        isToday: false,
        isSelected: true,
        isDisabled: false,
        isRangeStart: true,
      };

      const customLabels = {
        rangeStart: 'Début de sélection',
      };

      const label = getDayAriaLabel(rangeDay, 'fr-FR', customLabels);
      expect(label).toContain('Début de sélection');
    });

    it('formats outside month and disabled states', () => {
      const outsideDisabledDay: CalendarDay = {
        date: new Date(2024, 6, 31),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: true,
      };

      const customLabels = {
        outsideMonth: 'Hors mois',
        disabled: 'Inactif',
      };

      const label = getDayAriaLabel(outsideDisabledDay, 'fr-FR', customLabels);
      expect(label).toContain('Hors mois');
      expect(label).toContain('Inactif');
    });
  });
});

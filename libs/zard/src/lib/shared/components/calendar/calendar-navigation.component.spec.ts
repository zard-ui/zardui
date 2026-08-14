import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { ZardCalendarNavigationComponent } from './calendar-navigation.component';
import type { ZardCalendarCaptionLayout } from './calendar.types';

const defaultInputs = {
  currentMonth: '0',
  currentYear: '2024',
  minDate: null,
  maxDate: null,
  disabled: false,
};

function renderNavigation(inputs: Partial<Record<string, unknown>> = {}) {
  return render(ZardCalendarNavigationComponent, {
    inputs: { ...defaultInputs, ...inputs },
  });
}

describe('ZardCalendarNavigationComponent', () => {
  it('renders the month and year as a single label by default', async () => {
    const { container } = await renderNavigation();

    expect(screen.getByText('January 2024')).toBeInTheDocument();
    expect(container.querySelectorAll('select')).toHaveLength(0);
  });

  it('renders month and year selects when captionLayout is dropdown', async () => {
    const { container } = await renderNavigation({ zCaptionLayout: 'dropdown' as ZardCalendarCaptionLayout });

    const selects = [...container.querySelectorAll('select')];

    expect(selects).toHaveLength(2);
    expect(selects.map(select => select.value)).toEqual(['0', '2024']);
    expect(selects.map(select => select.getAttribute('aria-label'))).toEqual(['Choose the month', 'Choose the year']);
  });

  it('lists every month and the available years as native options', async () => {
    const { container } = await renderNavigation({ zCaptionLayout: 'dropdown' as ZardCalendarCaptionLayout });

    const [monthSelect, yearSelect] = container.querySelectorAll('select');

    expect(monthSelect.options).toHaveLength(12);
    expect(monthSelect.options[0].textContent?.trim()).toBe('Jan');
    expect(yearSelect.options.length).toBeGreaterThan(0);
  });

  it('renders only the month select when captionLayout is dropdown-months', async () => {
    const { container } = await renderNavigation({ zCaptionLayout: 'dropdown-months' as ZardCalendarCaptionLayout });

    expect(container.querySelectorAll('select')).toHaveLength(1);
    expect(container.querySelector('select')?.getAttribute('aria-label')).toBe('Choose the month');
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders only the year select when captionLayout is dropdown-years', async () => {
    const { container } = await renderNavigation({ zCaptionLayout: 'dropdown-years' as ZardCalendarCaptionLayout });

    expect(container.querySelectorAll('select')).toHaveLength(1);
    expect(container.querySelector('select')?.getAttribute('aria-label')).toBe('Choose the year');
    expect(screen.getByText('January')).toBeInTheDocument();
  });

  it('emits the picked month when the native select changes', async () => {
    const monthChangeSpy = jest.fn();
    const { container, fixture } = await renderNavigation({
      zCaptionLayout: 'dropdown' as ZardCalendarCaptionLayout,
    });
    fixture.componentInstance.monthChange.subscribe(monthChangeSpy);

    await userEvent.selectOptions(container.querySelector('select') as HTMLSelectElement, '4');

    expect(monthChangeSpy).toHaveBeenCalledWith('4');
  });

  it('disables the native selects when the calendar is disabled', async () => {
    const { container } = await renderNavigation({
      zCaptionLayout: 'dropdown' as ZardCalendarCaptionLayout,
      disabled: true,
    });

    expect([...container.querySelectorAll('select')].every(select => select.disabled)).toBe(true);
  });

  it('navigates to previous month when previous button is clicked', async () => {
    const previousMonthSpy = jest.fn();
    const { fixture } = await renderNavigation({ currentMonth: '5' });
    fixture.componentInstance.previousMonth.subscribe(previousMonthSpy);

    await userEvent.click(screen.getByRole('button', { name: /previous month/i }));

    expect(previousMonthSpy).toHaveBeenCalled();
  });

  it('navigates to next month when next button is clicked', async () => {
    const nextMonthSpy = jest.fn();
    const { fixture } = await renderNavigation({ currentMonth: '5' });
    fixture.componentInstance.nextMonth.subscribe(nextMonthSpy);

    await userEvent.click(screen.getByRole('button', { name: /next month/i }));

    expect(nextMonthSpy).toHaveBeenCalled();
  });

  it('applies correct navigation classes', async () => {
    await renderNavigation();

    const navContainer = screen.getByRole('button', { name: /previous month/i }).parentElement;
    expect(navContainer).toHaveClass('flex');
    expect(navContainer).toHaveClass('items-center');
    expect(navContainer).toHaveClass('justify-between');
    // The nav floats over the caption, which is what centers the label.
    expect(navContainer).toHaveClass('absolute');
  });

  it('sizes the arrows from the cell size', async () => {
    await renderNavigation();

    const prevButton = screen.getByRole('button', { name: /previous month/i });
    expect(prevButton).toHaveClass('size-(--cell-size)');
    expect(prevButton).toHaveClass('p-0');
  });

  it('applies zButtonVariant to the navigation arrows', async () => {
    await renderNavigation({ zButtonVariant: 'outline' });

    const prevButton = screen.getByRole('button', { name: /previous month/i });
    const nextButton = screen.getByRole('button', { name: /next month/i });

    expect(prevButton).toHaveAttribute('data-variant', 'outline');
    expect(nextButton).toHaveAttribute('data-variant', 'outline');
  });

  it('defaults the navigation arrows to the ghost variant', async () => {
    await renderNavigation();

    expect(screen.getByRole('button', { name: /previous month/i })).toHaveAttribute('data-variant', 'ghost');
  });

  it('disables both arrows when the calendar is disabled', async () => {
    await renderNavigation({ disabled: true });

    expect(screen.getByRole('button', { name: /previous month/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next month/i })).toBeDisabled();
  });

  it('replaces a hidden arrow with a spacer so the caption stays centered', async () => {
    const { container } = await renderNavigation({ zShowPreviousButton: false });

    expect(screen.queryByRole('button', { name: /previous month/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();

    const spacer = container.querySelector('[aria-hidden="true"]');
    expect(spacer).toBeInTheDocument();
    expect(spacer?.className).toContain('size-(--cell-size)');
  });

  it('names the month in English regardless of the runtime locale', async () => {
    await renderNavigation({ currentMonth: '7' });

    expect(screen.getByText('August 2024')).toBeInTheDocument();
  });
});

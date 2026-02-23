import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { ZardCalendarNavigationComponent } from './calendar-navigation.component';

describe('ZardCalendarNavigationComponent', () => {
  it('renders with correct month and year display', async () => {
    await render(ZardCalendarNavigationComponent, {
      inputs: {
        currentMonth: '0',
        currentYear: '2024',
        minDate: null,
        maxDate: null,
        disabled: false,
      },
    });

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('navigates to previous month when previous button is clicked', async () => {
    const previousMonthSpy = jest.fn();
    await render(ZardCalendarNavigationComponent, {
      inputs: {
        currentMonth: '5',
        currentYear: '2024',
        minDate: null,
        maxDate: null,
        disabled: false,
      },
      componentProperties: {
        previousMonth: { emit: previousMonthSpy } as any,
      },
    });

    const prevButton = screen.getByRole('button', { name: /previous month/i });
    await userEvent.click(prevButton);

    expect(previousMonthSpy).toHaveBeenCalled();
  });

  it('navigates to next month when next button is clicked', async () => {
    const nextMonthSpy = jest.fn();
    await render(ZardCalendarNavigationComponent, {
      inputs: {
        currentMonth: '5',
        currentYear: '2024',
        minDate: null,
        maxDate: null,
        disabled: false,
      },
      componentProperties: {
        nextMonth: { emit: nextMonthSpy } as any,
      },
    });

    const nextButton = screen.getByRole('button', { name: /next month/i });
    await userEvent.click(nextButton);

    expect(nextMonthSpy).toHaveBeenCalled();
  });

  it('applies correct navigation classes', async () => {
    await render(ZardCalendarNavigationComponent, {
      inputs: {
        currentMonth: '0',
        currentYear: '2024',
        minDate: null,
        maxDate: null,
        disabled: false,
      },
    });

    const navContainer = screen.getByRole('button', { name: /previous month/i }).parentElement;
    expect(navContainer).toHaveClass('flex');
    expect(navContainer).toHaveClass('items-center');
    expect(navContainer).toHaveClass('justify-between');
  });
});

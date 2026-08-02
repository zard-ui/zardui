import { Component } from '@angular/core';

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardPaginationComponent } from './pagination.component';

@Component({
  imports: [ZardPaginationComponent],
  template: `
    <z-pagination [(zPageIndex)]="pageIndex" [zTotal]="totalPages" zSize="icon" [class]="customClass" />
    <p data-testid="page-index">Page: {{ pageIndex }}</p>
  `,
})
class TestHostComponent {
  pageIndex = 1;
  totalPages = 5;
  customClass = 'custom-pagination-class';
}

function getNavButton(name: RegExp): HTMLButtonElement {
  const buttons = screen.getAllByRole('button', { name });
  return (buttons.find(btn => btn.hasAttribute('z-pagination-button')) ?? buttons[0]) as HTMLButtonElement;
}

describe('ZardPaginationComponent', () => {
  it('renders correct number of list items including prev and next', async () => {
    await render(TestHostComponent);

    const pagination = screen.getByRole('group', { name: 'Pagination' });
    const listItems = within(pagination).getAllByRole('listitem');

    expect(listItems.length).toBe(7);
  });

  it('highlights current page with aria-current', async () => {
    await render(TestHostComponent);

    const pagination = screen.getByRole('group', { name: 'Pagination' });
    const activeButton = within(pagination).getAllByRole('button', { current: 'page' })[0];

    expect(activeButton).toBeInTheDocument();
    expect(activeButton).toHaveTextContent('1');
  });

  it('updates pageIndex when clicking a different page button', async () => {
    const r = await render(TestHostComponent);
    const page3Button = getNavButton(/To page 3/);

    await userEvent.click(page3Button);
    r.fixture.detectChanges();

    expect(r.fixture.componentInstance.pageIndex).toBe(3);
  });

  it('does not update pageIndex when clicking the active page button', async () => {
    const r = await render(TestHostComponent);
    const initialPage = r.fixture.componentInstance.pageIndex;

    const activeButton = getNavButton(/To page 1/);
    await userEvent.click(activeButton);
    r.fixture.detectChanges();

    expect(r.fixture.componentInstance.pageIndex).toBe(initialPage);
  });

  it('indicates last page for screen reader', async () => {
    const r = await render(TestHostComponent);
    const lastPageButton = getNavButton(/To last page, page 5/);

    expect(lastPageButton).toBeInTheDocument();

    await userEvent.click(lastPageButton);
    r.fixture.detectChanges();

    expect(r.fixture.componentInstance.pageIndex).toBe(5);
  });

  it('disables Previous button on first page', async () => {
    await render(TestHostComponent);

    const prevButton = getNavButton(/To previous page/);

    expect(prevButton).toBeDisabled();
  });

  it('enables Previous button on page > 1 and navigates back', async () => {
    const r = await render(TestHostComponent);
    r.fixture.componentInstance.pageIndex = 2;
    r.fixture.detectChanges();

    const prevButton = getNavButton(/To previous page/);
    expect(prevButton).not.toBeDisabled();

    await userEvent.click(prevButton);
    r.fixture.detectChanges();

    expect(r.fixture.componentInstance.pageIndex).toBe(1);
  });

  it('disables Next button on last page', async () => {
    const r = await render(TestHostComponent);
    r.fixture.componentInstance.pageIndex = r.fixture.componentInstance.totalPages;
    r.fixture.detectChanges();

    const nextButton = getNavButton(/To next page/);
    expect(nextButton).toBeDisabled();
  });

  it('enables Next button on page < total and navigates forward', async () => {
    const r = await render(TestHostComponent);
    r.fixture.componentInstance.pageIndex = r.fixture.componentInstance.totalPages - 1;
    r.fixture.detectChanges();

    const nextButton = getNavButton(/To next page/);
    expect(nextButton).not.toBeDisabled();

    await userEvent.click(nextButton);
    r.fixture.detectChanges();

    expect(r.fixture.componentInstance.pageIndex).toBe(r.fixture.componentInstance.totalPages);
  });

  it('applies custom class to pagination root element', async () => {
    await render(TestHostComponent);

    const pagination = screen.getByRole('group', { name: 'Pagination' });

    expect(pagination).toHaveClass('custom-pagination-class');
  });
});

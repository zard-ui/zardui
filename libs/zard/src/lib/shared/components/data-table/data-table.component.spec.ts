import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import {
  columnPinningFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRenderComponent,
  injectTable,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table';
import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardDataTableColumnHeaderComponent } from './data-table-column-header.component';
import type { ZardDataTableColumnMeta } from './data-table.component';
import { ZardDataTableImports } from './data-table.imports';

interface Person {
  name: string;
  age: number;
}

const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

const helper = createColumnHelper<typeof features, Person>();

const columns = helper.columns([
  helper.accessor('name', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Name' } }),
  }),
  helper.accessor('age', { header: 'Age' }),
]);

const PEOPLE: Person[] = [
  { name: 'Charlie', age: 35 },
  { name: 'Ada', age: 36 },
  { name: 'Bea', age: 28 },
];

@Component({
  selector: 'z-test-data-table',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table-view-options [zTable]="table" />
    <z-data-table [zTable]="table" />
    <z-data-table-pagination [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestDataTableComponent {
  readonly data = signal<Person[]>(PEOPLE);
  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
  }));
}

/** `click.prevent-with-stop` on the dropdown triggers comes from the zard event plugin (provideZard in apps). */
function renderTable() {
  return render(TestDataTableComponent, {
    providers: [{ provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true }],
  });
}

/** A table with no paging, to exercise the meta classes, expansion, pinning and loading. */
const extraFeatures = tableFeatures({
  columnPinningFeature,
  rowExpandingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnMeta: {} as ZardDataTableColumnMeta,
});

const extraHelper = createColumnHelper<typeof extraFeatures, Person>();

const extraColumns = extraHelper.columns([
  extraHelper.accessor('name', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Name' } }),
  }),
  extraHelper.accessor('age', { header: 'Age', meta: { headerClass: 'text-end', cellClass: 'text-end tabular-nums' } }),
]);

@Component({
  selector: 'z-test-data-table-extras',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" [zExpandedRow]="detail" [zLoading]="loading()" />
    <ng-template #detail let-row>Details of {{ row.original.name }}</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestDataTableExtrasComponent {
  readonly loading = signal(false);
  readonly table = injectTable(() => ({
    features: extraFeatures,
    columns: extraColumns,
    data: PEOPLE,
    getRowId: row => row.name,
    getRowCanExpand: () => true,
    initialState: { columnPinning: { start: ['name'], end: [] } },
  }));
}

function renderExtras() {
  return render(TestDataTableExtrasComponent, {
    providers: [{ provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true }],
  });
}

function bodyRows(): HTMLElement[] {
  const [, body] = screen.getAllByRole('rowgroup');
  return within(body).getAllByRole('row');
}

describe('ZardDataTable', () => {
  it('renders headers and the current page of rows', async () => {
    await renderTable();

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(2);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('moves to the next page', async () => {
    const user = userEvent.setup();
    await renderTable();

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('sorts from the column header menu', async () => {
    const user = userEvent.setup();
    await renderTable();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.click(await screen.findByRole('menuitem', { name: /asc/i }));

    expect(within(bodyRows()[0]).getByText('Ada')).toBeInTheDocument();
  });

  it('hides a column from the view options', async () => {
    const user = userEvent.setup();
    await renderTable();

    await user.click(screen.getByRole('button', { name: 'View' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: /age/i }));

    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument();
  });

  it('shows the empty state without rows', async () => {
    const { fixture } = await renderTable();

    fixture.componentInstance.data.set([]);
    fixture.detectChanges();

    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('shows the selected row count', async () => {
    await renderTable();

    expect(screen.getByText('0 of 3 row(s) selected.')).toBeInTheDocument();
  });

  describe('features', () => {
    it('adds the column meta classes to the th and td', async () => {
      await renderExtras();

      expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveClass('text-end');
      expect(screen.getByRole('cell', { name: '35' })).toHaveClass('text-end', 'tabular-nums');
    });

    it('renders the expanded row template under an expanded row', async () => {
      const { fixture } = await renderExtras();

      expect(screen.queryByText('Details of Ada')).not.toBeInTheDocument();

      fixture.componentInstance.table.getRow('Ada').toggleExpanded();
      fixture.detectChanges();

      const detail = screen.getByText('Details of Ada');
      expect(detail.closest('td')).toHaveAttribute('colspan', '2');
      expect(screen.getByText('Ada').closest('tr')).toHaveAttribute('data-expanded');
    });

    it('sticks a pinned column to the start edge', async () => {
      await renderExtras();

      const cell = screen.getByRole('cell', { name: 'Ada' });
      expect(cell).toHaveAttribute('data-pinned', 'start');
      expect(cell).toHaveClass('sticky', 'border-e');
      expect(cell.style.getPropertyValue('inset-inline-start')).toBe('0px');
    });

    it('unpins a column from the header menu', async () => {
      const user = userEvent.setup();
      await renderExtras();

      await user.click(screen.getByRole('button', { name: 'Name' }));
      await user.click(await screen.findByRole('menuitem', { name: /unpin/i }));

      expect(screen.getByRole('cell', { name: 'Ada' })).not.toHaveAttribute('data-pinned');
    });

    it('marks the table busy while loading', async () => {
      const { fixture } = await renderExtras();

      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();

      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    });
  });
});

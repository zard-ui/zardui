import { render, screen } from '@testing-library/angular';

import {
  ZardTableBodyComponent,
  ZardTableCaptionComponent,
  ZardTableCellComponent,
  ZardTableComponent,
  ZardTableFooterComponent,
  ZardTableHeadComponent,
  ZardTableHeaderComponent,
  ZardTableRowComponent,
} from './table.component';

describe('TableComponents', () => {
  describe('ZardTableComponent', () => {
    it('renders the table', async () => {
      await render(`<table z-table aria-label="Invoices"></table>`, {
        imports: [ZardTableComponent],
      });

      expect(screen.getByRole('table', { name: 'Invoices' })).toBeInTheDocument();
    });

    it('applies the default variant classes', async () => {
      await render(`<table z-table aria-label="Invoices"></table>`, {
        imports: [ZardTableComponent],
      });

      expect(screen.getByRole('table', { name: 'Invoices' })).toHaveClass('w-full', 'caption-bottom', 'text-sm');
    });

    it('applies the striped variant classes', async () => {
      await render(`<table z-table zType="striped" aria-label="Invoices"></table>`, {
        imports: [ZardTableComponent],
      });

      expect(screen.getByRole('table', { name: 'Invoices' })).toHaveClass('[&_tbody_tr:nth-child(odd)]:bg-muted/50');
    });

    it('applies the bordered variant classes', async () => {
      await render(`<table z-table zType="bordered" aria-label="Invoices"></table>`, {
        imports: [ZardTableComponent],
      });

      expect(screen.getByRole('table', { name: 'Invoices' })).toHaveClass('border', 'border-border');
    });

    it('applies the compact size classes', async () => {
      await render(`<table z-table zSize="compact" aria-label="Invoices"></table>`, {
        imports: [ZardTableComponent],
      });

      expect(screen.getByRole('table', { name: 'Invoices' })).toHaveClass('[&_td]:py-2', '[&_th]:py-2');
    });

    it('applies the comfortable size classes', async () => {
      await render(`<table z-table zSize="comfortable" aria-label="Invoices"></table>`, {
        imports: [ZardTableComponent],
      });

      expect(screen.getByRole('table', { name: 'Invoices' })).toHaveClass('[&_td]:py-4', '[&_th]:py-4');
    });
  });

  describe('ZardTableHeaderComponent', () => {
    it('renders the table header', async () => {
      await render(`<table><thead z-table-header><tr><th>Invoice</th></tr></thead></table>`, {
        imports: [ZardTableHeaderComponent],
      });

      expect(screen.getByRole('columnheader', { name: 'Invoice' })).toBeVisible();
    });

    it('applies the default header classes', async () => {
      await render(`<table><thead z-table-header><tr><th>Invoice</th></tr></thead></table>`, {
        imports: [ZardTableHeaderComponent],
      });

      expect(screen.getByRole('rowgroup')).toHaveClass('[&_tr]:border-b');
    });
  });

  describe('ZardTableBodyComponent', () => {
    it('renders the table body', async () => {
      await render(`<table><tbody z-table-body><tr><td>INV001</td></tr></tbody></table>`, {
        imports: [ZardTableBodyComponent],
      });

      expect(screen.getByRole('cell', { name: 'INV001' })).toBeVisible();
    });

    it('applies the default body classes', async () => {
      await render(`<table><tbody z-table-body><tr><td>INV001</td></tr></tbody></table>`, {
        imports: [ZardTableBodyComponent],
      });

      expect(screen.getByRole('rowgroup')).toHaveClass('[&_tr:last-child]:border-0');
    });
  });

  describe('ZardTableRowComponent', () => {
    it('renders the table row', async () => {
      await render(`<table><tbody><tr z-table-row><td>INV001</td></tr></tbody></table>`, {
        imports: [ZardTableRowComponent],
      });

      expect(screen.getByRole('row')).toHaveTextContent('INV001');
    });

    it('applies the default row classes', async () => {
      await render(`<table><tbody><tr z-table-row><td>INV001</td></tr></tbody></table>`, {
        imports: [ZardTableRowComponent],
      });

      expect(screen.getByRole('row')).toHaveClass('border-b', 'transition-colors', 'hover:bg-muted/50');
    });
  });

  describe('ZardTableHeadComponent', () => {
    it('renders the table head', async () => {
      await render(`<table><thead><tr><th z-table-head>Invoice</th></tr></thead></table>`, {
        imports: [ZardTableHeadComponent],
      });

      expect(screen.getByRole('columnheader', { name: 'Invoice' })).toBeVisible();
    });

    it('applies the default head classes', async () => {
      await render(`<table><thead><tr><th z-table-head>Invoice</th></tr></thead></table>`, {
        imports: [ZardTableHeadComponent],
      });

      expect(screen.getByRole('columnheader', { name: 'Invoice' })).toHaveClass(
        'h-10',
        'px-2',
        'text-left',
        'align-middle',
        'font-medium',
      );
    });
  });

  describe('ZardTableCellComponent', () => {
    it('renders the table cell', async () => {
      await render(`<table><tbody><tr><td z-table-cell>INV001</td></tr></tbody></table>`, {
        imports: [ZardTableCellComponent],
      });

      expect(screen.getByRole('cell', { name: 'INV001' })).toBeVisible();
    });

    it('applies the default cell classes', async () => {
      await render(`<table><tbody><tr><td z-table-cell>INV001</td></tr></tbody></table>`, {
        imports: [ZardTableCellComponent],
      });

      expect(screen.getByRole('cell', { name: 'INV001' })).toHaveClass('p-2', 'align-middle');
    });
  });

  describe('ZardTableCaptionComponent', () => {
    it('renders the table caption', async () => {
      await render(`<table><caption z-table-caption>Recent invoices</caption></table>`, {
        imports: [ZardTableCaptionComponent],
      });

      expect(screen.getByText('Recent invoices')).toBeVisible();
    });

    it('applies the default caption classes', async () => {
      await render(`<table><caption z-table-caption>Recent invoices</caption></table>`, {
        imports: [ZardTableCaptionComponent],
      });

      expect(screen.getByText('Recent invoices')).toHaveClass('mt-4', 'text-sm', 'text-muted-foreground');
    });
  });

  describe('ZardTableFooterComponent', () => {
    it('renders the footer content', async () => {
      await render(`<table><tfoot z-table-footer><tr><td>Invoice total</td></tr></tfoot></table>`, {
        imports: [ZardTableFooterComponent],
      });

      expect(screen.getByText('Invoice total')).toBeVisible();
    });

    it('applies the default footer classes', async () => {
      await render(`<table><tfoot z-table-footer><tr><td>Total</td></tr></tfoot></table>`, {
        imports: [ZardTableFooterComponent],
      });

      expect(screen.getByRole('rowgroup')).toHaveClass('border-t', 'bg-muted/50', 'font-medium');
    });
  });
});

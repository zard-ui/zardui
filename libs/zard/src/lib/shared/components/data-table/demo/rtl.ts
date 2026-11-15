import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import {
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  injectTableCellContext,
  injectTableContext,
  injectTableHeaderContext,
} from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { type DataTableFeatures, features } from './features';
import { type Payment, PAYMENTS } from './payments';

const translations: ZardRtlTranslations<{
  filterEmails: string;
  columns: string;
  status: string;
  email: string;
  amount: string;
  actions: string;
  copyPaymentId: string;
  viewCustomer: string;
  viewPaymentDetails: string;
  selectAll: string;
  selectRow: string;
  openMenu: string;
  noResults: string;
  rowsSelected: string;
  rowsSelectedSuffix: string;
  previous: string;
  next: string;
  statuses: Record<Payment['status'], string>;
  locale: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      filterEmails: 'Filter emails...',
      columns: 'Columns',
      status: 'Status',
      email: 'Email',
      amount: 'Amount',
      actions: 'Actions',
      copyPaymentId: 'Copy payment ID',
      viewCustomer: 'View customer',
      viewPaymentDetails: 'View payment details',
      selectAll: 'Select all',
      selectRow: 'Select row',
      openMenu: 'Open menu',
      noResults: 'No results.',
      rowsSelected: 'of',
      rowsSelectedSuffix: 'row(s) selected.',
      previous: 'Previous',
      next: 'Next',
      statuses: { pending: 'Pending', processing: 'Processing', success: 'Success', failed: 'Failed' },
      locale: 'en-US',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      filterEmails: 'تصفية البريد الإلكتروني...',
      columns: 'الأعمدة',
      status: 'الحالة',
      email: 'البريد الإلكتروني',
      amount: 'المبلغ',
      actions: 'الإجراءات',
      copyPaymentId: 'نسخ معرف الدفع',
      viewCustomer: 'عرض العميل',
      viewPaymentDetails: 'عرض تفاصيل الدفع',
      selectAll: 'تحديد الكل',
      selectRow: 'تحديد الصف',
      openMenu: 'فتح القائمة',
      noResults: 'لا توجد نتائج.',
      rowsSelected: 'من',
      rowsSelectedSuffix: 'صف(وف) محدد.',
      previous: 'السابق',
      next: 'التالي',
      statuses: { pending: 'قيد الانتظار', processing: 'قيد المعالجة', success: 'ناجح', failed: 'فشل' },
      locale: 'ar-SA',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      filterEmails: 'סנן אימיילים...',
      columns: 'עמודות',
      status: 'סטטוס',
      email: 'אימייל',
      amount: 'סכום',
      actions: 'פעולות',
      copyPaymentId: 'העתק מזהה תשלום',
      viewCustomer: 'צפה בלקוח',
      viewPaymentDetails: 'צפה בפרטי תשלום',
      selectAll: 'בחר הכל',
      selectRow: 'בחר שורה',
      openMenu: 'פתח תפריט',
      noResults: 'אין תוצאות.',
      rowsSelected: 'מתוך',
      rowsSelectedSuffix: 'שורות נבחרו.',
      previous: 'הקודם',
      next: 'הבא',
      statuses: { pending: 'ממתין', processing: 'מעבד', success: 'הצליח', failed: 'נכשל' },
      locale: 'he-IL',
    },
  },
};

/** Header checkbox, labelled in the selected language. */
@Component({
  selector: 'z-demo-rtl-select-all',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <z-checkbox
      [ngModel]="table().getIsAllPageRowsSelected()"
      (ngModelChange)="table().toggleAllPageRowsSelected($event)"
    >
      <span class="sr-only">{{ i18n.t().selectAll }}</span>
    </z-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RtlSelectAllComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly table = injectTableContext<DataTableFeatures, Payment>();
}

/** Row checkbox, labelled in the selected language. */
@Component({
  selector: 'z-demo-rtl-select-row',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <z-checkbox [ngModel]="cell().row.getIsSelected()" (ngModelChange)="cell().row.toggleSelected($event)">
      <span class="sr-only">{{ i18n.t().selectRow }}</span>
    </z-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RtlSelectRowComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly cell = injectTableCellContext<DataTableFeatures, Payment, unknown>();
}

/** Sortable email header. */
@Component({
  selector: 'z-demo-rtl-email-header',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="ghost" class="-ms-2.5" (click)="toggle()">
      {{ i18n.t().email }}
      <ng-icon name="lucideArrowUpDown" aria-hidden="true" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpDown })],
})
class RtlEmailHeaderComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  private readonly header = injectTableHeaderContext<DataTableFeatures, Payment, unknown>();

  protected toggle(): void {
    const { column } = this.header();
    column.toggleSorting(column.getIsSorted() === 'asc');
  }
}

/** Row actions menu. */
@Component({
  selector: 'z-demo-rtl-payment-actions',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    <button type="button" z-button zType="ghost" zSize="icon" class="size-8" z-dropdown [zDropdownMenu]="menu">
      <span class="sr-only">{{ i18n.t().openMenu }}</span>
      <ng-icon name="lucideEllipsis" aria-hidden="true" />
    </button>
    <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end">
      <z-dropdown-menu-label>{{ i18n.t().actions }}</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="copyId()">{{ i18n.t().copyPaymentId }}</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>{{ i18n.t().viewCustomer }}</z-dropdown-menu-item>
      <z-dropdown-menu-item>{{ i18n.t().viewPaymentDetails }}</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEllipsis })],
  host: { class: 'flex justify-end' },
})
class RtlPaymentActionsComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  private readonly cell = injectTableCellContext<DataTableFeatures, Payment, unknown>();

  protected copyId(): void {
    void navigator.clipboard?.writeText(this.cell().row.original.id);
  }
}

const columnHelper = createColumnHelper<typeof features, Payment>();

@Component({
  selector: 'z-demo-data-table-rtl',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2 py-4">
      <input
        z-input
        class="max-w-sm"
        [placeholder]="i18n.t().filterEmails"
        [attr.aria-label]="i18n.t().filterEmails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
      <button type="button" z-button zType="outline" class="ms-auto" z-dropdown [zDropdownMenu]="columnsMenu">
        {{ i18n.t().columns }}
        <ng-icon name="lucideChevronDown" aria-hidden="true" />
      </button>
      <z-dropdown-menu-content #columnsMenu="zDropdownMenuContent" zAlign="end">
        @for (column of hideableColumns(); track column.id) {
          <z-dropdown-menu-checkbox-item
            class="capitalize"
            [zChecked]="column.getIsVisible()"
            (zCheckedChange)="column.toggleVisibility($event)"
          >
            {{ column.id }}
          </z-dropdown-menu-checkbox-item>
        }
      </z-dropdown-menu-content>
    </div>
    <z-data-table [zTable]="table" [zEmptyText]="i18n.t().noResults" />
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-muted-foreground flex-1 text-sm">
        {{ table.getFilteredSelectedRowModel().rows.length }} {{ i18n.t().rowsSelected }}
        {{ table.getFilteredRowModel().rows.length }} {{ i18n.t().rowsSelectedSuffix }}
      </div>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        {{ i18n.t().previous }}
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        {{ i18n.t().next }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  /** Built once; the header and cell functions read the language when they render, so they follow it. */
  private readonly columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: () => flexRenderComponent(RtlSelectAllComponent),
      cell: () => flexRenderComponent(RtlSelectRowComponent),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('status', {
      header: () => this.i18n.t().status,
      cell: ({ getValue }) => this.i18n.t().statuses[getValue()],
    }),
    columnHelper.accessor('email', {
      header: () => flexRenderComponent(RtlEmailHeaderComponent),
      meta: { cellClass: 'lowercase' },
    }),
    columnHelper.accessor('amount', {
      header: () => this.i18n.t().amount,
      cell: ({ getValue }) =>
        new Intl.NumberFormat(this.i18n.t().locale, { style: 'currency', currency: 'USD' }).format(getValue()),
      meta: { cellClass: 'font-medium' },
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => flexRenderComponent(RtlPaymentActionsComponent),
      enableHiding: false,
    }),
  ]);

  readonly data = signal<Payment[]>(PAYMENTS.slice(0, 5));

  readonly table = injectTable(() => ({
    features,
    columns: this.columns,
    data: this.data(),
    getRowId: row => row.id,
  }));

  protected readonly hideableColumns = computed(() => this.table.getAllColumns().filter(column => column.getCanHide()));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}

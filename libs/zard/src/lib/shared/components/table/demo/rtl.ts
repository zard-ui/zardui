import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  caption: string;
  name: string;
  status: string;
  amount: string;
  paid: string;
  pending: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      caption: 'A list of recent invoices.',
      name: 'Invoice',
      status: 'Status',
      amount: 'Amount',
      paid: 'Paid',
      pending: 'Pending',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      caption: 'قائمة بأحدث الفواتير.',
      name: 'الفاتورة',
      status: 'الحالة',
      amount: 'المبلغ',
      paid: 'مدفوعة',
      pending: 'قيد الانتظار',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      caption: 'רשימת חשבוניות אחרונות.',
      name: 'חשבונית',
      status: 'סטטוס',
      amount: 'סכום',
      paid: 'שולם',
      pending: 'ממתין',
    },
  },
};

@Component({
  selector: 'z-demo-table-rtl',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>{{ i18n.t().caption }}</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">{{ i18n.t().name }}</th>
          <th z-table-head scope="col">{{ i18n.t().status }}</th>
          <th z-table-head scope="col" class="text-end">{{ i18n.t().amount }}</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (invoice of invoices; track invoice.id) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ invoice.id }}</td>
            <td z-table-cell>{{ invoice.paid ? i18n.t().paid : i18n.t().pending }}</td>
            <td z-table-cell class="text-end">{{ invoice.amount }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTableRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly invoices = [
    { id: 'INV001', paid: true, amount: '$250.00' },
    { id: 'INV002', paid: false, amount: '$150.00' },
    { id: 'INV003', paid: true, amount: '$350.00' },
  ];
}

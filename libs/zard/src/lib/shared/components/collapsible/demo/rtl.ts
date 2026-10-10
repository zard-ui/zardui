import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CollapsibleRtlValues {
  orderNumber: string;
  status: string;
  shipped: string;
  shippingAddress: string;
  address: string;
  items: string;
  itemsDescription: string;
  toggle: string;
}

const translations: ZardRtlTranslations<CollapsibleRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      orderNumber: 'Order #4189',
      status: 'Status',
      shipped: 'Shipped',
      shippingAddress: 'Shipping address',
      address: '100 Market St, San Francisco',
      items: 'Items',
      itemsDescription: '2x Studio Headphones',
      toggle: 'Toggle details',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      orderNumber: 'الطلب #4189',
      status: 'الحالة',
      shipped: 'تم الشحن',
      shippingAddress: 'عنوان الشحن',
      address: '100 Market St, San Francisco',
      items: 'العناصر',
      itemsDescription: '2x سماعات الاستوديو',
      toggle: 'عرض التفاصيل',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      orderNumber: 'הזמנה #4189',
      status: 'סטטוס',
      shipped: 'נשלח',
      shippingAddress: 'כתובת משלוח',
      address: '100 Market St, San Francisco',
      items: 'פריטים',
      itemsDescription: '2x אוזניות סטודיו',
      toggle: 'הצג פרטים',
    },
  },
};

@Component({
  selector: 'z-demo-collapsible-rtl',
  imports: [ZardCollapsibleImports, ZardButtonComponent, ZardCardImports, NgIcon],
  template: `
    <z-card class="w-full max-w-sm" zSize="sm">
      <div z-card-content>
        <z-collapsible class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-sm font-semibold">{{ i18n.t().orderNumber }}</h4>
            <button z-button z-collapsible-trigger zType="ghost" zSize="icon-sm" [attr.aria-label]="i18n.t().toggle">
              <ng-icon name="lucideChevronsUpDown" />
            </button>
          </div>
          <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
            <span class="text-muted-foreground">{{ i18n.t().status }}</span>
            <span class="font-medium">{{ i18n.t().shipped }}</span>
          </div>
          <z-collapsible-content>
            <div class="flex flex-col gap-2">
              <div class="rounded-md border px-4 py-2 text-sm">
                <p class="text-muted-foreground">{{ i18n.t().shippingAddress }}</p>
                <p class="font-medium">{{ i18n.t().address }}</p>
              </div>
              <div class="rounded-md border px-4 py-2 text-sm">
                <p class="text-muted-foreground">{{ i18n.t().items }}</p>
                <p class="font-medium">{{ i18n.t().itemsDescription }}</p>
              </div>
            </div>
          </z-collapsible-content>
        </z-collapsible>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
})
export class ZardDemoCollapsibleRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

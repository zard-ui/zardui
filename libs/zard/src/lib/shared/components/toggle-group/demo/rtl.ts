import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ list: string; grid: string; table: string }> = {
  en: {
    dir: 'ltr',
    values: {
      list: 'List',
      grid: 'Grid',
      table: 'Table',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      list: 'قائمة',
      grid: 'شبكة',
      table: 'جدول',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      list: 'רשימה',
      grid: 'רשת',
      table: 'טבלה',
    },
  },
};

@Component({
  selector: 'z-demo-toggle-group-rtl',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group zMode="single" zType="outline" zDefaultValue="list" [zSpacing]="0" [zItems]="items()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoToggleGroupRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly items = computed<ZardToggleGroupItem[]>(() => [
    { value: 'list', label: this.i18n.t().list },
    { value: 'grid', label: this.i18n.t().grid },
    { value: 'table', label: this.i18n.t().table },
  ]);
}

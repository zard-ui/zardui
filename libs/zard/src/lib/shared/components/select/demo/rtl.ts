import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface SelectRtlValues {
  selectFruit: string;
  fruits: string;
  apple: string;
  banana: string;
  blueberry: string;
  grapes: string;
  pineapple: string;
  vegetables: string;
  carrot: string;
  broccoli: string;
  spinach: string;
}

const translations: ZardRtlTranslations<SelectRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      selectFruit: 'Select a fruit',
      fruits: 'Fruits',
      apple: 'Apple',
      banana: 'Banana',
      blueberry: 'Blueberry',
      grapes: 'Grapes',
      pineapple: 'Pineapple',
      vegetables: 'Vegetables',
      carrot: 'Carrot',
      broccoli: 'Broccoli',
      spinach: 'Spinach',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      selectFruit: 'اختر فاكهة',
      fruits: 'الفواكه',
      apple: 'تفاح',
      banana: 'موز',
      blueberry: 'توت أزرق',
      grapes: 'عنب',
      pineapple: 'أناناس',
      vegetables: 'الخضروات',
      carrot: 'جزر',
      broccoli: 'بروكلي',
      spinach: 'سبانخ',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      selectFruit: 'בחר פרי',
      fruits: 'פירות',
      apple: 'תפוח',
      banana: 'בננה',
      blueberry: 'אוכמניה',
      grapes: 'ענבים',
      pineapple: 'אננס',
      vegetables: 'ירקות',
      carrot: 'גזר',
      broccoli: 'ברוקולי',
      spinach: 'תרד',
    },
  },
};

@Component({
  selector: 'z-demo-select-rtl',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-48" [zPlaceholder]="i18n.t().selectFruit" [(zValue)]="selected">
      <z-select-group>
        <z-select-label>{{ i18n.t().fruits }}</z-select-label>
        <z-select-item zValue="apple">{{ i18n.t().apple }}</z-select-item>
        <z-select-item zValue="banana">{{ i18n.t().banana }}</z-select-item>
        <z-select-item zValue="blueberry">{{ i18n.t().blueberry }}</z-select-item>
        <z-select-item zValue="grapes">{{ i18n.t().grapes }}</z-select-item>
        <z-select-item zValue="pineapple">{{ i18n.t().pineapple }}</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>{{ i18n.t().vegetables }}</z-select-label>
        <z-select-item zValue="carrot">{{ i18n.t().carrot }}</z-select-item>
        <z-select-item zValue="broccoli">{{ i18n.t().broccoli }}</z-select-item>
        <z-select-item zValue="spinach">{{ i18n.t().spinach }}</z-select-item>
      </z-select-group>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly selected = signal('');
}

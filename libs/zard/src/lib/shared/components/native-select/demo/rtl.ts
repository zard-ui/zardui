import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface NativeSelectRtlValues {
  label: string;
  placeholder: string;
  todo: string;
  inProgress: string;
  done: string;
}

const translations: ZardRtlTranslations<NativeSelectRtlValues> = {
  en: {
    dir: 'ltr',
    values: { label: 'Status', placeholder: 'Select status', todo: 'Todo', inProgress: 'In progress', done: 'Done' },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'الحالة',
      placeholder: 'اختر الحالة',
      todo: 'قيد الانتظار',
      inProgress: 'قيد التنفيذ',
      done: 'مكتمل',
    },
  },
  he: {
    dir: 'rtl',
    values: { label: 'סטטוס', placeholder: 'בחר סטטוס', todo: 'לביצוע', inProgress: 'בתהליך', done: 'הושלם' },
  },
};

@Component({
  selector: 'z-demo-native-select-rtl',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64">
      <label z-field-label for="native-select-rtl">{{ i18n.t().label }}</label>
      <select z-native-select id="native-select-rtl">
        <option value="" disabled selected>{{ i18n.t().placeholder }}</option>
        <option value="todo">{{ i18n.t().todo }}</option>
        <option value="in-progress">{{ i18n.t().inProgress }}</option>
        <option value="done">{{ i18n.t().done }}</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

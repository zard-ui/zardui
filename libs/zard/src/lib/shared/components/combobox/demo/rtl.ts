import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardComboboxImports } from '@/shared/components/combobox/combobox.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const categories = ['technology', 'design', 'business', 'marketing', 'education', 'health'] as const;

interface ComboboxRtlValues {
  label: string;
  placeholder: string;
  empty: string;
  technology: string;
  design: string;
  business: string;
  marketing: string;
  education: string;
  health: string;
}

const translations: ZardRtlTranslations<ComboboxRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Categories',
      placeholder: 'Add categories',
      empty: 'No categories found.',
      technology: 'Technology',
      design: 'Design',
      business: 'Business',
      marketing: 'Marketing',
      education: 'Education',
      health: 'Health',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'الفئات',
      placeholder: 'أضف فئات',
      empty: 'لم يتم العثور على فئات.',
      technology: 'التكنولوجيا',
      design: 'التصميم',
      business: 'الأعمال',
      marketing: 'التسويق',
      education: 'التعليم',
      health: 'الصحة',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'קטגוריות',
      placeholder: 'הוסף קטגוריות',
      empty: 'לא נמצאו קטגוריות.',
      technology: 'טכנולוגיה',
      design: 'עיצוב',
      business: 'עסקים',
      marketing: 'שיווק',
      education: 'חינוך',
      health: 'בריאות',
    },
  },
};

@Component({
  selector: 'z-demo-combobox-rtl',
  imports: [ZardComboboxImports],
  template: `
    <div class="mx-auto grid w-full max-w-xs gap-2">
      <span class="text-sm font-medium">{{ i18n.t().label }}</span>

      <z-combobox zMultiple zAutoHighlight zWidth="full" [(zValue)]="value">
        <z-combobox-chips class="w-full">
          @for (selected of selectedValues(); track selected) {
            <z-combobox-chip [zValue]="selected">{{ i18n.t()[selected] }}</z-combobox-chip>
          }

          <input z-combobox-chips-input [placeholder]="i18n.t().placeholder" />
        </z-combobox-chips>

        <z-combobox-content>
          <z-combobox-empty>{{ i18n.t().empty }}</z-combobox-empty>

          <z-combobox-list>
            @for (category of categories; track category) {
              <z-combobox-item [zValue]="category">{{ i18n.t()[category] }}</z-combobox-item>
            }
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly categories = categories;
  protected readonly value = signal<string | string[] | null>([categories[0]]);

  protected readonly selectedValues = computed(() => {
    const value = this.value();
    return (Array.isArray(value) ? value : value ? [value] : []) as (typeof categories)[number][];
  });
}

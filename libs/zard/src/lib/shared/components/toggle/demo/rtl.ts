import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic } from '@ng-icons/lucide';

import { ZardToggleComponent } from '@/shared/components/toggle/toggle.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ bold: string; italic: string }> = {
  en: {
    dir: 'ltr',
    values: {
      bold: 'Bold',
      italic: 'Italic',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      bold: 'غامق',
      italic: 'مائل',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      bold: 'מודגש',
      italic: 'נטוי',
    },
  },
};

@Component({
  selector: 'z-demo-toggle-rtl',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zType="outline" [zAriaLabel]="i18n.t().bold">
        <ng-icon name="lucideBold" />
        {{ i18n.t().bold }}
      </z-toggle>
      <z-toggle zType="outline" [zAriaLabel]="i18n.t().italic">
        <ng-icon name="lucideItalic" />
        {{ i18n.t().italic }}
      </z-toggle>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBold, lucideItalic })],
})
export class ZardDemoToggleRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

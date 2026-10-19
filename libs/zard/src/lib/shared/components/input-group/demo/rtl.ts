import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  search: string;
  results: string;
  url: string;
  scheme: string;
  domain: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      search: 'Search...',
      results: '12 results',
      url: 'example',
      scheme: 'https://',
      domain: '.com',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      search: 'بحث...',
      results: '١٢ نتيجة',
      url: 'مثال',
      scheme: 'https://',
      domain: '.com',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      search: 'חיפוש...',
      results: '12 תוצאות',
      url: 'דוגמה',
      scheme: 'https://',
      domain: '.com',
    },
  },
};

@Component({
  selector: 'z-demo-input-group-rtl',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="flex w-full min-w-xs flex-col gap-4">
      <z-input-group>
        <input z-input id="input-group-rtl-search" [placeholder]="i18n.t().search" />
        <z-input-group-addon>
          <ng-icon name="lucideSearch" />
        </z-input-group-addon>
        <z-input-group-addon zAlign="inline-end">{{ i18n.t().results }}</z-input-group-addon>
      </z-input-group>

      <z-input-group>
        <z-input-group-addon>
          <z-input-group-text>
            <bdi>{{ i18n.t().scheme }}</bdi>
          </z-input-group-text>
        </z-input-group-addon>
        <input z-input id="input-group-rtl-url" [placeholder]="i18n.t().url" />
        <z-input-group-addon zAlign="inline-end">
          <z-input-group-text>
            <bdi>{{ i18n.t().domain }}</bdi>
          </z-input-group-text>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

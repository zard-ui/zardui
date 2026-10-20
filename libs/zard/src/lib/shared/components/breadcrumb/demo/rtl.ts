import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface BreadcrumbRtlValues {
  home: string;
  components: string;
  documentation: string;
  themes: string;
  source: string;
  breadcrumb: string;
  more: string;
}

const translations: ZardRtlTranslations<BreadcrumbRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      home: 'Home',
      components: 'Components',
      documentation: 'Documentation',
      themes: 'Themes',
      source: 'Source code',
      breadcrumb: 'Breadcrumb',
      more: 'More breadcrumbs',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      home: 'الرئيسية',
      components: 'المكونات',
      documentation: 'التوثيق',
      themes: 'السمات',
      source: 'الكود المصدري',
      breadcrumb: 'مسار التنقل',
      more: 'مزيد من المسارات',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      home: 'בית',
      components: 'רכיבים',
      documentation: 'תיעוד',
      themes: 'ערכות נושא',
      source: 'קוד מקור',
      breadcrumb: 'פירורי לחם',
      more: 'עוד נתיבים',
    },
  },
};

@Component({
  selector: 'z-demo-breadcrumb-rtl',
  imports: [ZardBreadcrumbImports, ZardDropdownImports, NgIcon],
  template: `
    <z-breadcrumb [zLabel]="i18n.t().breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="#">{{ i18n.t().home }}</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <z-breadcrumb-ellipsis [zLabel]="i18n.t().more" />
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <button
          z-breadcrumb-link
          type="button"
          class="flex items-center gap-1.5 border-0 bg-transparent p-0 text-inherit"
          z-dropdown
          [zDropdownMenu]="componentsMenu"
        >
          {{ i18n.t().components }}
          <ng-icon name="lucideChevronDown" class="size-3.5!" aria-hidden="true" />
        </button>

        <z-dropdown-menu-content #componentsMenu="zDropdownMenuContent" class="w-48">
          <z-dropdown-menu-item>{{ i18n.t().documentation }}</z-dropdown-menu-item>
          <z-dropdown-menu-item>{{ i18n.t().themes }}</z-dropdown-menu-item>
          <z-dropdown-menu-item>{{ i18n.t().source }}</z-dropdown-menu-item>
        </z-dropdown-menu-content>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>{{ i18n.t().breadcrumb }}</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoBreadcrumbRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

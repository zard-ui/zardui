import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  searched: string;
  ran: string;
  duration: string;
  output: string;
  running: string;
  read: string;
  opensInNewTab: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      searched: 'Searched for minimumReleaseAge',
      ran: 'Ran pnpm install',
      duration: '12s',
      output: 'Done in 11.8s',
      running: 'Running pnpm build',
      read: 'Read the pnpm docs',
      opensInNewTab: '(opens in a new tab)',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      searched: 'تم البحث عن minimumReleaseAge',
      ran: 'تم تشغيل pnpm install',
      duration: '12 ث',
      output: 'تم في 11.8 ثانية',
      running: 'جارٍ تشغيل pnpm build',
      read: 'قراءة وثائق pnpm',
      opensInNewTab: '(يفتح في علامة تبويب جديدة)',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      searched: 'חיפוש של minimumReleaseAge',
      ran: 'הורץ pnpm install',
      duration: '12 שנ׳',
      output: 'הסתיים ב-11.8 שניות',
      running: 'מריץ את pnpm build',
      read: 'קריאת התיעוד של pnpm',
      opensInNewTab: '(נפתח בלשונית חדשה)',
    },
  },
};

@Component({
  selector: 'z-demo-trace-rtl',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>{{ i18n.t().searched }}</z-trace-title>
      </z-trace-line>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>{{ i18n.t().ran }}</z-trace-title>
            <z-trace-description>{{ i18n.t().duration }}</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>{{ i18n.t().output }}</z-trace-collapsible-content>
      </z-trace-collapsible>

      <a href="https://pnpm.io" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
          <z-trace-title>
            {{ i18n.t().read }}
            <span class="sr-only">{{ i18n.t().opensInNewTab }}</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </a>

      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>{{ i18n.t().running }}</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideSearch, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import {
  lucideCalculator,
  lucideCalendar,
  lucideCreditCard,
  lucideSettings,
  lucideSmile,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CommandRtlValues {
  placeholder: string;
  empty: string;
  suggestions: string;
  calendar: string;
  searchEmoji: string;
  calculator: string;
  settings: string;
  profile: string;
  billing: string;
}

const translations: ZardRtlTranslations<CommandRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      placeholder: 'Type a command or search...',
      empty: 'No results found.',
      suggestions: 'Suggestions',
      calendar: 'Calendar',
      searchEmoji: 'Search Emoji',
      calculator: 'Calculator',
      settings: 'Settings',
      profile: 'Profile',
      billing: 'Billing',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      placeholder: 'اكتب أمرًا أو ابحث...',
      empty: 'لم يتم العثور على نتائج.',
      suggestions: 'اقتراحات',
      calendar: 'التقويم',
      searchEmoji: 'البحث عن الرموز التعبيرية',
      calculator: 'الآلة الحاسبة',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      billing: 'الفوترة',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      placeholder: 'הקלד פקודה או חפש...',
      empty: 'לא נמצאו תוצאות.',
      suggestions: 'הצעות',
      calendar: 'לוח שנה',
      searchEmoji: "חפש אמוג'י",
      calculator: 'מחשבון',
      settings: 'הגדרות',
      profile: 'פרופיל',
      billing: 'חיוב',
    },
  },
};

@Component({
  selector: 'z-demo-command-rtl',
  imports: [ZardCommandImports],
  template: `
    <z-command class="min-w-sm" #cmd="zCommand">
      <z-command-input [placeholder]="i18n.t().placeholder" />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">{{ i18n.t().empty }}</div>
        }

        <z-command-option-group [zLabel]="i18n.t().suggestions">
          <z-command-option [zLabel]="i18n.t().calendar" zValue="calendar" zIcon="lucideCalendar" />
          <z-command-option [zLabel]="i18n.t().searchEmoji" zValue="emoji" zIcon="lucideSmile" />
          <z-command-option
            [zLabel]="i18n.t().calculator"
            zValue="calculator"
            zIcon="lucideCalculator"
            [zDisabled]="true"
          />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group [zLabel]="i18n.t().settings">
          <z-command-option [zLabel]="i18n.t().profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option [zLabel]="i18n.t().billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option [zLabel]="i18n.t().settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCalendar,
      lucideSmile,
      lucideCalculator,
      lucideUser,
      lucideCreditCard,
      lucideSettings,
    }),
  ],
})
export class ZardDemoCommandRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface DropdownRtlValues {
  open: string;
  account: string;
  profile: string;
  billing: string;
  settings: string;
  team: string;
  inviteUsers: string;
  email: string;
  message: string;
  more: string;
  calendar: string;
  chat: string;
  webhook: string;
  advanced: string;
  newTeam: string;
  view: string;
  statusBar: string;
  activityBar: string;
  panel: string;
  position: string;
  top: string;
  bottom: string;
  right: string;
  left: string;
  logout: string;
}

const translations: ZardRtlTranslations<DropdownRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      open: 'Open',
      account: 'Account',
      profile: 'Profile',
      billing: 'Billing',
      settings: 'Settings',
      team: 'Team',
      inviteUsers: 'Invite users',
      email: 'Email',
      message: 'Message',
      more: 'More',
      calendar: 'Calendar',
      chat: 'Chat',
      webhook: 'Webhook',
      advanced: 'Advanced...',
      newTeam: 'New Team',
      view: 'View',
      statusBar: 'Status Bar',
      activityBar: 'Activity Bar',
      panel: 'Panel',
      position: 'Position',
      top: 'Top',
      bottom: 'Bottom',
      right: 'Right',
      left: 'Left',
      logout: 'Log out',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      open: 'افتح القائمة',
      account: 'الحساب',
      profile: 'الملف الشخصي',
      billing: 'الفوترة',
      settings: 'الإعدادات',
      team: 'الفريق',
      inviteUsers: 'دعوة المستخدمين',
      email: 'البريد الإلكتروني',
      message: 'رسالة',
      more: 'المزيد',
      calendar: 'تقويم',
      chat: 'دردشة',
      webhook: 'خطاف ويب',
      advanced: 'متقدم...',
      newTeam: 'فريق جديد',
      view: 'عرض',
      statusBar: 'شريط الحالة',
      activityBar: 'شريط النشاط',
      panel: 'اللوحة',
      position: 'الموضع',
      top: 'أعلى',
      bottom: 'أسفل',
      right: 'يمين',
      left: 'يسار',
      logout: 'تسجيل الخروج',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      open: 'פתח תפריט',
      account: 'חשבון',
      profile: 'פרופיל',
      billing: 'חיוב',
      settings: 'הגדרות',
      team: 'הצוות',
      inviteUsers: 'הזמן משתמשים',
      email: 'אימייל',
      message: 'הודעה',
      more: 'עוד',
      calendar: 'יומן',
      chat: "צ'אט",
      webhook: 'Webhook',
      advanced: 'מתקדם...',
      newTeam: 'צוות חדש',
      view: 'תצוגה',
      statusBar: 'שורת סטטוס',
      activityBar: 'שורת פעילות',
      panel: 'לוח',
      position: 'מיקום',
      top: 'למעלה',
      bottom: 'למטה',
      right: 'ימין',
      left: 'שמאל',
      logout: 'התנתק',
    },
  },
};

@Component({
  selector: 'z-demo-dropdown-rtl',
  imports: [ZardDropdownImports, ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">{{ i18n.t().open }}</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-sub-trigger [zSubMenu]="account">{{ i18n.t().account }}</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #account="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>
          <ng-icon name="lucideUser" class="size-4" />
          {{ i18n.t().profile }}
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCreditCard" class="size-4" />
          {{ i18n.t().billing }}
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideSettings" class="size-4" />
          {{ i18n.t().settings }}
        </z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-label>{{ i18n.t().team }}</z-dropdown-menu-label>
      <z-dropdown-menu-item>{{ i18n.t().team }}</z-dropdown-menu-item>
      <z-dropdown-menu-sub-trigger [zSubMenu]="invite">{{ i18n.t().inviteUsers }}</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #invite="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>{{ i18n.t().email }}</z-dropdown-menu-item>
        <z-dropdown-menu-item>{{ i18n.t().message }}</z-dropdown-menu-item>
        <z-dropdown-menu-sub-trigger [zSubMenu]="more">{{ i18n.t().more }}</z-dropdown-menu-sub-trigger>
        <z-dropdown-menu-sub-content #more="zDropdownMenuSubContent" class="w-44">
          <z-dropdown-menu-item>{{ i18n.t().calendar }}</z-dropdown-menu-item>
          <z-dropdown-menu-item>{{ i18n.t().chat }}</z-dropdown-menu-item>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-item>{{ i18n.t().webhook }}</z-dropdown-menu-item>
        </z-dropdown-menu-sub-content>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>{{ i18n.t().advanced }}</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-item>
        {{ i18n.t().newTeam }}
        <z-dropdown-menu-shortcut>⌘+T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-label>{{ i18n.t().view }}</z-dropdown-menu-label>
      <z-dropdown-menu-checkbox-item [(zChecked)]="statusBar">{{ i18n.t().statusBar }}</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="activityBar">
        {{ i18n.t().activityBar }}
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="panel">{{ i18n.t().panel }}</z-dropdown-menu-checkbox-item>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-label>{{ i18n.t().position }}</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="position">
        <z-dropdown-menu-radio-item zValue="top">{{ i18n.t().top }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="bottom">{{ i18n.t().bottom }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="right">{{ i18n.t().right }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="left">{{ i18n.t().left }}</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-item zType="destructive">{{ i18n.t().logout }}</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings })],
})
export class ZardDemoDropdownRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected statusBar = true;
  protected activityBar = false;
  protected panel = false;
  protected position = 'bottom';
}

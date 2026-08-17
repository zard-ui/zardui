import { ChangeDetectionStrategy, Component, inject, type TemplateRef, viewChild } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCheck,
  lucideGlobe,
  lucideKeyboard,
  lucideLink,
  lucideLock,
  lucideMenu,
  lucideMessageCircle,
  lucidePaintbrush,
  lucideSettings,
  lucideVideo,
} from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogService } from '@zard/components/dialog/dialog.service';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

interface NavItem {
  readonly name: string;
  readonly icon: string;
}

/**
 * shadcn drives this with a declarative `<Dialog>`. The Zard dialog is imperative
 * (`ZardDialogService`), so the settings layout lives in a `<ng-template>` that is handed to the
 * service as the dialog content.
 */
@Component({
  selector: 'lib-sidebar-13-settings-dialog',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardButtonComponent, NgIcon],
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideCheck,
      lucideGlobe,
      lucideKeyboard,
      lucideLink,
      lucideLock,
      lucideMenu,
      lucideMessageCircle,
      lucidePaintbrush,
      lucideSettings,
      lucideVideo,
    }),
  ],
  templateUrl: './sidebar-13-settings-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar13SettingsDialogComponent {
  private readonly dialogService = inject(ZardDialogService);

  private readonly settingsTemplate = viewChild.required<TemplateRef<unknown>>('settings');

  // This is sample data.
  protected readonly nav: readonly NavItem[] = [
    { name: 'Notifications', icon: 'lucideBell' },
    { name: 'Navigation', icon: 'lucideMenu' },
    { name: 'Home', icon: 'lucideSettings' },
    { name: 'Appearance', icon: 'lucidePaintbrush' },
    { name: 'Messages & media', icon: 'lucideMessageCircle' },
    { name: 'Language & region', icon: 'lucideGlobe' },
    { name: 'Accessibility', icon: 'lucideKeyboard' },
    { name: 'Mark as read', icon: 'lucideCheck' },
    { name: 'Audio & video', icon: 'lucideVideo' },
    { name: 'Connected accounts', icon: 'lucideLink' },
    { name: 'Privacy & visibility', icon: 'lucideLock' },
    { name: 'Advanced', icon: 'lucideSettings' },
  ];

  protected readonly placeholders = Array.from({ length: 10 }, (_, index) => index);

  protected openSettings(): void {
    this.dialogService.create({
      zTitle: 'Settings',
      zDescription: 'Customize your settings here.',
      zContent: this.settingsTemplate(),
      zHideFooter: true,
      // The Zard dialog caps itself at `sm:max-w-sm`; the sidebar layout needs shadcn's wider frame.
      zCustomClasses: 'overflow-hidden md:max-h-[500px] sm:max-w-[700px] lg:max-w-[800px]',
    });
  }
}

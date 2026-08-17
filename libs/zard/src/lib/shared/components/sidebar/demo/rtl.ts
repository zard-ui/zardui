import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHouse, lucideInbox, lucideSettings } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-rtl',
  imports: [ZardSidebarImports, NgIcon],
  template: `
    <!--
      In RTL the flex row is already mirrored, so the sidebar has to be declared first for the gap it
      reserves to land under the panel. In LTR with zSide="right" it is the other way around.
    -->
    <z-sidebar-provider dir="rtl" class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zSide="right" class="h-full">
        <div z-sidebar-header class="font-medium">لوحة التحكم</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>التنقل</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navItems; track item.title) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button [zTooltip]="item.title">
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">الشريط الجانبي على اليمين، والأيقونة معكوسة.</p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideHouse, lucideInbox, lucideSettings })],
})
export class ZardDemoSidebarRtlComponent {
  readonly navItems = [
    { title: 'الرئيسية', icon: 'lucideHouse' },
    { title: 'البريد', icon: 'lucideInbox' },
    { title: 'الإعدادات', icon: 'lucideSettings' },
  ];
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-badge',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Mail</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (folder of folders; track folder.title) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button [zActive]="folder.title === 'Inbox'">{{ folder.title }}</button>
                    <div z-sidebar-menu-badge>{{ folder.count }}</div>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          The badge is pointer-events-none and follows the button size through peer-data-[size=…]/menu-button.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarMenuBadgeComponent {
  readonly folders = [
    { title: 'Inbox', count: 24 },
    { title: 'Drafts', count: 3 },
    { title: 'Sent', count: 128 },
    { title: 'Spam', count: 9 },
  ];
}

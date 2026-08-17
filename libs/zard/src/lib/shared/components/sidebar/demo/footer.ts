import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideLogOut, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-footer',
  imports: [ZardSidebarImports, ZardDropdownImports, ZardAvatarComponent, NgIcon],
  viewProviders: [provideIcons({ lucideChevronsUpDown, lucideLogOut, lucideSettings, lucideUser })],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>The user menu lives in the footer</div>
          </div>
        </z-sidebar-content>

        <div z-sidebar-footer>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zSize="lg" z-dropdown [zDropdownMenu]="account">
                <z-avatar class="size-8 rounded-lg" zSrc="https://github.com/shadcn.png" zAlt="shadcn" zFallback="CN" />

                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">shadcn</span>
                  <span class="text-muted-foreground truncate text-xs">m&#64;example.com</span>
                </div>

                <ng-icon name="lucideChevronsUpDown" class="ml-auto" />
              </button>

              <z-dropdown-menu-content #account="zDropdownMenuContent" class="w-56">
                <z-dropdown-menu-item (click)="lastAction.set('Profile')">
                  <ng-icon name="lucideUser" />
                  Profile
                </z-dropdown-menu-item>
                <z-dropdown-menu-item (click)="lastAction.set('Settings')">
                  <ng-icon name="lucideSettings" />
                  Settings
                </z-dropdown-menu-item>
                <z-dropdown-menu-separator />
                <z-dropdown-menu-item (click)="lastAction.set('Logout')">
                  <ng-icon name="lucideLogOut" />
                  Logout
                </z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </li>
          </ul>
        </div>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          Last action:
          <span class="text-foreground font-medium">{{ lastAction() }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarFooterComponent {
  readonly lastAction = signal('none');
}

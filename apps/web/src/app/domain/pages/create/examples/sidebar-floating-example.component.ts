import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardItemImports } from '@zard/components/item';
import { ZardSidebarImports } from '@zard/components/sidebar';

import { SIDEBAR_DOCS_NAV } from './sidebar-example.data';

/** shadcn/ui's `sidebar-floating-example`, in zard: a whole page, so no example wrapper. */
@Component({
  selector: 'z-sidebar-floating-example',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardCardImports,
    ZardDropdownImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardItemImports,
    ZardSidebarImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMoreHorizontal })],
  template: `
    <z-sidebar-provider zDefaultOpen="true" class="bg-background">
      <z-sidebar zVariant="floating">
        <z-sidebar-header>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <a z-sidebar-menu-button zSize="lg" href="#">
                <div z-item class="p-0" zSize="xs">
                  <div z-item-content>
                    <div z-item-title class="text-sm">Documentation</div>
                    <p z-item-description>v1.0.0</p>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </z-sidebar-header>
        <z-sidebar-content>
          <z-sidebar-group>
            <ul z-sidebar-menu>
              @for (item of navMain; track item.title) {
                <li z-sidebar-menu-item>
                  <button
                    type="button"
                    z-sidebar-menu-button
                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    z-dropdown
                    [zDropdownMenu]="sectionMenu"
                  >
                    {{ item.title }}
                    <ng-icon name="lucideMoreHorizontal" class="ml-auto" />
                  </button>
                  <z-dropdown-menu-content #sectionMenu="zDropdownMenuContent" zSide="right" zAlign="start">
                    <z-dropdown-menu-group>
                      @for (subItem of item.items; track subItem.title) {
                        <a z-dropdown-menu-item [href]="subItem.url">{{ subItem.title }}</a>
                      }
                    </z-dropdown-menu-group>
                  </z-dropdown-menu-content>
                </li>
              }
            </ul>
          </z-sidebar-group>
        </z-sidebar-content>
        <z-sidebar-footer>
          <z-sidebar-group class="pb-1">
            <z-card zSize="sm" class="-mx-1">
              <z-card-header>
                <z-card-title class="text-sm" zTitle="Subscribe to our newsletter" />
                <z-card-description zDescription="Opt-in to receive updates and news about the sidebar." />
              </z-card-header>
              <z-card-content>
                <form>
                  <div z-field>
                    <input z-input z-sidebar-input type="email" placeholder="Email" />
                    <button
                      type="button"
                      z-button
                      zSize="sm"
                      class="bg-sidebar-primary text-sidebar-primary-foreground w-full"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </z-card-content>
            </z-card>
          </z-sidebar-group>
        </z-sidebar-footer>
        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>
      <z-sidebar-inset>
        <header class="flex h-16 shrink-0 items-center gap-2 px-4">
          <button z-sidebar-trigger class="-ml-1" aria-label="Toggle Sidebar"></button>
        </header>
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
          </div>
          <div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"></div>
        </div>
      </z-sidebar-inset>
    </z-sidebar-provider>
  `,
})
export class SidebarFloatingExampleComponent {
  protected readonly navMain = SIDEBAR_DOCS_NAV;
}

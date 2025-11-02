import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardSkeletonComponent } from '../../skeleton/skeleton.component';
import { ContentComponent } from '../content.component';
import { FooterComponent } from '../footer.component';
import { HeaderComponent } from '../header.component';
import { LayoutComponent } from '../layout.component';
import { SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent } from '../sidebar.component';

@Component({
  selector: 'z-demo-layout-full',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    SidebarComponent,
    SidebarGroupComponent,
    SidebarGroupLabelComponent,
    ZardButtonComponent,
    ZardSkeletonComponent,
    ZardIconComponent,
  ],
  template: `
    <z-layout class="min-h-[600px] overflow-hidden rounded-md border">
      <z-header>
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center text-lg font-semibold">
            <img src="images/zard.svg" alt="Logo" width="24" height="24" />
            <span class="ml-2">ZardUI</span>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zType="ghost" zSize="sm">
              <z-icon zType="search" />
            </button>
            <button z-button zType="ghost" zSize="sm">
              <z-icon zType="bell" />
            </button>
          </div>
        </div>
      </z-header>

      <z-layout>
        <z-sidebar [zWidth]="200" class="!p-0">
          <nav class="flex h-full flex-col gap-2 p-4">
            <z-sidebar-group>
              <z-sidebar-group-label>Menu</z-sidebar-group-label>
              <button z-button zType="secondary" class="justify-start">
                <z-icon zType="house" class="mr-2" />
                Dashboard
              </button>
              <button z-button zType="ghost" class="justify-start">
                <z-icon zType="layers" class="mr-2" />
                Projects
              </button>
              <button z-button zType="ghost" class="justify-start">
                <z-icon zType="users" class="mr-2" />
                Team
              </button>
            </z-sidebar-group>
          </nav>
        </z-sidebar>

        <z-layout>
          <z-content class="min-h-[200px]">
            <div class="space-y-4">
              <z-skeleton class="h-32 w-full"></z-skeleton>
              <z-skeleton class="h-48 w-full"></z-skeleton>
              <z-skeleton class="h-24 w-full"></z-skeleton>
            </div>
          </z-content>

          <z-footer>
            <div class="text-muted-foreground flex w-full items-center justify-center text-sm">
              © {{ year }} ZardUI
            </div>
          </z-footer>
        </z-layout>
      </z-layout>
    </z-layout>
  `,
})
export class LayoutDemoFullComponent {
  year = new Date().getFullYear();
}

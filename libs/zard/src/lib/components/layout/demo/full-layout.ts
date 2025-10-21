import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardSkeletonComponent } from '../../skeleton/skeleton.component';
import { ContentComponent } from '../content.component';
import { FooterComponent } from '../footer.component';
import { HeaderComponent } from '../header.component';
import { LayoutComponent } from '../layout.component';
import { SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent } from '../sidebar.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { Bell, House, Layers, Search, Users } from 'lucide-angular';

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
    <z-layout class="min-h-[600px] border rounded-md overflow-hidden">
      <z-header>
        <div class="flex items-center justify-between w-full">
          <div class="font-semibold text-lg flex items-center">
            <img src="images/zard.svg" alt="Logo" width="24" height="24" />
            <span class="ml-2">ZardUI</span>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zType="ghost" zSize="sm">
              <z-icon [zType]="SearchIcon" />
            </button>
            <button z-button zType="ghost" zSize="sm">
              <z-icon [zType]="BellIcon" />
            </button>
          </div>
        </div>
      </z-header>

      <z-layout>
        <z-sidebar [zWidth]="200" class="!p-0">
          <nav class="flex flex-col h-full gap-2 p-4">
            <z-sidebar-group>
              <z-sidebar-group-label>Menu</z-sidebar-group-label>
              <button z-button zType="secondary" class="justify-start">
                <z-icon [zType]="HouseIcon" class="mr-2" />
                Dashboard
              </button>
              <button z-button zType="ghost" class="justify-start">
                <z-icon [zType]="LayersIcon" class="mr-2" />
                Projects
              </button>
              <button z-button zType="ghost" class="justify-start">
                <z-icon [zType]="UsersIcon" class="mr-2" />
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
            <div class="flex items-center justify-center w-full text-sm text-muted-foreground">© {{ year }} ZardUI</div>
          </z-footer>
        </z-layout>
      </z-layout>
    </z-layout>
  `,
})
export class LayoutDemoFullComponent {
  readonly SearchIcon = Search;
  readonly BellIcon = Bell;
  readonly HouseIcon = House;
  readonly LayersIcon = Layers;
  readonly UsersIcon = Users;

  year = new Date().getFullYear();
}

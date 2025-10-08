```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardMenuModule } from '../../menu/menu.module';
import { ContentComponent } from '../content.component';
import { HeaderComponent } from '../header.component';
import { LayoutComponent } from '../layout.component';
import { SidebarComponent } from '../sidebar.component';

@Component({
  selector: 'z-demo-layout-menu',
  standalone: true,
  imports: [LayoutComponent, HeaderComponent, ContentComponent, SidebarComponent, ZardButtonComponent, ZardMenuModule],
  template: `
    <z-layout class="min-h-[500px] border rounded-md overflow-hidden">
      <z-header>
        <img src="https://zardui.com/images/zard.svg" alt="Zard UI" width="24" height="24" />

        <span class="font-semibold text-lg pl-2">Zard UI</span>
      </z-header>

      <z-layout class="min-h-[500px]">
        <z-sidebar [zWidth]="250" class="!p-0">
          <nav class="flex flex-col p-4 gap-1">
            <button z-button zType="ghost" class="justify-start">
              <i class="icon-house mr-2"></i>
              <span>Home</span>
            </button>
            <button z-button zType="ghost" class="justify-start">
              <i class="icon-inbox mr-2"></i>
              <span>Inbox</span>
            </button>

            <button z-button zType="ghost" z-menu [zMenuTriggerFor]="projectsMenu" zPlacement="rightTop" class="justify-start">
              <i class="icon-folder mr-2"></i>
              <span class="flex-1 text-left">Projects</span>
              <i class="icon-chevron-right"></i>
            </button>

            <ng-template #projectsMenu>
              <div z-menu-content class="w-48">
                <button z-menu-item>Design System</button>
                <button z-menu-item>Mobile App</button>
                <button z-menu-item>Website</button>
              </div>
            </ng-template>

            <button z-button zType="ghost" class="justify-start">
              <i class="icon-calendar mr-2"></i>
              <span>Calendar</span>
            </button>
            <button z-button zType="ghost" class="justify-start">
              <i class="icon-search mr-2"></i>
              <span>Search</span>
            </button>
          </nav>
        </z-sidebar>

        <z-content>
          <h2 class="text-2xl font-bold mb-4">Welcome</h2>
          <p class="text-muted-foreground">Example of sidebar layout with navigation menu and expandable subitems.</p>
        </z-content>
      </z-layout>
    </z-layout>
  `,
})
export class LayoutDemoMenuComponent {}

```
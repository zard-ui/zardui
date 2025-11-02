import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';

@Component({
  selector: 'z-sidebar',
  template: `
    <aside class="hidden max-h-[calc(100vh-5rem)] w-[var(--sidebar-width)] shrink-0 flex-col bg-transparent lg:flex">
      <nav class="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        @for (doc of sidebarPaths; track $index) {
          <div class="relative flex w-full min-w-0 flex-col p-2">
            <ul class="flex w-full min-w-0 flex-col gap-0.5">
              <h1
                class="text-muted-foreground flex h-8 shrink-0 items-center px-2 text-[0.8rem] font-medium outline-hidden"
              >
                {{ doc.title }}
              </h1>
              @for (path of doc.data; track $index) {
                <li class="relative">
                  <a
                    z-button
                    zSize="sm"
                    zType="ghost"
                    zFull
                    [routerLink]="path.path"
                    class="max-w-48 justify-between px-2 py-1 font-normal"
                    routerLinkActive="bg-accent font-semibold"
                    [routerLinkActiveOptions]="{ exact: true }"
                  >
                    {{ path.name }}
                    @if (!path.available) {
                      <z-badge zType="secondary" class="px-1 py-0">soon</z-badge>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>
    </aside>
  `,
  host: {
    class: 'z-30 sticky top-20',
  },
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
})
export class SidebarComponent {
  readonly sidebarPaths = SIDEBAR_PATHS;
}

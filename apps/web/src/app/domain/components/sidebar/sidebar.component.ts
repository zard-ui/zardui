import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';

@Component({
  selector: 'z-sidebar',
  template: `
    <aside class="border-grid fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky xl:block">
      <nav class="py-6 pr-4 grid gap-8 overflow-auto no-scrollbar h-full">
        @for (doc of sidebarPaths; track $index) {
          <ul class="grid gap-2">
            <h1 class="px-2 font-semibold">{{ doc.title }}</h1>
            @for (path of doc.data; track $index) {
              <li class="text-sm">
                <a
                  z-button
                  zType="ghost"
                  zFull
                  [routerLink]="path.path"
                  class="justify-between px-2 py-1 h-8 font-normal capitalize"
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
        }
      </nav>
    </aside>
  `,
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
})
export class SidebarComponent {
  readonly sidebarPaths = SIDEBAR_PATHS;
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SIDEBAR_PATHS } from '@doc/shared/constants/routes.constant';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

import { ScrollOnActiveDirective } from './scroll-on-active.directive';

@Component({
  selector: 'z-sidebar',
  template: `
    <aside
      class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] overscroll-none bg-transparent lg:flex"
    >
      <nav class="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto overflow-x-hidden px-2">
        <div
          class="from-background via-background/80 to-background/50 pointer-events-none sticky -top-1 z-10 h-2 shrink-0 bg-linear-to-b blur-xs"
        ></div>
        @for (doc of sidebarPaths; track $index) {
          <div class="relative flex w-full min-w-0 flex-col p-2">
            <h2 class="text-muted-foreground flex h-8 shrink-0 items-center px-2 text-xs font-medium">
              {{ doc.title }}
            </h2>
            <div class="w-full text-sm">
              <ul class="flex w-full min-w-0 flex-col gap-1">
                @for (path of doc.data; track $index) {
                  <li class="group/menu-item relative">
                    @if (path.available) {
                      <a
                        [routerLink]="path.path"
                        class="ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground 3xl:fixed:w-full 3xl:fixed:max-w-48 relative flex h-[30px] w-fit items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 text-left text-[0.8rem] font-medium outline-hidden transition-[width,height,padding] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
                        routerLinkActive="bg-accent text-accent-foreground border-accent overflow-visible hover:bg-accent"
                        [routerLinkActiveOptions]="{ exact: true }"
                        scrollOnActive
                      >
                        <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"></span>
                        {{ path.name }}
                      </a>
                    } @else {
                      <span
                        class="ring-sidebar-ring 3xl:fixed:w-full 3xl:fixed:max-w-48 relative flex h-[30px] w-fit cursor-not-allowed items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 text-left text-[0.8rem] font-medium outline-hidden transition-[width,height,padding] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md disabled:pointer-events-none disabled:opacity-50"
                      >
                        <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"></span>
                        {{ path.name }}
                        <z-badge zType="secondary" class="px-1 py-0">soon</z-badge>
                      </span>
                    }
                  </li>
                }
              </ul>
            </div>
          </div>
        }
        <div
          class="from-background via-background/80 to-background/50 pointer-events-none sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t blur-xs"
        ></div>
      </nav>
    </aside>
  `,
  host: {
    class: 'z-30 sticky top-20',
  },
  standalone: true,
  imports: [RouterModule, ZardBadgeComponent, ScrollOnActiveDirective],
})
export class SidebarComponent {
  readonly sidebarPaths = SIDEBAR_PATHS;
}

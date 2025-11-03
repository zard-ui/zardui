import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

import { SIDEBAR_PATHS } from '@docs/shared/constants/routes.constant';

@Component({
  selector: 'z-sidebar',
  template: `
    <aside class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] overscroll-none bg-transparent lg:flex">
      <nav class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto no-scrollbar overflow-x-hidden px-2">
        <div class="from-background via-background/80 to-background/50 sticky -top-1 z-10 h-2 shrink-0 bg-linear-to-b blur-xs"></div>
        @for (doc of sidebarPaths; track $index) {
          <div class="relative flex w-full min-w-0 flex-col p-2">
            <h2 class="text-muted-foreground font-medium flex h-8 shrink-0 items-center px-2 text-xs">
              {{ doc.title }}
            </h2>
            <div class="w-full text-sm">
              <ul class="flex w-full min-w-0 flex-col gap-1">
                @for (path of doc.data; track $index) {
                  <li class="group/menu-item relative">
                    <a
                      [routerLink]="path.path"
                      class="relative flex w-fit items-center gap-2 overflow-hidden rounded-md px-2 text-left h-[30px] text-[0.8rem] font-medium outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 3xl:fixed:w-full 3xl:fixed:max-w-48 border border-transparent after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                      routerLinkActive="bg-accent text-accent-foreground border-accent overflow-visible hover:bg-accent"
                      [routerLinkActiveOptions]="{ exact: true }"
                    >
                      <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"></span>
                      {{ path.name }}
                      @if (!path.available) {
                        <z-badge zType="secondary" class="px-1 py-0">soon</z-badge>
                      }
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        }
        <div class="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t blur-xs"></div>
      </nav>
    </aside>
  `,
  host: {
    class: 'z-30 sticky top-20',
  },
  standalone: true,
  imports: [RouterModule, ZardBadgeComponent],
})
export class SidebarComponent {
  readonly sidebarPaths = SIDEBAR_PATHS;
}

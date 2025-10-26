import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-sidebar',
  template: `
    <aside class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] bg-transparent lg:flex">
      <div className="h-(--top-spacing) shrink-0"></div>
      <nav class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto no-scrollbar overflow-x-hidden px-2 pb-12">
        @for (doc of sidebarPaths; track $index) {
          <div class="relative flex w-full min-w-0 flex-col p-2">
            <h1
              class="text-muted-foreground font-medium ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 "
            >
              {{ doc.title }}
            </h1>
            <div class="w-full text-sm">
              <ul class="flex w-full min-w-0 flex-col gap-1">
                @for (path of doc.data; track $index) {
                  <li class="group/menu-item relative">
                    <a
                      [routerLink]="path.path"
                      class="peer/menu-button flex w-fit items-center gap-2 overflow-hidden rounded-md p-2 text-left h-[30px] text-sm font-medium outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabwidthled:pointer-events-none disabled:opacity-50 3xl:fixed:w-full 3xl:fixed:max-w-48 text-[0.8rem] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                      routerLinkActive="bg-accent border-accent relative overflow-visible border border-transparent hover:bg-accent!"
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
          </div>
        }
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

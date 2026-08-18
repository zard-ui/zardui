import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SIDEBAR_PATHS, type NavSection } from '@doc/shared/constants/routes.constant';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

@Component({
  selector: 'z-sidebar',
  template: `
    <aside
      class="text-sidebar-foreground sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] w-(--sidebar-width) flex-col overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
    >
      <div class="h-9"></div>
      <div
        class="from-background via-background/80 to-background/50 absolute top-8 z-10 h-8 w-(--sidebar-menu-width) shrink-0 bg-linear-to-b blur-xs"
      ></div>
      <div
        class="via-border absolute top-12 right-2 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent to-transparent lg:flex"
      ></div>
      <nav
        class="no-scrollbar mr-auto flex min-h-0 w-(--sidebar-menu-width) flex-1 flex-col gap-2 overflow-auto overflow-x-hidden px-2 group-data-[collapsible=icon]:overflow-hidden"
      >
        @for (doc of sidebarPaths; track $index) {
          <div class="relative flex w-full min-w-0 flex-col p-2 pt-6">
            <h2
              class="ring-sidebar-ring text-muted-foreground flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0"
            >
              {{ doc.title }}
            </h2>
            <div class="w-full text-sm">
              <ul class="flex w-full min-w-0 flex-col gap-1">
                @for (path of doc.data; track $index) {
                  <li class="group/menu-item relative">
                    @if (path.available) {
                      @if (path.external) {
                        <a
                          [href]="path.path"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground 3xl:fixed:w-full 3xl:fixed:max-w-48 relative flex h-7.5 w-fit items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 text-left text-[0.8rem] font-medium outline-hidden transition-[width,height,padding] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"></span>
                          {{ path.name }}
                        </a>
                      } @else {
                        <a
                          [routerLink]="path.path"
                          class="ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground 3xl:fixed:w-full 3xl:fixed:max-w-48 relative flex h-7.5 w-fit items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 text-left text-[0.8rem] font-medium outline-hidden transition-[width,height,padding] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
                          routerLinkActive="bg-accent text-accent-foreground border-accent overflow-visible hover:bg-accent"
                        >
                          <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"></span>
                          {{ path.name }}
                        </a>
                      }
                    } @else {
                      <span
                        class="ring-sidebar-ring 3xl:fixed:w-full 3xl:fixed:max-w-48 relative flex h-7.5 w-fit cursor-not-allowed items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 text-left text-[0.8rem] font-medium outline-hidden transition-[width,height,padding] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md disabled:pointer-events-none disabled:opacity-50"
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

  standalone: true,
  // `display: contents` removes the host box from layout so the inner <aside>
  // becomes the direct grid item. Without this, the host wrapper (kept at the
  // aside's own height by the grid's `items-start`) leaves the sticky no travel
  // room and the sidebar scrolls away instead of sticking.
  host: { class: 'contents' },
  imports: [RouterModule, ZardBadgeComponent],
})
export class SidebarComponent {
  readonly sidebarPaths: NavSection[] = SIDEBAR_PATHS;
}

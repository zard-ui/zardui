import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  signal,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  viewChild,
  type OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSlidersHorizontal, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDrawerService } from '@zard/components/drawer/drawer.service';

import { ThemePreviewComponent } from './components/theme-preview/theme-preview.component';
import { ThemeSidebarComponent } from './components/theme-sidebar/theme-sidebar.component';
import { injectIsCompact } from './utils/inject-is-mobile';

/** Persists the notice's dismissal across visits. Guarded with try/catch: SSR has no
 * `localStorage`, and a reader with storage blocked (private mode, disabled cookies)
 * should still be able to dismiss the notice for the current session. */
const NOTICE_STORAGE_KEY = 'zard-themes-cli-create-notice-dismissed';

@Component({
  selector: 'z-themes',
  imports: [ThemeSidebarComponent, ThemePreviewComponent, ZardButtonComponent, ZardAlertComponent, NgIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideSlidersHorizontal, lucideTriangleAlert, lucideX })],
  template: `
    <section class="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
      <h1
        class="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
      >
        Create Your Perfect
        <span class="text-primary">Theme</span>
      </h1>
      <p class="text-foreground max-w-3xl text-base text-balance sm:text-lg">
        Customize colors, radius, and more. Export your theme as CSS variables ready to use in your project with
        Tailwind CSS.
      </p>
      <section class="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">
        <a z-button href="/themes#themes">start customize</a>
        <a z-button zType="ghost" routerLink="/docs/theming">Documentation</a>
      </section>
    </section>

    <section id="themes">
      <div class="container py-8">
        @if (!noticeDismissed()) {
          <z-alert
            class="mb-6"
            zType="default"
            zIcon="lucideTriangleAlert"
            zTitle="This customizer is moving into the CLI"
            [zDescription]="noticeDescription"
            [zAction]="noticeAction"
          />

          <ng-template #noticeDescription>
            <code>zard-cli create</code>
            will bring a deeper, project-level theme customization flow. It has not shipped yet — keep using this page
            to build and export your theme in the meantime.
            <a routerLink="/docs/roadmap" fragment="zard-cli-create">See it on the roadmap</a>
            .
          </ng-template>

          <ng-template #noticeAction>
            <button
              z-button
              zType="ghost"
              zSize="icon-sm"
              (click)="dismissNotice()"
              title="Dismiss"
              aria-label="Dismiss this notice"
            >
              <ng-icon name="lucideX" class="size-4!" />
            </button>
          </ng-template>
        }

        <!--
          Below \`lg\` the sidebar column has nowhere to go, so it becomes a trigger that
          opens the same \`z-theme-sidebar\` in a drawer — the pattern the typeset builder
          already uses for its own code panel. \`lg\`, not \`md\`: a 320px control column
          still fits a \`md\`-\`lg\` laptop about as poorly as the typeset builder's did.
        -->
        <div class="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <p class="text-muted-foreground text-sm">Customize colors, radius, and more.</p>
          <button z-button zType="outline" zSize="sm" class="shrink-0 gap-1.5" (click)="openCustomizer()">
            <ng-icon name="lucideSlidersHorizontal" class="size-4!" />
            Customize
          </button>
        </div>

        <!--
          Fixed, breakpoint-scaled heights instead of \`h-[164vh] max-h-278.25\`: that pair
          could exceed 1100px on a short laptop screen before the cap even applied.
          Sidebar and preview both scroll their own content internally (see each
          component's \`overflow-y-auto\` region), so a modest, content-driven box never
          clips — it just scrolls where it needs to, at any of the checked widths
          (1280x720, 1366x768, 1920x1080 included).
        -->
        <div
          class="bg-background flex h-125 overflow-hidden rounded-xl border shadow-lg md:h-137.5 lg:h-150 xl:h-162.5"
        >
          <aside class="bg-muted/20 hidden w-80 shrink-0 border-r lg:block">
            <z-theme-sidebar />
          </aside>

          <main class="min-w-0 flex-1">
            <z-theme-preview />
          </main>
        </div>
      </div>
    </section>

    <ng-template #customizerTemplate>
      <div class="flex h-[75svh] min-h-0 flex-col lg:h-full">
        <z-theme-sidebar />
      </div>
    </ng-template>
  `,
  styles: `
    .bg-grid-pattern {
      background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
      background-size: 24px 24px;
    }
  `,
})
export class ThemesPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly drawerService = inject(ZardDrawerService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private readonly customizerTemplate = viewChild.required<TemplateRef<unknown>>('customizerTemplate');
  protected readonly isCompact = injectIsCompact();

  protected readonly noticeDismissed = signal(this.readNoticeDismissed());

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setDocsSeo(
      'Theme generator',
      'Customize colors, radius, and more. Export your theme as CSS variables ready to use in your project with Tailwind CSS.',
      '/themes',
      'og-theme-generator.jpg',
    );
  }

  protected dismissNotice(): void {
    this.noticeDismissed.set(true);
    this.writeNoticeDismissed();
  }

  /** The same `z-theme-sidebar` the column renders, opened as a sheet: bottom on a phone, a side sheet on a tablet. */
  protected openCustomizer(): void {
    this.drawerService.create({
      zTitle: 'Customize',
      zDescription: 'Pick a style and color for your theme.',
      zContent: this.customizerTemplate(),
      zViewContainerRef: this.viewContainerRef,
      zPlacement: this.isCompact() ? 'bottom' : 'right',
      zHandle: this.isCompact(),
      zHideFooter: true,
    });
  }

  private readNoticeDismissed(): boolean {
    if (!this.isBrowser) return false;

    try {
      return localStorage.getItem(NOTICE_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private writeNoticeDismissed(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(NOTICE_STORAGE_KEY, '1');
    } catch {
      // Storage blocked (private mode, disabled cookies) — the dismissal just won't persist.
    }
  }
}

import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { ThemePreviewComponent } from './components/theme-preview/theme-preview.component';
import { ThemeSidebarComponent } from './components/theme-sidebar/theme-sidebar.component';

@Component({
  selector: 'app-themes-page',
  standalone: true,
  imports: [ThemeSidebarComponent, ThemePreviewComponent, ZardButtonComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
        <div class="bg-background flex h-[164vh] max-h-278.25 overflow-hidden rounded-xl border shadow-lg">
          <aside class="bg-muted/20 hidden w-80 shrink-0 border-r md:block">
            <app-theme-sidebar />
          </aside>

          <main class="flex-1">
            <app-theme-preview />
          </main>
        </div>
      </div>
    </section>
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

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setDocsSeo(
      'Theme generator',
      'Customize colors, radius, and more. Export your theme as CSS variables ready to use in your project with Tailwind CSS.',
      '/themes',
      'og-theme-generator.jpg',
    );
  }
}

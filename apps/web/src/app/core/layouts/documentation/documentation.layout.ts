import { isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardToastComponent } from '@zard/components/toast/toast.component';
import { BannerComponent } from '../../../domain/components/banner/banner.component';
import { FooterComponent } from '../../../domain/components/footer/footer.component';
import { HeaderComponent } from '../../../domain/components/header/header.component';
import { SidebarComponent } from '../../../domain/components/sidebar/sidebar.component';
import { DarkModeService } from '../../../shared/services/darkmode.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'z-documentation',
  template: `
    @if (isDevEnv) {
      <z-banner [isDevMode]="isDevMode">
        @if (isDevMode) {
          You're in <b>DEV</b> Mode!
        } @else {
          Welcome to Zard ui <b class="text-red-400 font-semibold">DEV</b> enviroment!
        }
      </z-banner>
    }
    <z-header></z-header>

    <main class="flex items-start max-w-[var(--breakpoint-2xl)] min-h-min mx-auto mt-8 relative">
      <z-sidebar></z-sidebar>
      <section class="flex-1 min-w-0">
        <router-outlet></router-outlet>
      </section>
    </main>
    <z-footer></z-footer>
    <z-toaster [theme]="currentTheme()" />
  `,
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, BannerComponent, SidebarComponent, ZardToastComponent],
})
export class DocumentationLayout {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly darkModeService = inject(DarkModeService);
  readonly isDevEnv = !environment.production;
  readonly isDevMode = environment.devMode;

  private readonly themeSignal = signal<'light' | 'dark'>('light');
  readonly currentTheme = computed(() => this.themeSignal());

  constructor() {
    // Initialize theme signal with current theme
    this.themeSignal.set(this.darkModeService.getCurrentTheme());

    // Watch for theme changes by observing the document's class changes
    if (this.isBrowser) {
      effect(() => {
        const observer = new MutationObserver(() => {
          const newTheme = this.darkModeService.getCurrentTheme();
          if (newTheme !== this.themeSignal()) {
            this.themeSignal.set(newTheme);
          }
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class', 'data-theme'],
        });

        return () => observer.disconnect();
      });
    }
  }
}

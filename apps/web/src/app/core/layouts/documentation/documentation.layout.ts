import { Component, computed, inject, signal, afterNextRender, DestroyRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardToastComponent } from '@zard/components/toast/toast.component';
import { BannerComponent } from '@zard/domain/components/banner/banner.component';
import { FooterComponent } from '@zard/domain/components/footer/footer.component';
import { HeaderComponent } from '@zard/domain/components/header/header.component';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';
import { environment } from '@zard/env/environment';
import { DarkModeService } from '@zard/shared/services/darkmode.service';

@Component({
  selector: 'z-documentation',
  template: `
    @if (isDevEnv) {
      <z-banner [isDevMode]="isDevMode">
        @if (isDevMode) {
          You're in <b>DEV</b> Mode!
        } @else {
          Welcome to Zard ui <b class="font-semibold text-red-400">DEV</b> enviroment!
        }
      </z-banner>
    }
    <z-header></z-header>

    <main class="relative mx-auto mt-8 flex min-h-min max-w-[var(--breakpoint-2xl)] items-start">
      <z-sidebar></z-sidebar>
      <section class="min-w-0 flex-1">
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
  private readonly darkModeService = inject(DarkModeService);
  private readonly destroyRef = inject(DestroyRef);
  readonly isDevEnv = !environment.production;
  readonly isDevMode = environment.devMode;

  private readonly themeSignal = signal<'light' | 'dark'>('light');
  readonly currentTheme = computed(() => this.themeSignal());

  constructor() {
    this.themeSignal.set(this.darkModeService.getCurrentTheme());

    afterNextRender(() => {
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

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

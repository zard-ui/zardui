import { Component, computed, inject, signal, afterNextRender, DestroyRef } from '@angular/core';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';
import { HeaderComponent } from '@zard/domain/components/header/header.component';
import { FooterComponent } from '@zard/domain/components/footer/footer.component';
import { BannerComponent } from '@zard/domain/components/banner/banner.component';
import { ZardToastComponent } from '@zard/components/toast/toast.component';
import { DarkModeService } from '@zard/shared/services/darkmode.service';
import { environment } from '@zard/env/environment';
import { RouterModule } from '@angular/router';

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

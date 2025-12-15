import { Component, computed, inject, signal, afterNextRender, DestroyRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '@doc/domain/components/footer/footer.component';
import { HeaderComponent } from '@doc/domain/components/header/header.component';
import { SidebarComponent } from '@doc/domain/components/sidebar/sidebar.component';
import { environment } from '@doc/env/environment';

import { ZardToastComponent } from '@zard/components/toast/toast.component';
import { DarkModeOptions, ZardDarkMode } from '@zard/services/dark-mode';

@Component({
  selector: 'z-documentation',
  template: `
    <z-header></z-header>
    <main class="container-wrapper flex flex-1 flex-col px-2">
      <div
        class="group/sidebar-wrapper 3xl:fixed:container 3xl:fixed:px-3 flex min-h-min w-full flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]"
      >
        <z-sidebar></z-sidebar>
        <section class="mt-4 h-full w-full">
          <router-outlet></router-outlet>
        </section>
      </div>
    </main>
    <z-footer></z-footer>
    <z-toaster [theme]="currentTheme()" />
  `,
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, SidebarComponent, ZardToastComponent],
})
export class DocumentationLayout {
  private readonly darkModeService = inject(ZardDarkMode);
  private readonly destroyRef = inject(DestroyRef);
  readonly isDevEnv = !environment.production;

  private readonly themeSignal = signal<DarkModeOptions>(this.darkModeService.getCurrentTheme());
  readonly currentTheme = computed(() => this.themeSignal());

  constructor() {
    afterNextRender(() => {
      if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
        return;
      }

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

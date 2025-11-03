import { Component, computed, inject, signal, afterNextRender, DestroyRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardToastComponent } from '@zard/components/toast/toast.component';

import { FooterComponent } from '@docs/domain/components/footer/footer.component';
import { HeaderComponent } from '@docs/domain/components/header/header.component';
import { SidebarComponent } from '@docs/domain/components/sidebar/sidebar.component';
import { environment } from '@docs/env/environment';
import { DarkModeService } from '@docs/shared/services/darkmode.service';

@Component({
  selector: 'z-documentation',
  template: `
    <z-header></z-header>
    <main class="container-wrapper flex flex-1 flex-col px-2">
      <div
        class="group/sidebar-wrapper flex w-full 3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]"
      >
        <z-sidebar></z-sidebar>
        <section class="h-full w-full mt-4">
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

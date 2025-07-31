import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '@zard/domain/components/banner/banner.component';
import { FooterComponent } from '@zard/domain/components/footer/footer.component';
import { HeaderComponent } from '@zard/domain/components/header/header.component';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';
import { environment } from '@zard/env/environment';

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
  `,
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, BannerComponent, SidebarComponent],
})
export class DocumentationLayout {
  readonly isDevEnv = !environment.production;
  readonly isDevMode = environment.devMode;
}

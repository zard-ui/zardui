import { HeaderComponent } from '@zard/domain/components/header/header.component';
import { FooterComponent } from '@zard/domain/components/footer/footer.component';
import { BannerComponent } from '@zard/domain/components/banner/banner.component';
import { environment } from '@zard/env/environment';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-shell',
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

    <main class="flex flex-col px-2 max-w-[var(--breakpoint-2xl)] mx-auto mt-4">
      <router-outlet></router-outlet>
    </main>
    <z-footer></z-footer>
  `,
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, BannerComponent],
})
export class ShellLayout {
  readonly isDevEnv = !environment.production;
  readonly isDevMode = environment.devMode;
}

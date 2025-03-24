import { HeaderComponent } from '@zard/domain/components/header/header.component';
import { FooterComponent } from '@zard/domain/components/footer/footer.component';
import { BannerComponent } from '@zard/domain/components/banner/banner.component';
import { environment } from 'apps/web/src/environments/environment';
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

    <main class="relative max-w-[90rem] mx-auto px-4 flex-1 min-h-screen">
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

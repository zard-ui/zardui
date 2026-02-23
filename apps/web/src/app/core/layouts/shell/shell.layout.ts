import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '@doc/domain/components/footer/footer.component';
import { HeaderComponent } from '@doc/domain/components/header/header.component';
import { environment } from '@doc/env/environment';

@Component({
  selector: 'z-shell',
  template: `
    <z-header></z-header>
    <main class="flex flex-col">
      <router-outlet></router-outlet>
    </main>
    @defer (on viewport; hydrate on viewport) {
      <z-footer></z-footer>
    } @placeholder {
      <div class="mt-24 h-64"></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
})
export class ShellLayout {
  readonly isDevEnv = !environment.production;
}

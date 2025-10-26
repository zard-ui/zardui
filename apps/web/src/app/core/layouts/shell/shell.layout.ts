import { HeaderComponent } from '@zard/domain/components/header/header.component';
import { FooterComponent } from '@zard/domain/components/footer/footer.component';
import { environment } from '@zard/env/environment';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-shell',
  template: `
    <z-header></z-header>

    <main class="flex flex-col">
      <router-outlet></router-outlet>
    </main>
    <z-footer></z-footer>
  `,
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
})
export class ShellLayout {
  readonly isDevEnv = !environment.production;
  readonly isDevMode = environment.devMode;
}

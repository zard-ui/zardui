import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { FooterComponent } from '../../../domain/components/footer/footer.component';
import { HeaderComponent } from '../../../domain/components/header/header.component';

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

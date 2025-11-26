import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardBadgeComponent } from '../../../../../../../libs/zard/badge/badge.component';
import { ZardButtonComponent } from '../../../../../../../libs/zard/button/button.component';
import { ZardCardComponent } from '../../../../../../../libs/zard/card/card.component';
import { ZardCheckboxComponent } from '../../../../../../../libs/zard/checkbox/checkbox.component';
import { ZardIconComponent } from '../../../../../../../libs/zard/icon/icon.component';
import { ZardInputDirective } from '../../../../../../../libs/zard/input/input.directive';

@Component({
  selector: 'z-features',
  standalone: true,
  template: `
    <section class="mx-auto min-h-screen max-w-4xl">
      <header>
        <h1 class="mb-8 text-center text-2xl font-semibold xl:text-5xl">Components</h1>
      </header>

      <main class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <z-card zTitle="Button">
          <button z-button>Button</button>
        </z-card>
        <z-card>
          <z-badge>Badge</z-badge>
        </z-card>
        <z-card>
          <span z-checkbox>Checkbox</span>
        </z-card>
        <z-card>
          <input z-input placeholder="Input" />
        </z-card>
      </main>
      <footer class="mt-8 flex justify-center">
        <a z-button zType="ghost" routerLink="/components/button" class="group">
          View all
          <z-icon
            zType="chevron-right"
            class="shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1"
          />
        </a>
      </footer>
    </section>
  `,
  imports: [
    RouterModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardCardComponent,
    ZardBadgeComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardIconComponent,
  ],
})
export class FeaturesComponent {}

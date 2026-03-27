import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';

@Component({
  selector: 'z-features',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    NgIcon,
  ],
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
          <ng-icon
            name="lucideChevronRight"
            class="shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1"
          />
        </a>
      </footer>
    </section>
  `,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class FeaturesComponent {}

import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-features',
  standalone: true,
  template: `
    <section class="min-h-screen max-w-4xl mx-auto">
      <header>
        <h1 class="text-center text-2xl xl:text-5xl font-semibold mb-8">Components</h1>
      </header>

      <main class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
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
      <footer class="flex justify-center mt-8">
        <a z-button zType="ghost" routerLink="/components/button" class="group"
          >View all
          <z-icon zType="chevron-right" class="shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
        </a>
      </footer>
    </section>
  `,
  imports: [RouterModule, ZardCardComponent, ZardButtonComponent, ZardCardComponent, ZardBadgeComponent, ZardCheckboxComponent, ZardInputDirective, ZardIconComponent],
})
export class FeaturesComponent {}

import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCardModule } from '@zard/components/card/card.module';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-showcase',
  standalone: true,
  template: `
    <section class="min-h-screen max-w-4xl mx-auto">
      <header>
        <h1 class="text-center text-2xl xl:text-5xl font-semibold mb-8">Components</h1>
      </header>

      <main class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <z-card>
          <z-card-body class="h-[200px] flex justify-center items-center">
            <button z-button>Button</button>
          </z-card-body>
          <z-card-header class="mt-4 pt-4">
            <z-card-header-title>Button</z-card-header-title>
          </z-card-header>
        </z-card>
        <z-card>
          <z-card-body class="h-[200px] flex justify-center items-center">
            <z-badge>Badge</z-badge>
          </z-card-body>
          <z-card-header class="mt-4 pt-4">
            <z-card-header-title>Badge</z-card-header-title>
          </z-card-header>
        </z-card>
        <z-card>
          <z-card-body class="h-[200px] flex justify-center items-center">
            <span z-checkbox>Checkbox</span>
          </z-card-body>
          <z-card-header class="mt-4 pt-4">
            <z-card-header-title>Checkbox</z-card-header-title>
          </z-card-header>
        </z-card>
        <z-card>
          <z-card-body class="h-[200px] flex justify-center items-center">
            <input z-input placeholder="Input" />
          </z-card-body>
          <z-card-header class="mt-4 pt-4">
            <z-card-header-title>Input</z-card-header-title>
          </z-card-header>
        </z-card>
      </main>
      <footer class="flex justify-center mt-8">
        <a z-button zType="ghost" routerLink="/components/button" class="group"
          >View all
          <i class="icon-chevron-right shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1"></i>
        </a>
      </footer>
    </section>
  `,
  imports: [RouterModule, ZardCardComponent, ZardButtonComponent, ZardCardModule, ZardBadgeComponent, ZardCheckboxComponent, ZardInputDirective],
})
export class ShowcaseComponent {}

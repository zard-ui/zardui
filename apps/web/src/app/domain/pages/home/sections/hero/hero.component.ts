import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { HeroDiagramComponent } from './components/hero-diagram.component';

@Component({
  selector: 'z-new-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, HeroDiagramComponent, ZardButtonComponent],
  template: `
    <div class="relative z-2 mb-0 overflow-hidden md:mb-[60px]">
      <div class="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
        <div class="mx-auto mt-25 max-w-4xl space-y-8 text-center">
          <h1
            class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-6xl xl:tracking-tighter"
          >
            Finally, a real
            <span class="from-foreground to-foreground/70 inline-block bg-linear-to-r bg-clip-text text-transparent">
              &#64;shadcn/ui
            </span>
            <br class="hidden sm:block" />
            alternative for
            <span
              class="bg-linear-to-r from-red-500 to-red-600 bg-clip-text text-transparent dark:from-red-400 dark:to-red-500"
            >
              Angular
            </span>
            .
          </h1>

          <p class="text-foreground max-w-3xl text-base text-balance sm:text-lg">
            Free and open-source components built with
            <span class="text-foreground font-semibold">Angular</span>
            ,
            <span class="text-foreground font-semibold">TypeScript</span>
            and
            <span class="text-foreground font-semibold">Tailwind CSS</span>
            . No hassle, just results.
          </p>

          <div class="flex items-center justify-center gap-2">
            <a z-button routerLink="/docs/installation">Get Started</a>
            <a z-button zType="ghost" routerLink="/docs/components">View Components</a>
          </div>
        </div>
      </div>

      <z-hero-diagram />
    </div>
  `,
  styles: [],
})
export class NewHeroComponent {}

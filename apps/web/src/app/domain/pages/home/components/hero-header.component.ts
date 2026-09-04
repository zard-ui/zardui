import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-hero-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    <section class="border-grid">
      <div class="container-wrapper">
        <div
          class="container flex flex-col items-center gap-2 px-6 pt-8 pb-8 text-center md:pt-16 md:pb-8 lg:pt-20 lg:pb-12 xl:gap-4"
        >
          <a z-badge routerLink="/docs/installation" zType="secondary" class="bg-muted">
            Build your design system in the browser
            <ng-icon name="lucideArrowRight" class="size-3" />
          </a>

          <h1
            class="text-primary leading-tighter max-w-4xl text-3xl font-semibold tracking-tight text-balance lg:leading-[1.1] xl:text-5xl xl:tracking-tighter"
          >
            The Next Level for Your
            <span class="bg-linear-to-r from-[#F80258] via-[#DC1E5A] to-[#5C4EE5] bg-clip-text text-transparent">
              Angular
            </span>
            Projects.
          </h1>

          <p class="text-foreground max-w-4xl text-base text-balance sm:text-lg">
            The shadcn/ui experience, built natively for Angular. Powered by Signals and TailwindCSS v4. SSR compatible,
            zoneless ready. No hassle, just results.
          </p>

          <div class="flex w-full items-center justify-center gap-2 pt-2">
            <a z-button routerLink="/docs/installation" class="h-[35px] rounded-[26px] px-3">Get Started</a>
            <a z-button zType="secondary" routerLink="/docs/components" class="h-9 rounded-[26px] px-3">
              View Components
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroHeaderComponent {}

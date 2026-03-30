import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-hero-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    <section class="border-grid">
      <div class="container-wrapper">
        <div class="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
          <z-badge routerLink="/docs/changelog" zType="secondary">
            <span class="flex size-2 rounded-full bg-[#F80258]" title="New"></span>
            npx zard-cli init
            <ng-icon name="lucideArrowRight" class="size-3" />
          </z-badge>
          <h1
            class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tight"
          >
            The Next Level for Your
            <span class="bg-linear-to-r from-[#F80258] via-[#DC1E5A] to-[#5C4EE5] bg-clip-text text-transparent">
              Angular
            </span>
            Projects.
          </h1>
          <p class="text-foreground max-w-3xl text-base text-balance sm:text-lg">
            The shadcn/ui experience, built natively for Angular. Powered by Signals and TailwindCSS v4. SSR compatible,
            zoneless ready. No hassle, just results.
          </p>
          <div class="flex w-full items-center justify-center gap-2 pt-2">
            <a z-button zSize="sm" routerLink="/docs/installation">Getting started</a>
            <a z-button zType="ghost" zSize="sm" routerLink="/docs/components">View Components</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroHeaderComponent {}

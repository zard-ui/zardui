import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'z-hero-examples-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <div class="container-wrapper section-soft flex-1 pb-6">
      <div class="container overflow-hidden">
        <!-- Mobile Dashboard Image -->
        <section class="border-border/50 -mx-4 w-[160vw] overflow-hidden rounded-lg border md:hidden md:w-[150vw]">
          <img alt="Dashboard" width="1400" height="875" class="block dark:hidden" src="/assets/dashboard-light.png" />
          <img alt="Dashboard" width="1400" height="875" class="hidden dark:block" src="/assets/dashboard-dark.png" />
        </section>

        <!-- Desktop Content (from router) -->
        <section class="theme-container hidden md:block">
          <router-outlet />
        </section>
      </div>
    </div>
  `,
})
export class HeroExamplesGridComponent {}

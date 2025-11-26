import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZardBadgeComponent } from '../../../../../../../libs/zard/badge/badge.component';
import { ZardButtonComponent } from '../../../../../../../libs/zard/button/button.component';
import { ZardIconComponent } from '../../../../../../../libs/zard/icon/icon.component';

@Component({
  selector: 'z-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, ZardIconComponent],
  template: `
    <section class="relative overflow-hidden p-5 md:p-0">
      <div
        class="from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-primary/5 absolute inset-0 bg-gradient-to-br"
      ></div>

      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      ></div>

      <div class="relative z-10 container mx-auto flex min-h-[90vh] items-center justify-center px-4">
        <div class="mx-auto max-w-4xl space-y-8 text-center">
          <h1 class="text-4xl leading-tight font-bold tracking-tight sm:text-5xl xl:text-7xl">
            Finally, a real
            <span class="from-foreground to-foreground/70 inline-block bg-gradient-to-r bg-clip-text text-transparent">
              &#64;shadcn/ui
            </span>
            <br class="hidden sm:block" />
            alternative for
            <span
              class="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent dark:from-red-400 dark:to-red-500"
            >
              Angular
            </span>
            .
          </h1>

          <p class="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
            Free and open-source components built with
            <span class="text-foreground font-semibold">Angular</span>
            ,
            <span class="text-foreground font-semibold">TypeScript</span>
            and
            <span class="text-foreground font-semibold">Tailwind CSS</span>
            . No hassle, just results.
          </p>

          <z-badge zType="secondary" class="px-4 py-1 text-sm">
            Style of &#64;shadcn/ui + power of ng-zorro = &#64;zard/ui ❤️
          </z-badge>

          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              z-button
              routerLink="/docs/components"
              class="group bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3"
            >
              Browse Components
              <z-icon
                zType="chevron-right"
                class="ml-2 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1"
              />
            </a>
            <a z-button zType="outline" routerLink="/docs/installation" class="px-8 py-3">Get Started</a>
          </div>

          <div class="flex items-center justify-center gap-6 pt-8">
            <span class="text-muted-foreground text-sm font-medium">Built with</span>
            <div class="flex items-center gap-4">
              @for (image of stackImages(); track image.src) {
                <div class="transition-transform duration-200 hover:scale-110">
                  <img
                    [src]="image.src"
                    [class]="image.class"
                    [alt]="image.alt"
                    loading="lazy"
                    width="32"
                    height="32"
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly stackImages = signal([
    { src: 'icons/angular.svg', class: 'size-8 invert dark:invert-0', alt: 'Angular logo' },
    { src: 'icons/typescript.svg', class: 'size-8 invert-0 dark:invert', alt: 'TypeScript logo' },
    { src: 'icons/tailwind.svg', class: 'size-8 invert-0 dark:invert', alt: 'Tailwind CSS logo' },
  ]);
}

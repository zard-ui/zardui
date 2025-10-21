import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, ZardIconComponent],
  template: `
    <section class="relative overflow-hidden p-5 md:p-0">
      <div class="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-primary/5"></div>

      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div class="relative z-10 container mx-auto px-4 min-h-[90vh] flex items-center justify-center">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <h1 class="text-4xl sm:text-5xl xl:text-7xl font-bold tracking-tight leading-tight">
            Finally, a real
            <span class="inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">&#64;shadcn/ui</span>
            <br class="hidden sm:block" />
            alternative for
            <span class="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">Angular</span>.
          </h1>

          <p class="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Free and open-source components built with
            <span class="font-semibold text-foreground">Angular</span>, <span class="font-semibold text-foreground">TypeScript</span> and
            <span class="font-semibold text-foreground">Tailwind CSS</span>. No hassle, just results.
          </p>

          <z-badge zType="secondary" class="text-sm px-4 py-1"> Style of &#64;shadcn/ui + power of ng-zorro = &#64;zard/ui ❤️ </z-badge>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a z-button routerLink="/docs/components" class="group bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3">
              Browse Components
              <z-icon zType="ChevronRight" class="shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1 ml-2" />
            </a>
            <a z-button zType="outline" routerLink="/docs/installation" class="px-8 py-3"> Get Started </a>
          </div>

          <div class="flex justify-center items-center gap-6 pt-8">
            <span class="text-sm text-muted-foreground font-medium">Built with</span>
            <div class="flex items-center gap-4">
              @for (image of stackImages(); track image.src) {
                <div class="transition-transform duration-200 hover:scale-110">
                  <img [src]="image.src" [class]="image.class" [alt]="image.alt" loading="lazy" width="32" height="32" />
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

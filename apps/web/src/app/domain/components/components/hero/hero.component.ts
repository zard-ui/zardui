import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-hero',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
  template: `
    <section class="grid items-center justify-center h-[80vh]">
      <section class="flex flex-col justify-center items-center gap-3">
        <z-badge zType="outline" class="px-3 h-8"
          >🏗️
          <div data-orientation="vertical" role="none" class="shrink-0 bg-border w-px mx-2 h-4"></div>
          In development
        </z-badge>

        <h1 class="text-center font-bold text-3xl xl:text-6xl">
          Finally, a real &#64;shadcn/ui <br />
          alternative for <span class="text-red-600/80 dark:text-red-400">Angular</span>.
        </h1>
        <p class="max-w-xl text-balance text-center text-base tracking-tight text-black dark:font-medium dark:text-white md:text-center md:text-lg">
          Free and open-source components built with <b>Angular</b>, <b>Typescript</b> and <b>Tailwind CSS</b>. No hassle, just results.
        </p>
        <z-badge zType="secondary"> Style of &#64;shadcn/ui + power of ng-zorro = &#64;zard/ui ❤️ </z-badge>
        <a z-button routerLink="/components" class="group mt-2">
          Browse Components
          <i class="icon-chevron-right shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1"></i>
        </a>
        <footer class="flex-row gap-4 mx-auto flex items-center mt-4">
          @for (image of stackImages; track $index) {
            <img [src]="image.src" [class]="image.class" [alt]="image.alt" />
          }
        </footer>
      </section>
    </section>
  `,
})
export class HeroComponent {
  readonly stackImages = [
    { src: 'icons/angular.svg', class: 'size-8 invert dark:invert-0', alt: 'angular logo' },
    { src: 'icons/typescript.svg', class: 'size-8 invert-0 dark:invert', alt: 'typescript logo' },
    { src: 'icons/tailwind.svg', class: 'size-8 invert-0 dark:invert', alt: 'tailwind css logo' },
  ];
}

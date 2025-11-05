import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SOCIAL_MEDIAS } from '@doc/shared/constants/medias.constant';
import { SIDEBAR_PATHS } from '@doc/shared/constants/routes.constant';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';

@Component({
  selector: 'z-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardDividerComponent],
  template: `
    <footer class="bg-background mt-24 border-t">
      <div class="container mx-auto px-4 py-16">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div class="lg:col-span-1">
            <div class="flex flex-col space-y-6">
              <div class="space-y-3">
                <div class="flex items-center space-x-2">
                  <div class="from-primary to-primary/80 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br p-1">
                    <img src="/images/zard.svg" alt="ZardUI Logo" class="fill-primary-foreground h-full w-full object-contain brightness-0 invert dark:invert-0" loading="lazy" />
                  </div>
                  <h3 class="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">ZardUI</h3>
                </div>
                <p class="text-muted-foreground max-w-xs text-sm leading-relaxed">
                  The &#64;shadcn/ui alternative for Angular. Beautiful, accessible, and customizable components.
                </p>
              </div>

              <div class="flex flex-wrap gap-3">
                @for (social of socialMedias(); track social.name) {
                  <a
                    z-button
                    zType="outline"
                    zSize="sm"
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    [title]="social.name"
                    class="hover:border-primary/30 hover:bg-primary/5 !p-2 transition-all duration-300 hover:scale-105"
                  >
                    <img
                      [src]="social.icon"
                      [alt]="social.iconAlt"
                      class="size-4 invert-0 transition-transform duration-200 group-hover:scale-110 dark:invert"
                      loading="lazy"
                      width="16"
                      height="16"
                    />
                  </a>
                }
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-foreground relative font-semibold">
              Resources
              <div class="from-primary to-primary/50 absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r"></div>
            </h4>
            <ul class="space-y-3">
              @for (resource of resourceLinks(); track resource.url) {
                <li>
                  <a
                    [href]="resource.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group text-muted-foreground hover:text-foreground flex items-center space-x-2 text-sm transition-all duration-200"
                  >
                    <span class="bg-muted-foreground/30 group-hover:bg-primary h-1.5 w-1.5 rounded-full transition-colors duration-200"></span>
                    <span class="transition-transform duration-200 group-hover:translate-x-1">{{ resource.name }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>

          <div class="hidden space-y-4 lg:block">
            <h4 class="text-foreground relative font-semibold">
              Documentation
              <div class="from-primary to-primary/50 absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r"></div>
            </h4>
            <ul class="space-y-3">
              @for (doc of documentationLinks(); track doc.path) {
                <li>
                  <a [routerLink]="doc.path" class="group text-muted-foreground hover:text-foreground flex items-center space-x-2 text-sm transition-all duration-200">
                    <span class="bg-muted-foreground/30 group-hover:bg-primary h-1.5 w-1.5 rounded-full transition-colors duration-200"></span>
                    <span class="transition-transform duration-200 group-hover:translate-x-1">{{ doc.name }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>

          <div class="hidden space-y-4 lg:block">
            <h4 class="text-foreground relative font-semibold">
              Components
              <div class="from-primary to-primary/50 absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r"></div>
            </h4>
            <ul class="space-y-3">
              @for (component of popularComponents(); track component.path) {
                <li>
                  <a [routerLink]="component.path" class="group text-muted-foreground hover:text-foreground flex items-center space-x-2 text-sm transition-all duration-200">
                    <span class="bg-muted-foreground/30 group-hover:bg-primary h-1.5 w-1.5 rounded-full transition-colors duration-200"></span>
                    <span class="capitalize transition-transform duration-200 group-hover:translate-x-1">{{ component.name }}</span>
                  </a>
                </li>
              }
              <li class="pt-2">
                <a
                  z-button
                  zType="link"
                  zSize="sm"
                  routerLink="/components"
                  class="text-primary hover:text-primary/80 group flex !h-auto items-center space-x-2 !p-0 text-sm transition-all duration-200"
                >
                  <span class="transition-transform duration-200 group-hover:translate-x-1">See all components →</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-16 pt-4">
          <z-divider class="mb-8"></z-divider>
          <div class="flex flex-col items-center justify-between space-y-6 lg:flex-row lg:space-y-0">
            <div class="text-muted-foreground flex flex-col items-center space-y-3 text-sm sm:flex-row sm:space-y-0 sm:space-x-6">
              <div class="flex items-center space-x-2">
                <span class="text-red-500">❤️</span>
                <span>Made with love from</span>
                <span class="text-lg">🇧🇷</span>
              </div>
              <span class="text-border hidden sm:block">•</span>
              <p class="text-center sm:text-left">
                Open source and available on
                <a
                  z-button
                  zType="link"
                  zSize="sm"
                  [href]="githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-foreground hover:text-primary decoration-primary/30 hover:decoration-primary !h-auto !p-0 font-medium underline underline-offset-4 transition-all duration-200"
                >
                  GitHub
                </a>
              </p>
            </div>

            <div class="mb-10 flex items-center space-x-2 text-sm lg:mb-0">
              <div class="bg-background/80 border-border/50 text-muted-foreground rounded-full border px-3 py-1.5">
                <span>© {{ currentYear }} ZardUI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly githubUrl = SOCIAL_MEDIAS.find(media => media.name === 'GitHub')?.url;

  readonly socialMedias = signal(SOCIAL_MEDIAS);

  readonly documentationLinks = signal(SIDEBAR_PATHS[0].data.filter(doc => doc.available));

  readonly popularComponents = signal(SIDEBAR_PATHS[1].data.filter(component => component.available).slice(0, 8));

  readonly resourceLinks = signal([
    { name: 'GitHub Repository', url: 'https://github.com/zard-ui/zardui' },
    { name: 'NPM Package', url: 'https://www.npmjs.com/package/@ngzard/ui' },
    { name: 'Discord Community', url: 'https://discord.com/invite/yP8Uj9rAX9' },
    { name: 'WhatsApp Group', url: 'https://chat.whatsapp.com/Dctdh6Huhvm24OX6js5XKT' },
    { name: 'Follow us on X', url: 'https://x.com/zard_ui' },
  ]);
}

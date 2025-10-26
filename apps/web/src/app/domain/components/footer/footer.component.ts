import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SOCIAL_MEDIAS } from '@zard/shared/constants/medias.constant';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardDividerComponent],
  template: `
    <footer class="mt-24 border-t bg-background">
      <div class="container mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div class="lg:col-span-1">
            <div class="flex flex-col space-y-6">
              <div class="space-y-3">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center p-1">
                    <img src="/images/zard.svg" alt="ZardUI Logo" class="w-full h-full object-contain fill-primary-foreground brightness-0 invert dark:invert-0" loading="lazy" />
                  </div>
                  <h3 class="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">ZardUI</h3>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed max-w-xs">
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
                    class="!p-2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
                  >
                    <img
                      [src]="social.icon"
                      [alt]="social.iconAlt"
                      class="size-4 invert-0 dark:invert group-hover:scale-110 transition-transform duration-200"
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
            <h4 class="font-semibold text-foreground relative">
              Resources
              <div class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </h4>
            <ul class="space-y-3">
              @for (resource of resourceLinks(); track resource.url) {
                <li>
                  <a
                    [href]="resource.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center space-x-2"
                  >
                    <span class="w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-primary rounded-full transition-colors duration-200"></span>
                    <span class="group-hover:translate-x-1 transition-transform duration-200">{{ resource.name }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>

          <div class="hidden lg:block space-y-4">
            <h4 class="font-semibold text-foreground relative">
              Documentation
              <div class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </h4>
            <ul class="space-y-3">
              @for (doc of documentationLinks(); track doc.path) {
                <li>
                  <a [routerLink]="doc.path" class="group text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center space-x-2">
                    <span class="w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-primary rounded-full transition-colors duration-200"></span>
                    <span class="group-hover:translate-x-1 transition-transform duration-200">{{ doc.name }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>

          <div class="hidden lg:block space-y-4">
            <h4 class="font-semibold text-foreground relative">
              Components
              <div class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </h4>
            <ul class="space-y-3">
              @for (component of popularComponents(); track component.path) {
                <li>
                  <a [routerLink]="component.path" class="group text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center space-x-2">
                    <span class="w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-primary rounded-full transition-colors duration-200"></span>
                    <span class="group-hover:translate-x-1 transition-transform duration-200 capitalize">{{ component.name }}</span>
                  </a>
                </li>
              }
              <li class="pt-2">
                <a
                  z-button
                  zType="link"
                  zSize="sm"
                  routerLink="/components"
                  class="!p-0 !h-auto text-sm text-primary hover:text-primary/80 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <span class="group-hover:translate-x-1 transition-transform duration-200">See all components →</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-16 pt-4">
          <z-divider class="mb-8"></z-divider>
          <div class="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
              <div class="flex items-center space-x-2">
                <span class="text-red-500">❤️</span>
                <span>Made with love from</span>
                <span class="text-lg">🇧🇷</span>
              </div>
              <span class="hidden sm:block text-border">•</span>
              <p class="text-center sm:text-left">
                Open source and available on
                <a
                  z-button
                  zType="link"
                  zSize="sm"
                  [href]="githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="!p-0 !h-auto font-medium text-foreground hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all duration-200"
                >
                  GitHub
                </a>
              </p>
            </div>

            <div class="flex items-center space-x-2 text-sm mb-10 lg:mb-0">
              <div class="px-3 py-1.5 rounded-full bg-background/80 border border-border/50 text-muted-foreground">
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

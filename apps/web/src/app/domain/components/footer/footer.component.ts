import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { SOCIAL_MEDIAS } from '@doc/shared/constants/medias.constant';

@Component({
  selector: 'z-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="dark:bg-transparent">
      <div class="container mx-auto px-4 xl:px-6">
        <div class="flex h-26 flex-col items-center justify-between gap-4 sm:h-14 sm:flex-row">
          <div class="flex items-center gap-1">
            @for (social of socialMedias(); track social.name) {
              <a
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                [title]="social.name"
                class="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-md transition-colors"
              >
                <img
                  [src]="social.icon"
                  [alt]="social.iconAlt"
                  class="size-4 opacity-60 transition-opacity hover:opacity-100 dark:invert"
                  loading="lazy"
                  width="16"
                  height="16"
                />
              </a>
            }
          </div>

          <p class="text-muted-foreground text-center text-xs leading-loose sm:text-sm">
            Made with
            <span class="text-red-500">❤</span>
            in Brazil. Open source and available on
            <a
              href="https://github.com/zard-ui/zardui"
              target="_blank"
              rel="noreferrer"
              class="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly socialMedias = signal(SOCIAL_MEDIAS);
}

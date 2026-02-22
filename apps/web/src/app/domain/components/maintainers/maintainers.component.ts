import { Component, input } from '@angular/core';

import { SOCIAL_MEDIAS } from '@doc/shared/constants/medias.constant';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';

export interface MaintainerData {
  login: string;
  name: string;
  role: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Component({
  selector: 'z-maintainers',
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      @for (maintainer of maintainers(); track maintainer.login) {
        <a
          [href]="maintainer.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="group from-card to-card/50 text-card-foreground relative block cursor-pointer overflow-hidden rounded-lg border bg-gradient-to-br p-4 no-underline shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:p-6"
        >
          <div
            class="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>

          <div class="relative flex items-start gap-4">
            <div class="relative shrink-0">
              <div
                class="from-primary/20 to-primary/5 absolute -inset-0.5 rounded-full bg-gradient-to-br opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100"
              ></div>
              <z-avatar
                [zSrc]="maintainer.avatar_url"
                [zAlt]="maintainer.name + ' avatar'"
                [zFallback]="maintainer.name.substring(0, 2).toUpperCase()"
                zSize="md"
                class="ring-border group-hover:ring-primary/30 relative ring-2 transition-all"
              ></z-avatar>
            </div>

            <div class="flex min-w-0 flex-1 flex-col gap-2">
              <div>
                <h3 class="truncate text-base font-semibold">{{ maintainer.name }}</h3>
                <p class="text-muted-foreground text-xs">{{ maintainer.role }}</p>
              </div>

              <div class="flex items-center gap-3">
                <span
                  class="text-muted-foreground group-hover:text-primary inline-flex items-center gap-1.5 text-xs transition-colors"
                >
                  <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-3.5 dark:invert" />
                  <span class="truncate font-mono">@{{ maintainer.login }}</span>
                </span>
              </div>
            </div>
          </div>
        </a>
      }
    </div>
  `,
})
export class MaintainersComponent {
  readonly maintainers = input.required<MaintainerData[]>();
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
}

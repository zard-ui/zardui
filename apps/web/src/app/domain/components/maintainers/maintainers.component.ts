import { Component, input } from '@angular/core';

import { SOCIAL_MEDIAS } from '@doc/shared/constants/medias.constant';

import { ZardAvatarComponent } from '../../../../../../../libs/zard/avatar/avatar.component';

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
    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
      @for (maintainer of maintainers(); track maintainer.login) {
        <div
          class="group relative rounded-lg border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div class="relative flex items-start gap-4">
            <div class="relative shrink-0">
              <div class="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <z-avatar
                [zSrc]="maintainer.avatar_url"
                [zAlt]="maintainer.name + ' avatar'"
                [zFallback]="maintainer.name.substring(0, 2).toUpperCase()"
                zSize="md"
                class="relative ring-2 ring-border group-hover:ring-primary/30 transition-all"
              ></z-avatar>
            </div>

            <div class="flex flex-col gap-2 min-w-0 flex-1">
              <div>
                <h3 class="text-base font-semibold truncate">{{ maintainer.name }}</h3>
                <p class="text-xs text-muted-foreground">{{ maintainer.role }}</p>
              </div>

              <div class="flex items-center gap-3">
                <a
                  [href]="maintainer.html_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-3.5 dark:invert" />
                  <span class="truncate font-mono">@{{ maintainer.login }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MaintainersComponent {
  readonly maintainers = input.required<MaintainerData[]>();
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
}

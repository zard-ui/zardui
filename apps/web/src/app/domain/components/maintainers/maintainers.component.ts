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
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (maintainer of maintainers(); track maintainer.login) {
        <a
          [href]="maintainer.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-card text-card-foreground group hover:bg-accent flex items-center gap-3 rounded-lg border p-3 no-underline transition-colors"
        >
          <z-avatar
            [zSrc]="maintainer.avatar_url"
            [zAlt]="maintainer.name + ' avatar'"
            [zFallback]="maintainer.name.substring(0, 2).toUpperCase()"
            zSize="md"
            class="shrink-0"
          ></z-avatar>

          <div class="flex min-w-0 flex-col gap-0.5">
            <h3 class="truncate text-sm font-medium">{{ maintainer.name }}</h3>
            <span
              class="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-3 dark:invert" />
              <span class="truncate font-mono">{{ maintainer.login }}</span>
            </span>
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

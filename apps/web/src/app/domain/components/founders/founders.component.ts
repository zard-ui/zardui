import { Component, input } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';

import { SOCIAL_MEDIAS } from '../../../shared/constants/medias.constant';

export interface FounderData {
  login: string;
  name: string;
  role: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Component({
  selector: 'z-founders',
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      @for (founder of founders(); track founder.login) {
        <a
          [href]="founder.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-card text-card-foreground group hover:bg-accent flex items-center gap-4 rounded-lg border p-4 no-underline transition-colors"
        >
          <z-avatar
            [zSrc]="founder.avatar_url"
            [zAlt]="founder.name + ' avatar'"
            [zFallback]="founder.name.substring(0, 2).toUpperCase()"
            zSize="lg"
            class="shrink-0"
          ></z-avatar>

          <div class="flex min-w-0 flex-col gap-0.5">
            <h3 class="truncate text-sm font-semibold">{{ founder.name }}</h3>
            <p class="text-muted-foreground truncate text-xs">{{ founder.role }}</p>
            <span
              class="text-muted-foreground group-hover:text-foreground mt-1 inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-3 dark:invert" />
              <span class="truncate font-mono">{{ founder.login }}</span>
            </span>
          </div>
        </a>
      }
    </div>
  `,
})
export class FoundersComponent {
  readonly founders = input.required<FounderData[]>();
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
}

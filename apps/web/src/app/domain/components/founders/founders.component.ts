import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SOCIAL_MEDIAS } from '@doc/shared/constants/medias.constant';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

export interface FounderData {
  login: string;
  name: string;
  role: string;
  badge?: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Component({
  selector: 'z-founders',
  imports: [ZardAvatarComponent, ZardBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      @for (founder of founders(); track founder.login) {
        <a
          [href]="founder.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="from-card to-muted/40 text-card-foreground group hover:border-foreground/20 relative flex flex-col items-center gap-4 overflow-hidden rounded-xl border bg-gradient-to-br p-6 text-center no-underline shadow-sm transition-colors sm:p-8"
        >
          @if (founder.badge) {
            <z-badge zType="secondary" class="absolute top-4 right-4">{{ founder.badge }}</z-badge>
          }

          <z-avatar
            [zSrc]="founder.avatar_url"
            [zAlt]="founder.name + ' avatar'"
            [zFallback]="founder.name.substring(0, 2).toUpperCase()"
            class="ring-background size-20 shrink-0 shadow-md ring-4 transition-transform group-hover:scale-105"
          ></z-avatar>

          <div class="flex w-full min-w-0 flex-col items-center gap-1">
            <h3 class="w-full truncate text-xl font-bold tracking-tight">{{ founder.name }}</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">{{ founder.role }}</p>
          </div>

          <span
            class="bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors"
          >
            <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-3.5 shrink-0 dark:invert" />
            <span class="truncate font-mono">{{ founder.login }}</span>
          </span>
        </a>
      }
    </div>
  `,
})
export class FoundersComponent {
  readonly founders = input.required<FounderData[]>();
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
}

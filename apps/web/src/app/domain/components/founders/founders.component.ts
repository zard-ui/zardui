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
    <div class="flex flex-col gap-6 sm:gap-8">
      @for (founder of founders(); track founder.login) {
        <a
          [href]="founder.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="group from-card to-card/50 text-card-foreground relative block cursor-pointer overflow-hidden rounded-xl border bg-gradient-to-br p-8 no-underline shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl sm:p-10"
        >
          <div
            class="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>

          <div class="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div class="relative shrink-0">
              <div
                class="from-primary/20 to-primary/5 absolute -inset-1 rounded-full bg-gradient-to-br opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100"
              ></div>
              <z-avatar
                [zSrc]="founder.avatar_url"
                [zAlt]="founder.name + ' avatar'"
                [zFallback]="founder.name.substring(0, 2).toUpperCase()"
                zSize="xl"
                class="ring-border group-hover:ring-primary/30 relative ring-2 transition-all"
              ></z-avatar>
            </div>

            <div class="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
              <div class="flex flex-col gap-2">
                <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ founder.name }}</h3>
                <p class="text-primary text-base font-medium sm:text-lg">{{ founder.role }}</p>
              </div>

              <span
                class="text-muted-foreground group-hover:text-primary inline-flex w-fit items-center gap-2 text-sm transition-colors sm:text-base"
              >
                <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-4 sm:h-5 dark:invert" />
                <span class="font-mono">@{{ founder.login }}</span>
              </span>
            </div>
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

import { Component, input } from '@angular/core';

import { ZardAvatarComponent } from '@ngzard/ui/avatar';

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
        <div
          class="group relative rounded-xl border bg-gradient-to-br from-card to-card/50 p-8 sm:p-10 text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div class="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div class="relative shrink-0">
              <div class="absolute -inset-1 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <z-avatar
                [zSrc]="founder.avatar_url"
                [zAlt]="founder.name + ' avatar'"
                [zFallback]="founder.name.substring(0, 2).toUpperCase()"
                zSize="xl"
                class="relative ring-2 ring-border group-hover:ring-primary/30 transition-all"
              ></z-avatar>
            </div>

            <div class="flex flex-col gap-3 sm:gap-4 flex-1 min-w-0">
              <div class="flex flex-col gap-2">
                <h3 class="text-2xl sm:text-3xl font-bold tracking-tight">{{ founder.name }}</h3>
                <p class="text-base sm:text-lg text-primary font-medium">{{ founder.role }}</p>
              </div>

              <a
                [href]="founder.html_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-4 sm:h-5 dark:invert" />
                <span class="font-mono">@{{ founder.login }}</span>
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FoundersComponent {
  readonly founders = input.required<FounderData[]>();
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
}

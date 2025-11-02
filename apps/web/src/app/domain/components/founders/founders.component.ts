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
    <div class="flex flex-col gap-6">
      @for (founder of founders(); track founder.login) {
        <div class="bg-card text-card-foreground rounded-lg border p-6 shadow-sm sm:p-8">
          <div class="flex items-start gap-6">
            <z-avatar
              [zSrc]="founder.avatar_url"
              [zAlt]="founder.name + ' avatar'"
              [zFallback]="founder.name.substring(0, 2).toUpperCase()"
              zSize="lg"
              class="shrink-0"
            ></z-avatar>

            <div class="flex flex-col gap-3">
              <div>
                <h3 class="text-lg font-semibold">{{ founder.name }}</h3>
                <p class="text-muted-foreground text-sm">{{ founder.role }}</p>
              </div>
              <div class="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <a
                  [href]="founder.html_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <img [src]="githubData?.icon" [alt]="githubData?.iconAlt" class="h-4 dark:invert" />
                  GitHub
                </a>
              </div>
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

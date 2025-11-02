import { Component, input } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardTooltipModule } from '@zard/components/tooltip/tooltip';

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Component({
  selector: 'z-contributors',
  standalone: true,
  imports: [ZardAvatarComponent, ZardTooltipModule],
  template: `
    <div class="flex flex-wrap gap-4">
      @for (contributor of contributors(); track contributor.login) {
        <div class="relative" [zTooltip]="contributor.login" zPosition="top" zTrigger="hover">
          <a
            [href]="contributor.html_url"
            target="_blank"
            rel="noopener noreferrer"
            class="block transition-transform hover:scale-110"
          >
            <z-avatar
              [zSrc]="contributor.avatar_url"
              [zAlt]="contributor.login + ' avatar'"
              [zFallback]="contributor.login.substring(0, 2).toUpperCase()"
              zSize="md"
              zShape="rounded"
              class="ring-background hover:ring-primary/20 ring-2 transition-all"
            ></z-avatar>
          </a>
        </div>
      }
    </div>
  `,
})
export class ContributorsComponent {
  readonly contributors = input.required<Contributor[]>();
}

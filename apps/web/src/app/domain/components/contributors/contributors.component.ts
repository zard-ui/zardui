import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ZardAvatarComponent } from '@zard/components/components';
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
  imports: [CommonModule, ZardAvatarComponent, ZardTooltipModule],
  template: `
    <div class="flex flex-wrap gap-4">
      @for (contributor of contributors(); track contributor.login) {
        <div class="relative" [zTooltip]="contributor.login + ' (' + contributor.contributions + ' contributions)'" zPosition="top" zTrigger="hover">
          <a [href]="contributor.html_url" target="_blank" rel="noopener noreferrer" class="block transition-transform hover:scale-110">
            <z-avatar
              [zImage]="{ url: contributor.avatar_url, alt: contributor.login + ' avatar', fallback: contributor.login.substring(0, 2).toUpperCase() }"
              zSize="md"
              class="ring-2 ring-background hover:ring-primary/20 transition-all"
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

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Component({
  selector: 'z-contributors',
  imports: [ZardAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      @for (contributor of contributors(); track contributor.login) {
        <a
          [href]="contributor.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-card text-card-foreground group hover:bg-accent/50 hover:border-foreground/20 flex items-center gap-2.5 rounded-lg border p-2.5 no-underline transition-colors"
        >
          <z-avatar
            [zSrc]="contributor.avatar_url"
            [zAlt]="contributor.login + ' avatar'"
            [zFallback]="contributor.login.substring(0, 2).toUpperCase()"
            class="size-8 shrink-0"
          ></z-avatar>

          <div class="flex min-w-0 flex-col">
            <h3 class="truncate font-mono text-xs font-medium">{{ contributor.login }}</h3>
            <span class="text-muted-foreground truncate text-xs">
              {{ contributor.contributions }} {{ contributor.contributions === 1 ? 'commit' : 'commits' }}
            </span>
          </div>
        </a>
      }
    </div>
  `,
})
export class ContributorsComponent {
  readonly contributors = input.required<Contributor[]>();
}

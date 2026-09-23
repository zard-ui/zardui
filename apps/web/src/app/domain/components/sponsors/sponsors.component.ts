import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';

export interface SponsorData {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

@Component({
  selector: 'z-sponsors',
  imports: [ZardAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      @for (sponsor of sponsors(); track sponsor.login) {
        <a
          [href]="sponsor.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-card text-card-foreground group hover:bg-accent/50 hover:border-foreground/20 flex flex-col items-center gap-3 rounded-xl border p-4 text-center no-underline transition-colors"
        >
          <z-avatar
            [zSrc]="sponsor.avatar_url"
            [zAlt]="sponsor.name + ' avatar'"
            [zFallback]="sponsor.login.substring(0, 2).toUpperCase()"
            class="ring-border/60 size-14 shrink-0 ring-2 transition-transform group-hover:scale-105"
          ></z-avatar>

          <div class="flex w-full min-w-0 flex-col items-center gap-1">
            <h3 class="line-clamp-2 w-full text-sm leading-snug font-semibold">{{ sponsor.name }}</h3>
            <span
              class="text-muted-foreground group-hover:text-foreground w-full truncate font-mono text-xs transition-colors"
            >
              &#64;{{ sponsor.login }}
            </span>
          </div>
        </a>
      }
    </div>
  `,
})
export class SponsorsComponent {
  readonly sponsors = input.required<SponsorData[]>();
}

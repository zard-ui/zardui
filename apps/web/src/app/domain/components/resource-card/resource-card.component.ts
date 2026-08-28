import { Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideFigma, lucideTwitter } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import type { ZardBadgeTypeVariants } from '@zard/components/badge/badge.variants';

export interface ResourceLink {
  url: string;
  text: string;
  icon: 'figma' | 'external' | 'twitter';
  type: 'primary' | 'secondary';
}

export interface ResourceBadge {
  text: string;
  variant: 'premium' | 'free' | 'license';
}

/** Maps a link's icon to the lucide name that draws it. */
const LINK_ICONS: Record<ResourceLink['icon'], string> = {
  figma: 'lucideFigma',
  external: 'lucideExternalLink',
  twitter: 'lucideTwitter',
};

@Component({
  selector: 'z-resource-card',
  imports: [ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideExternalLink, lucideFigma, lucideTwitter })],
  template: `
    <!--
      Header, prose, then a strip of links. What identifies the kit sits on one
      line, the description gets the full width, and the links read as actions
      because they are set apart — rather than stacked in a column beside text
      that is already short.
    -->
    <div class="bg-card text-card-foreground hover:border-ring/40 rounded-lg border transition-colors">
      <div class="flex flex-col gap-3 p-5 sm:p-6">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <div class="flex flex-wrap items-baseline gap-x-2">
            <h3 class="text-base font-semibold">{{ title() }}</h3>
            <span class="text-muted-foreground text-sm">by {{ author() }}</span>
          </div>

          @if (badges().length) {
            <div class="flex flex-wrap items-center gap-2">
              @for (badge of badges(); track badge.text) {
                <z-badge [zType]="badgeType(badge.variant)">{{ badge.text }}</z-badge>
              }
            </div>
          }
        </div>

        <p class="text-muted-foreground text-sm leading-relaxed">{{ description() }}</p>
      </div>

      @if (links().length) {
        <div class="border-border flex flex-wrap items-center gap-x-6 gap-y-2 border-t px-5 py-3 sm:px-6">
          @for (link of links(); track link.url) {
            <a [href]="link.url" target="_blank" rel="noopener noreferrer" [class]="linkClasses(link.type)">
              <ng-icon [name]="iconName(link.icon)" />
              {{ link.text }}
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class ResourceCardComponent {
  readonly title = input.required<string>();
  readonly author = input.required<string>();
  readonly description = input.required<string>();
  readonly badges = input<ResourceBadge[]>([]);
  readonly links = input<ResourceLink[]>([]);

  protected iconName(icon: ResourceLink['icon']): string {
    return LINK_ICONS[icon];
  }

  protected linkClasses(type: 'primary' | 'secondary'): string {
    const base = 'inline-flex items-center gap-2 text-sm whitespace-nowrap [&_svg]:size-4';

    return type === 'primary'
      ? `${base} text-foreground font-medium hover:underline`
      : `${base} text-muted-foreground hover:text-foreground`;
  }

  /**
   * Badge colours come from the theme, not from a hardcoded green/blue pair:
   * the old classes ignored the design tokens and were identical for `premium`
   * and `license`, so the two were indistinguishable anyway.
   */
  protected badgeType(variant: 'premium' | 'free' | 'license'): ZardBadgeTypeVariants {
    switch (variant) {
      case 'premium':
        return 'default';
      case 'free':
        return 'secondary';
      case 'license':
        return 'outline';
    }
  }
}

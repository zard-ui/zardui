import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';

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

/*
 * Lucide dropped its brand icons, and @ng-icons/lucide 36 no longer exports them.
 * These are the same drawings the package shipped up to v33, registered by hand so
 * the links keep their logos.
 */
const lucideFigma = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path></svg>`;
const lucideTwitter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`;

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
  changeDetection: ChangeDetectionStrategy.Eager,
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

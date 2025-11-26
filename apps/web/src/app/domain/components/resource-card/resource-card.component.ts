import { Component, input } from '@angular/core';

import { ZardBadgeComponent } from '../../../../../../../libs/zard/badge/badge.component';

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

@Component({
  selector: 'z-resource-card',
  standalone: true,
  imports: [ZardBadgeComponent],
  template: `
    <div class="bg-card text-card-foreground rounded-lg border p-6 shadow-sm sm:p-8">
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold">{{ title() }}</h3>
            <p class="text-muted-foreground text-sm">
              by
              <strong>{{ author() }}</strong>
            </p>
          </div>
          @if (badges(); as badgeList) {
            <div class="flex items-center gap-2">
              @for (badge of badgeList; track badge.text) {
                <z-badge [class]="getBadgeClasses(badge.variant)">{{ badge.text }}</z-badge>
              }
            </div>
          }
        </div>

        <p class="text-muted-foreground text-sm leading-relaxed">
          {{ description() }}
        </p>

        @if (links(); as linkList) {
          <div class="flex items-center gap-4 pt-2">
            @for (link of linkList; track link.url) {
              <a [href]="link.url" target="_blank" rel="noopener noreferrer" [class]="getLinkClasses(link.type)">
                @switch (link.icon) {
                  @case ('figma') {
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm7.704 0c2.476 0 4.49 2.015 4.49 4.491s-2.014 4.49-4.49 4.49c-2.476 0-4.491-2.015-4.491-4.491s2.015-4.49 4.491-4.49zm0 7.51c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.02-3.019-3.02-3.019 1.355-3.019 3.02 1.354 3.019 3.019 3.019z"
                      />
                    </svg>
                  }
                  @case ('external') {
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  }
                  @case ('twitter') {
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                  }
                }
                {{ link.text }}
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ResourceCardComponent {
  readonly title = input.required<string>();
  readonly author = input.required<string>();
  readonly description = input.required<string>();
  readonly badges = input<ResourceBadge[]>();
  readonly links = input<ResourceLink[]>();

  protected getLinkClasses(type: 'primary' | 'secondary'): string {
    const baseClasses = 'inline-flex items-center gap-2 text-sm';
    return type === 'primary'
      ? `${baseClasses} text-primary hover:underline`
      : `${baseClasses} text-muted-foreground hover:text-foreground`;
  }

  protected getBadgeClasses(variant: 'premium' | 'free' | 'license'): string {
    switch (variant) {
      case 'premium':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-transparent';
      case 'free':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-transparent';
      case 'license':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-transparent';
      default:
        return '';
    }
  }
}

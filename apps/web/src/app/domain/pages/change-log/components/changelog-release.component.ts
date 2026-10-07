import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSparkles } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent, ZardCardContentComponent } from '@zard/components/card/card.component';

import { type ChangelogRelease } from '../entries/changelog-entry.interface';

/**
 * The v1 launch banner — a release moment, not another card in the monthly
 * timeline. Rendered by the changelog page above the timeline for whichever
 * entry carries `release` (there is at most one). Composed entirely from real
 * zard components, same as the rest of this site.
 */
@Component({
  selector: 'z-changelog-release',
  imports: [NgIcon, RouterLink, ZardBadgeComponent, ZardButtonComponent, ZardCardComponent, ZardCardContentComponent],
  template: `
    <z-card class="border-primary/30 from-primary/10 via-card to-card relative overflow-hidden bg-linear-to-br">
      <div
        aria-hidden="true"
        class="bg-primary/10 pointer-events-none absolute -top-24 -right-24 size-64 rounded-full blur-3xl"
      ></div>

      <z-card-content class="relative flex flex-col gap-6">
        <div class="flex flex-wrap items-center gap-3">
          <z-badge>v{{ release().version }}</z-badge>
          <span class="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-medium">
            <ng-icon name="lucideSparkles" aria-hidden="true" class="size-4" />
            Stable release
          </span>
        </div>

        <div>
          <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ release().title }}</h2>
          <p class="text-muted-foreground mt-3 max-w-2xl text-base text-balance">{{ release().summary }}</p>
        </div>

        <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (fact of release().facts; track fact.label) {
            <div class="bg-background/60 rounded-lg border p-4">
              <dt class="text-sm font-medium">{{ fact.label }}</dt>
              <dd class="text-muted-foreground mt-1 text-sm">{{ fact.value }}</dd>
            </div>
          }
        </dl>

        @if (release().cta; as cta) {
          <div>
            <a z-button [routerLink]="cta.link">{{ cta.label }}</a>
          </div>
        }
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSparkles })],
})
export class ChangelogReleaseComponent {
  readonly release = input.required<ChangelogRelease>();
}
